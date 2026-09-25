const { ragChat } = require("../rag/rag.service");

const retrievalAgent=async(query)=>{
     if (!query) {
        throw new Error("Query is required");
    }
    const results=await ragChat(query)

    return{
         context: results.sources,
        confidence: results.confidence,
        rewrittenQuery: results.rewrittenQuery
    }

}
module.exports={
    retrievalAgent
}