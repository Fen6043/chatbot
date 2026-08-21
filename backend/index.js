import express from "express";
import cors from "cors"
import ollama from "ollama"

const app = express()
const port = 5000
let conversationHistory = []

function sliceConversationHistory() {
    let totalLength = 0
    let sliceIndex = -1
    for (let i = conversationHistory.length - 1; i > 0; --i) {
        totalLength += conversationHistory[i].content.length
        if(totalLength>4000){
            sliceIndex = i
            break
        }
    }

    if(sliceIndex > 0)
        conversationHistory = conversationHistory.slice(sliceIndex)
}

app.use(cors())
app.use(express.text())

app.use((req,res,next)=>{
    console.log(req.method,req.url)
    next()
})

app.post("/getAIReply",async (req,res)=>{
    try {
        const message = req.body
        //console.log(message)
        sliceConversationHistory()
        conversationHistory.push({role:"user",content:message})

        const response = await ollama.chat({
          model: "qwen3.5:4b",
          think:false,
          messages: conversationHistory,
          stream: true
        });
        let finalChunk = ""

        for await (const chunk of response) {
            finalChunk += chunk.message.content
            res.write(chunk.message.content)
            //console.log(chunk.message)
        }

        conversationHistory.push({role:"assistant",content:finalChunk})
        //console.log(conversationHistory)
        // console.log("_________________________________________________")
        res.end("\n");
    } catch (error) {
        console.log(error)
        res.send("Error while getting response please try again later")
    }
})

app.listen(port,()=>{
    console.log(`Server opened in ${port}`)
})