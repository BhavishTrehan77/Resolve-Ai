const retrieval = require("../rag/retrieval");
const { rerank } = require("../rag/reranker");
const { calculateConfidence } = require("../../utils/confidence");

const retrievalAgent = async (query) => {
    if (!query) {
        throw new Error("Query is required");
    }

    // 1. Rewrite query + Atlas Vector search (with fallback)
    const { rewrittenQuery, results } = await retrieval(query);

    // 2. Rerank retrieved knowledge documents based on relevance
    const rankedResults = await rerank(rewrittenQuery || query, results);

    // 3. Compute retrieval confidence
    const confidence = calculateConfidence(rankedResults);

    // 4. Extract formatted context
    const contextText = (rankedResults || []).map((r) => r.text).join("\n\n");

    return {
        context: rankedResults || [],
        contextText,
        confidence,
        rewrittenQuery: rewrittenQuery || query
    };
};

module.exports = {
    retrievalAgent
};
