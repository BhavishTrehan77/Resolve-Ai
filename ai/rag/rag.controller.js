const { ragChat } = require("./rag.service")

const RagAns=async(req,resp)=>{
    const{query}=req.body

    const ans=await ragChat(query)

    resp.json({
        ans
    })
}

module.exports={
    RagAns
}