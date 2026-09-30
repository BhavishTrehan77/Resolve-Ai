const { ai } = require("../../config/ai");
const { parseAIJson } = require("../../utils/parseAIJson");

const ALLOWED_CATEGORIES = [
    "NETWORK",
    "HARDWARE",
    "SOFTWARE",
    "DATABASE",
    "SECURITY",
    "ACCESS",
    "CLOUD",
    "OTHER"
];

const ALLOWED_PRIORITIES = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL"
];

const triageAgent = async (ticket) => {
    if (!ticket) {
        throw new Error("Ticket is required");
    }

    const prompt = `You are an IT support triage agent.
Analyze the following support ticket:
Title: ${ticket.title}
Description: ${ticket.description}

Classify the ticket into exact category and priority.
Allowed Categories:
- NETWORK
- HARDWARE
- SOFTWARE
- DATABASE
- SECURITY
- ACCESS
- CLOUD
- OTHER

Allowed Priorities:
- LOW
- MEDIUM
- HIGH
- CRITICAL

Identify the core user intent and provide a concise summary.
Return ONLY valid JSON matching this schema exactly:
{
  "category": "NETWORK",
  "priority": "HIGH",
  "intent": "brief intent description",
  "summary": "concise one-sentence summary"
}`;

    const fallback = {
        category: "OTHER",
        priority: "MEDIUM",
        intent: ticket.title || "IT Support Request",
        summary: ticket.description || "General incident reported"
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const parsed = parseAIJson(response.text, fallback);

        // Sanitize and enforce strict enum validations
        const categoryUpper = (parsed.category || "OTHER").toUpperCase();
        const priorityUpper = (parsed.priority || "MEDIUM").toUpperCase();

        return {
            category: ALLOWED_CATEGORIES.includes(categoryUpper) ? categoryUpper : "OTHER",
            priority: ALLOWED_PRIORITIES.includes(priorityUpper) ? priorityUpper : "MEDIUM",
            intent: parsed.intent || fallback.intent,
            summary: parsed.summary || fallback.summary
        };
    } catch (err) {
        console.warn("Triage Agent fallback activated:", err.message);
        return fallback;
    }
};

module.exports = {
    triageAgent
};
