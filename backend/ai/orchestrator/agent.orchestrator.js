const { triageAgent } = require("../agents/triage.agent");
const { retrievalAgent } = require("../agents/retrieval.agent");
const { diagnosisAgent } = require("../agents/diagnosis.agent");
const { resolutionAgent } = require("../agents/resolution.agent");
const { escalationAgent } = require("../agents/escalation.agent");

const agentOrchestrator = async (ticket) => {
    if (!ticket) {
        throw new Error("Ticket is required");
    }

    // 1. Triage Agent: Classify category, priority, and intent
    const triage = await triageAgent(ticket);

    // 2. Retrieval Agent: Semantic Vector search across organizational SOPs
    const retrieval = await retrievalAgent(`${triage.summary} ${triage.intent}`);

    // 3. Diagnosis Agent: Determine root cause based on retrieved technical documentation
    const diagnosis = await diagnosisAgent(ticket, retrieval.contextText || retrieval.context);

    // 4. Resolution Agent: Formulate practical, step-by-step resolution plan
    const resolution = await resolutionAgent(ticket, diagnosis, retrieval.contextText || retrieval.context);

    // 5. Escalation Agent: Evaluate confidence and decide human intervention
    const escalation = await escalationAgent({
        ticket,
        confidence: retrieval.confidence,
        diagnosis
    });

    return {
        triage,
        retrieval,
        diagnosis,
        resolution,
        escalation
    };
};

module.exports = {
    agentOrchestrator,
    agentOrchestra: agentOrchestrator
};
