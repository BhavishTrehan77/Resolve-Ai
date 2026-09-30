const { ai } = require("../../config/ai");
const { calculateConfidence } = require("../../utils/confidence");
const { rerank } = require("./reranker");
const retrival = require("./retrieval");
const { reWriteQuestion } = require("./rewrite");


const ragChat=async(query)=>{
    if(!query){
        throw new Error("Query is required");
    }

    const {rewrittenQuery,results}=await retrival(query)
    const rankedResult=await rerank(query,results)
    const confidence=calculateConfidence(rankedResult)

    const context=rankedResult.map(res=>res.text).join("\n")

    const prompt=`YOU ARE AN AI ASSISTANT. ANSWER THE USERS QUESTION USING ONLY THE PROVIDED CONTEXT CONTEXT ${context}  USERS QUESTION ${query} If the answer is not available in the context, say:
"I don't know based on the available knowledge."`
    const response=await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:prompt
    })
return{
    answer:response.text,
    rewrittenQuery,
    confidence,
    sources:rankedResult
}
}
module.exports={
    ragChat,
}