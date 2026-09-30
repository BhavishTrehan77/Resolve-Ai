const { triageAgent } = require("../agents/triage.agent");
const { retrievalAgent } = require("../agents/retrieval.agent");
const { diagnosisAgent } = require("../agents/diagnosis.agent");
const { resolutionAgent } = require("../agents/resolution.agent");
const { escalationAgent } = require("../agents/escalation.agent");

const agentOrchestrator = async (ticket) => {
    if (!ticket) {
        throw new Error("Ticket is required");
    }

    
    const triage = await triageAgent(ticket);

    
    const retrieval = await retrievalAgent(`${triage.summary} ${triage.intent}`);

  
    const diagnosis = await diagnosisAgent(ticket, retrieval.contextText || retrieval.context);

    
    const resolution = await resolutionAgent(ticket, diagnosis, retrieval.contextText || retrieval.context);

    
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
