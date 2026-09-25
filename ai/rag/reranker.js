const { ai } = require("../../config/ai");


const rerank=async(query,result)=>{
      const documents = result.map((item, index) => `
Document ${index + 1}:  
${item.text}
`).join("\n");
const prompt=`You are document relevance reranker. 
rank the following documents according to how relevant they are to the usery query.

UserQuery:
${query}

Documents:
${documents}

Return ONLY a JSON array containing the document numbers
in order of relevance, most relevant first.

Example:
[2, 1, 3]

`
const response=await ai.models.generateContent({
    model:"gemini-3.6-flash",
    contents:prompt
})

const ranking=JSON.parse(response.text);
return ranking.map(number=>result[number-1])
}

module.exports={
    rerank
}