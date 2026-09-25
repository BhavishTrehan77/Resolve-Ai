const { ai } = require("../../config/ai");

const diagnosisAgent = async (ticket, knowledge) => {

    if (!ticket) {
        throw new Error("Ticket is required");
    }

    if (!knowledge || knowledge.length === 0) {
        throw new Error("Knowledge is required");
    }

    const prompt = `
You are an IT support diagnosis agent.

Analyze the following support ticket using the provided
knowledge base information.

TICKET:
${JSON.stringify(ticket)}

KNOWLEDGE:
${JSON.stringify(knowledge)}

Determine the most likely root cause of the issue.

Rules:
- Use only information supported by the ticket and knowledge.
- Do not invent facts.
- Explain briefly why this is the likely root cause.
- Return ONLY valid JSON.

Format:

{
    "rootCause": "...",
    "reasoning": "...",
    "confidence": 0
}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
    });

    return JSON.parse(response.text);
};

module.exports = {
    diagnosisAgent
};