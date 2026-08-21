'use client'
import { useState, useRef, useEffect } from "react"
import ChatBubbles from "../chatbubbles/page"
import Image from "next/image"

function ChatPage() {
  type MessageListType = {[key:string]:string}

  const [pageType,setPageType] = useState(1)
  const [messageList,setMessageList] = useState<MessageListType[]|undefined>([])
  const [sentMessageToAI,setSentMessageToAI] = useState("")
  const [scrollButton,setScrollButton] = useState(false)
  const shouldAutoScroll = useRef<boolean>(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef1 = useRef<HTMLTextAreaElement>(null)
  const inputRef2 = useRef<HTMLTextAreaElement>(null)

  function scrollToBottom(){
    if(shouldAutoScroll.current)
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
  }

  async function addToMessageList(e: React.MouseEvent<HTMLButtonElement, MouseEvent>| React.KeyboardEvent<HTMLTextAreaElement> | KeyboardEvent){
    e.preventDefault()
    let message = ""
    if(inputRef1.current){
      message = inputRef1.current.value
      inputRef1.current.value = ""
    }
    if(inputRef2.current){
      message = inputRef2.current.value
      inputRef2.current.value = ""
    }
    shouldAutoScroll.current = true
    if(message.trim() !== ""){
      if(pageType === 1)
        setPageType(2)
      const newMessageList:MessageListType[] = [...(messageList || []),{message:message,bubble:"right"}]
      setMessageList(newMessageList)
      setSentMessageToAI(message.trim())
    }
  }

  function goDown(){
    window.scroll({
      top: document.documentElement.scrollHeight,
      behavior:"smooth"
    })
    
    //console.log(window.scrollY,bottomRef.current?.scrollTop,bottomRef.current?.clientHeight,bottomRef.current?.scrollHeight)
  }

  //example of how react state works when initialized with addevent listner. Since the scrollButton state is initialized with false, it will always be false inside the event listener.
  function checkScroll(){
    // console.log(window.scrollY,window.innerHeight,document.documentElement.scrollHeight)
    //console.log(document.documentElement.scrollHeight - (window.scrollY + window.innerHeight), scrollButton)
    if(document.documentElement.scrollHeight - (window.scrollY + window.innerHeight) >= 200){
      //console.log("inside true")
      setScrollButton(true)}
    else{
      //console.log("inside false")
      setScrollButton(false)
    }
    //console.log("after ", scrollButton)
  }

  // adding scroll event listener to check if the page window is at bottom
  useEffect(()=>{
    window.addEventListener("scroll",checkScroll)
    return () => {window.removeEventListener("scroll",checkScroll)}
  },[])

  // effect to scroll to bottom if message is updated to lists
  useEffect(()=>{
    scrollToBottom()
  },[messageList])

  // effect to handle user input so that use dont have to click the input div
  useEffect(()=>{
    const handleKeyDown = (e: KeyboardEvent) => { 
    const input1 = inputRef1.current
    const input2 = inputRef2.current
    //console.log("active element -", document.activeElement, "input1", input1,"input2", input2)
    if(document.activeElement !== input1 && document.activeElement !== input2){
      console.log("test")
      if(e.key !== "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey){
        if(pageType === 1)
          input1?.focus()
        else
          input2?.focus()
      }
    }
    }

    window.addEventListener("keydown",handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  },[pageType])

  // effect to get ai response when user sents a message
  useEffect(()=>{
    if (sentMessageToAI === "") {
      return;
    }

    async function getAIResponse(){
      try {
        shouldAutoScroll.current = false
        if(pageType == 2){
          inputRef2.current!.readOnly = true
          inputRef2.current!.placeholder = "Generating..."
        }

        const result = await fetch("http://localhost:5000/getAIReply",{
          method:"POST",
          headers: {'Content-Type': 'text/plain'},
          body: sentMessageToAI
        })
      
        const reader = result.body!.getReader()
        const decoder = new TextDecoder()
        let finalMessage = ""
        let index = 1

        while(true){
          const { value, done } = await reader.read();

          if(done)
            break

          const chunk = decoder.decode(value)
          finalMessage = finalMessage + chunk
          //console.log(finalMessage,index)
          if(index === 1){
            setMessageList((prevMessage)=>{
              return [...prevMessage!,{message:finalMessage,bubble:"left"}]
            })
          }
          else{
            setMessageList((prevMessage)=>{
              return [...prevMessage!.slice(0,-1),{message:finalMessage,bubble:"left"}]
            })
          }
          index = index + 1
        }

        //console.log(finalMessage)

      } catch {
          const newMessageList:MessageListType[] = [...(messageList || []),{message:"Something happened while fetching result. Please try again later",bubble:"left"}]
          setMessageList(newMessageList)
      }

      if(pageType == 2){
        inputRef2.current!.readOnly = false
        inputRef2.current!.placeholder = "Type your message..."
      }
    }
    
    getAIResponse()
  },[sentMessageToAI])

  return (
    (pageType === 1 ? 
      <div className="flex flex-col h-screen items-center justify-center font-sans">
        <div className = "flex flex-col w-full items-center justify-center gap-4">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200">Ask anything to <b className="text-cyan-600 font-mono">Qwen</b></h1>
          <div className="flex items-center justify-center mt-4 w-full">
            <textarea 
              ref={inputRef1}
              className="w-1/2 placeholder:text-zinc-500 rounded-2xl text-lg p-3 border-2 border-zinc-300 focus:outline-none focus:border-y-cyan-500 focus:border-x-emerald-500" 
              placeholder="Type your message..."
              onKeyDown={(e) => {if(e.key === "Enter" && !e.shiftKey) addToMessageList(e)}} 
            />
            <button className="bg-emerald-600 transition-color duration-400 hover:bg-cyan-600 ml-2 h-12 w-12 rounded-full cursor-pointer" onClick={(e)=>{addToMessageList(e)}}><Image src="/submit.svg" width={80} height={80} className="p-2" alt="Send" /></button>  
          </div>  
        </div>
      </div>
      :
      <div className="flex flex-col items-center h-screen font-mono">
        <ChatBubbles messageList={messageList}/>
        <div ref={bottomRef} className="pb-30 text-center text-sm">Generated by Qwen</div>
        <button className= {`fixed bottom-30 rounded-full p-2 bg-slate-600/60 ${scrollButton ? 'visible' : 'hidden'}`} onClick={goDown}><Image src="/downarrow.svg" width={20} height={20} alt="Down"/></button>
        <div className="fixed bg-slate-50/10 py-2 bottom-0 w-full flex items-center justify-center">
            <textarea ref={inputRef2} className="w-3/4 lg:w-1/2 bg-white dark:bg-slate-700 rounded-2xl p-3 border-2 border-black dark:border-zinc-300 focus:outline-none focus:border-y-cyan-500 focus:border-x-emerald-500" placeholder="Type your message..." onKeyDown={(e) => {if(e.key === "Enter" && !e.shiftKey) addToMessageList(e)}} />
            <button className="bg-emerald-600 transition-color duration-400 hover:bg-cyan-600 ml-2 h-12 w-12 rounded-full cursor-pointer" onClick={(e)=>{addToMessageList(e)}}><Image src="/submit.svg" width={80} height={80} className="p-2" alt="Send" /></button>
        </div>
      </div>
    )
  )
}

export default ChatPage