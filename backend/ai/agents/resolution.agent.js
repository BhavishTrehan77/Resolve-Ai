const { ai } = require("../../config/ai");
const { parseAIJson } = require("../../utils/parseAIJson");

const resolutionAgent = async (ticket, diagnosis, Knowledge) => {
    if (!ticket) {
        throw new Error("Ticket is required");
    }

    if (!diagnosis) {
        throw new Error("Diagnosis is required");
    }

    const prompt = `You are an IT support resolution agent.

Create a practical resolution for the following support ticket.

TICKET:
${JSON.stringify(ticket)}

DIAGNOSIS:
${JSON.stringify(diagnosis)}

KNOWLEDGE:
${JSON.stringify(Knowledge)}

Rules:
- Use only the provided ticket, diagnosis and knowledge.
- Do not invent unsupported information.
- Provide clear and practical troubleshooting steps.
- Steps should be ordered logically.
- Return ONLY valid JSON.
- Do not use markdown code fences.

Format:
{
    "resolution": "...",
    "steps": [
        "...",
        "...",
        "..."
    ]
}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    const fallback = {
        resolution: "Pending manual review by human IT support agent.",
        steps: ["Assign to agent", "Diagnose issue", "Implement resolution"]
    };

    return parseAIJson(response.text, fallback);
};

module.exports = {
    resolutionAgent
};