/**
 * Utility to reliably extract and parse JSON from AI model outputs.
 * Handles markdown code fences and malformed responses with a fallback.
 */
const parseAIJson = (text, fallback = null) => {
    try {
        if (!text || typeof text !== 'string') {
            return fallback;
        }

        // 1. Direct parse after stripping code fences
        const cleaned = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        try {
            return JSON.parse(cleaned);
        } catch (_) {}

        // 2. Extract outermost { ... } or [ ... ] if surrounded by commentary
        const match = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (match) {
            return JSON.parse(match[0]);
        }

        return fallback;
    } catch (error) {
        return fallback;
    }
};

module.exports = {
    parseAIJson
};
