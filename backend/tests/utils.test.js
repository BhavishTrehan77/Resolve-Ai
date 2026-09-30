const { parseAIJson } = require("../utils/parseAIJson");
const { calculateConfidence } = require("../utils/confidence");
const { chunkText } = require("../utils/chunkText");
const { cleanText } = require("../utils/textCleaner");

describe("AI Utilities & Text Processing", () => {
    describe("parseAIJson", () => {
        it("should parse standard JSON string correctly", () => {
            const raw = '{"category":"NETWORK","priority":"HIGH"}';
            const parsed = parseAIJson(raw, {});
            expect(parsed).toEqual({ category: "NETWORK", priority: "HIGH" });
        });

        it("should parse JSON wrapped in markdown code fences", () => {
            const raw = '```json\n{"category":"SOFTWARE","priority":"LOW"}\n```';
            const parsed = parseAIJson(raw, {});
            expect(parsed).toEqual({ category: "SOFTWARE", priority: "LOW" });
        });

        it("should return fallback if input is invalid", () => {
            const raw = "This is not json";
            const fallback = { fallback: true };
            const parsed = parseAIJson(raw, fallback);
            expect(parsed).toEqual(fallback);
        });

        it("should extract embedded JSON within conversational text", () => {
            const raw = 'Here is the diagnosis:\n{"rootCause":"DNS misconfiguration","confidence":0.85}\nHope this helps!';
            const parsed = parseAIJson(raw, {});
            expect(parsed.rootCause).toBe("DNS misconfiguration");
            expect(parsed.confidence).toBe(0.85);
        });
    });

    describe("calculateConfidence", () => {
        it("should return 0 for empty results", () => {
            expect(calculateConfidence([])).toBe(0);
        });

        it("should compute average score accurately", () => {
            const results = [{ score: 0.8 }, { score: 0.9 }, { score: 0.7 }];
            expect(calculateConfidence(results)).toBe(0.8);
        });
    });

    describe("chunkText & textCleaner", () => {
        it("should clean whitespace and newlines", () => {
            const dirty = "Hello \r\n\n world!   Multiple   spaces.";
            const clean = cleanText(dirty);
            expect(clean).toBe("Hello world! Multiple spaces.");
        });

        it("should chunk long text into segments", () => {
            const words = Array(100).fill("word").join(" ");
            const chunks = chunkText(words, 30, 5);
            expect(chunks.length).toBeGreaterThan(1);
        });
    });
});
