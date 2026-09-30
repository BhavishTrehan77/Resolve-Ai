const { ai } = require("../../config/ai")

const embedding=async(text)=>{
    const response=await ai.models.embedContent({
        model:"text-embedding-004",
        contents:text
    })
    if (response.embedding && response.embedding.values) {
        return response.embedding.values;
    }
    if (response.embeddings && response.embeddings[0] && response.embeddings[0].values) {
        return response.embeddings[0].values;
    }
    return response.values || [];
}

module.exports=embedding