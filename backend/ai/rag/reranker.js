const { ai } = require("../../config/ai");


const rerank=async(query,result)=>{
    if (!result || result.length === 0) {
        return [];
    }
    if (result.length === 1) {
        return result;
    }

    try {
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
`;
        const response=await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:prompt
        });

        const cleaned = response.text.replace(/```json/gi, "").replace(/```/g, "").trim();
        const ranking = JSON.parse(cleaned);
        const ranked = ranking.map(number=>result[number-1]).filter(Boolean);
        return ranked.length > 0 ? ranked : result;
    } catch (err) {
        console.warn("Reranker fallback:", err.message);
        return result;
    }
}

module.exports={
    rerank
}