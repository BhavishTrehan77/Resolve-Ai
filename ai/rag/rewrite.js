const { ai } = require("../../config/ai")

const reWriteQuestion=async(query)=>{
    const prompt=`You are an IT support query rewriter.

Rewrite the user's query into a clear, specific search query
for an IT support knowledge base.

Rules:
- Do not answer the question.
- Keep the original meaning.
- Remove unnecessary words.
- Make the query specific enough for semantic search.
- Return only the rewritten query.

User query:
${query}`

const response=await ai.models.generateContent({
    model:"gemini-3.5-flash-lite",
    contents:prompt
})
return response.text.trim()
}

module.exports={
    reWriteQuestion
}