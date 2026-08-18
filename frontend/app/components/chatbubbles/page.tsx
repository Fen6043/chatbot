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
              <div className="rounded-xl p-2 bg-gray-600" key={index}>{item.message}</div>
            </div>
        )
      })}
    </div>
  );
}

export default ChatBubbles;