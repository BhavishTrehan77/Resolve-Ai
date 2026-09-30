const { ai } = require("../../config/ai");
const { parseAIJson } = require("../../utils/parseAIJson");

const diagnosisAgent = async (ticket, knowledge) => {

    if (!ticket) {
        throw new Error("Ticket is required");
    }

    const knowledgeText = knowledge && knowledge.length > 0 
        ? JSON.stringify(knowledge) 
        : "No specific company SOP documents found in knowledge base.";

    const prompt = `
You are an IT support diagnosis agent.

Analyze the following support ticket using the provided
knowledge base information.

TICKET:
${JSON.stringify(ticket)}

KNOWLEDGE:
${knowledgeText}

Determine the most likely root cause of the issue.

Rules:
- Use information supported by the ticket and knowledge.
- If knowledge is not available, estimate a probable cause but assign low confidence (around 0.35-0.45).
- Explain briefly why this is the likely root cause.
- Return ONLY valid JSON without markdown code fences.

Format:

{
    "rootCause": "...",
    "reasoning": "...",
    "confidence": 0.45
}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    const fallback = {
        rootCause: "Unable to automatically diagnose root cause",
        reasoning: "Requires human agent investigation.",
        confidence: 0.35
    };

    return parseAIJson(response.text, fallback);
};

module.exports = {
    diagnosisAgent
};