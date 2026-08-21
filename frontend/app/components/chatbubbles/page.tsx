// Here need to use ReactMarkdown to convert markdown text(like #Heading) to HTML(<h1>Heading</h1>).
// remarkGfm plugin helps with Github style markdown (the raw table returned by qwen).
// rehypePrism plugin helps with generated code markdown
// Tailwind Typography plugin prose styles this and global css can be used to customize it.

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'

type MessagePropType = {[key:string]:string}
type MessageListType = {
    messageList: MessagePropType[]|undefined
} 

function ChatBubbles( {messageList} : MessageListType) {
  return (
    <div className="w-full flex flex-col items-center gap-2 pb-6">
      {messageList?.map((item,index)=>{ 
        return(
            <div className={`mt-4 py-1 px-2 w-3/4 flex ${item.bubble === "right" ? "justify-end" : ""}`} key={index}>
              {item.bubble === "right" ?
              <p className="rounded-xl py-2 px-4 mx-2 custom-color whitespace-pre-line border-2 border-emerald-600" key={index}>{item.message}</p>
              :
              <div className='prose prose-lg dark:prose-invert prose-headings:text-cyan-500 custom-color max-w-none rounded-xl py-2 px-4 mx-2 border-2 border-cyan-600'><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypePrism]}>{item.message}</ReactMarkdown></div>}
            </div>
        )
      })}
    </div>
  );
}

export default ChatBubbles;