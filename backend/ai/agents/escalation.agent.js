/**
 * Escalation Agent
 * Evaluates retrieval confidence and diagnosis confidence against a configurable threshold.
 */
const escalationAgent = async ({ ticket, confidence, diagnosis, customThreshold } = {}) => {
    if (!ticket) {
        throw new Error("Ticket is required");
    }

    // Configurable threshold via parameter or environment variable
    const threshold = customThreshold !== undefined
        ? customThreshold
        : (process.env.AI_CONFIDENCE_THRESHOLD ? parseFloat(process.env.AI_CONFIDENCE_THRESHOLD) : 0.70);

    const retConfidence = typeof confidence === "number" ? confidence : 0;
    const diagConfidence = diagnosis && typeof diagnosis.confidence === "number" ? diagnosis.confidence : 0;

    // Check retrieval confidence
    if (retConfidence < threshold) {
        return {
            escalate: true,
            reason: `Low retrieval confidence (${retConfidence.toFixed(2)} < ${threshold.toFixed(2)})`,
            assignedToHuman: true
        };
    }

    // Check diagnosis confidence
    if (diagnosis && diagConfidence < threshold) {
        return {
            escalate: true,
            reason: `Low diagnosis confidence (${diagConfidence.toFixed(2)} < ${threshold.toFixed(2)})`,
            assignedToHuman: true
        };
    }

    // High priority or critical incidents auto-escalate if flagged
    if (ticket.priority === "CRITICAL") {
        return {
            escalate: true,
            reason: "Critical priority incident flagged for human review",
            assignedToHuman: true
        };
    }

    return {
        escalate: false,
        reason: "Sufficient AI confidence with relevant SOP coverage",
        assignedToHuman: false
    };
};

module.exports = {
    escalationAgent
};
