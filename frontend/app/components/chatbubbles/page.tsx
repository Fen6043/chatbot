type MessagePropType = {[key:string]:string}
type MessageListType = {
    messageList: MessagePropType[]|undefined
}

function ChatBubbles( {messageList} : MessageListType) {
  return (
    <div className="w-full flex flex-col items-center gap-2 pb-6">
      {messageList?.map((item,index)=>{ 
        return(
            <div className={`py-1 px-2 w-3/4 flex ${item.bubble === "right" ? "justify-end" : ""}`} key={index}>
              <p className={`rounded-xl py-2 px-4 mx-2 bg-gray-800 whitespace-pre-line border-2 ${item.bubble === "right" ? "border-emerald-800" : "border-cyan-800"}`} key={index}>{item.message}</p>
            </div>
        )
      })}
    </div>
  );
}

export default ChatBubbles;