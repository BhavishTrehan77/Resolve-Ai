const { agentOrchestra } = require("../../ai/orchestra/agent.orchestra")
const User = require("../user/user.schema")
const  {Ticket}  = require("./ticket.schema")

const createTicket=async(data)=>{
    const ticket=await Ticket.create(data)
    try {
        const agentRes=await agentOrchestra(ticket)
        ticket.aiTriage = agentRes.triage;
        ticket.aiDiagnosis = agentRes.diagnosis;
        ticket.aiResolution = agentRes.resolution;
        const retConf = agentRes.retrieval?.confidence;
        const diagConf = agentRes.diagnosis?.confidence;
        ticket.aiConfidence = typeof retConf === 'number' && retConf > 0 
            ? retConf 
            : (typeof diagConf === 'number' && diagConf > 0 ? diagConf : 0.5);
        ticket.aiEscalated = agentRes.escalation?.escalate || false;

        if (agentRes.triage?.category) ticket.category = agentRes.triage.category;
        if (agentRes.triage?.priority) ticket.priority = agentRes.triage.priority;

        if (agentRes.escalation?.escalate) {
            ticket.status = "ESCALATED";
        }

        await ticket.save();
        return {ticket, agentRes}
    } catch (err) {
        console.error("AI Orchestra error during ticket creation:", err);
        ticket.aiConfidence = 0.35;
        ticket.aiEscalated = true;
        ticket.status = "ESCALATED";
        ticket.aiDiagnosis = {
            rootCause: "Requires human IT review",
            reasoning: "Auto-escalated to human IT agent for manual diagnosis.",
            confidence: 0.35
        };
        await ticket.save();
        return {ticket, agentRes: null}
    }
}

const getTicketById=async(ticketId, user)=>{
    const ticket=await Ticket.findById(ticketId)
        .populate("createdBy","name email role")
        .populate("assignedTo","name email role");

    if(!ticket){
        throw new Error("Ticket not found");
    }

    if (user) {
        const creatorId = ticket.createdBy?._id?.toString() || ticket.createdBy?.toString();
        const assignedId = ticket.assignedTo?._id?.toString() || ticket.assignedTo?.toString();

        if (user.role === "EMPLOYEE") {
            if (creatorId !== user.id.toString()) {
                throw new Error("Unauthorized to access this ticket");
            }
        } else if (user.role === "AGENT") {
            const isAssigned = assignedId === user.id.toString();
            const isEscalated = ticket.status === "ESCALATED" || ticket.aiEscalated === true;
            if (!isAssigned && !isEscalated) {
                throw new Error("Unauthorized to access this ticket");
            }
        }
        // ADMIN can view all organization tickets
    }

    return ticket;
}

const getAllTicket=async(user)=>{
    if (!user) {
        throw new Error("Authentication required");
    }

    if (user.role === "EMPLOYEE") {
        return await Ticket.find({ createdBy: user.id })
            .populate("createdBy", "name email role")
            .populate("assignedTo", "name email role")
            .sort({ createdAt: -1 });
    }

    if (user.role === "AGENT") {
        return await Ticket.find({ assignedTo: user.id })
            .populate("createdBy", "name email role")
            .populate("assignedTo", "name email role")
            .sort({ createdAt: -1 });
    }

    // ADMIN: All organization tickets
    return await Ticket.find({})
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
}

const updateTicket=async(ticketId, data, user)=>{
    const sanitized = { ...data };
    delete sanitized.createdBy;
    delete sanitized._id;
    delete sanitized.createdAt;
    delete sanitized.updatedAt;
    delete sanitized.aiTriage;
    delete sanitized.aiDiagnosis;
    delete sanitized.aiResolution;
    delete sanitized.aiConfidence;
    delete sanitized.aiEscalated;

    // Only ADMIN can assign tickets via update
    if (!user || user.role !== "ADMIN") {
        delete sanitized.assignedTo;
    }

    if (user && user.role === "AGENT") {
        const existing = await Ticket.findById(ticketId);
        if (!existing) throw new Error("Ticket not found");
        if (!existing.assignedTo || existing.assignedTo.toString() !== user.id.toString()) {
            throw new Error("Unauthorized to update a ticket not assigned to you");
        }
    }

    const ticket=await Ticket.findByIdAndUpdate(ticketId, sanitized, {new:true, runValidators:true})
        .populate("createdBy","name email role")
        .populate("assignedTo","name email role");

    if(!ticket){
        throw new Error("Ticket not found");
    }
    return ticket;
}

const deleteTicket=async(ticketId)=>{
    const ticket=await Ticket.findByIdAndDelete(ticketId)

    if (!ticket) {
        throw new Error("Ticket not found");
    }
    return ticket
}

const getMyTickets=async(userId)=>{
    const total=await Ticket.find({createdBy:userId})
        .populate("createdBy","name email role")
        .populate("assignedTo","name email role")
        .sort({createdAt:-1})
    return total
}

const getMyTicketStatus=async(userId)=>{
   const total=await Ticket.countDocuments({
    createdBy: userId
   })
   const open=await Ticket.countDocuments({
    createdBy:userId,
    status:"OPEN"
   })
   const inProgress=await Ticket.countDocuments({
    createdBy:userId,
    status:"IN_PROGRESS"
   })
   const escalated=await Ticket.countDocuments({
    createdBy:userId,
    status:"ESCALATED"
   })
   const resolved=await Ticket.countDocuments({
    createdBy:userId,
    status:"RESOLVED"
   })
   const closed=await Ticket.countDocuments({
    createdBy:userId,
    status:"CLOSED"
   })


   return{
    total,
    open,
    inProgress,
    escalated,
    resolved,
    closed
   }

}
const assignTicket=async(ticketId,agentId)=>{
    const ticket=await Ticket.findById(ticketId)
    if(!ticket){
        throw new Error("Ticket not found")
    }
    const agent=await User.findById(agentId)
    if(!agent){
        throw new Error("Agent not found")
    }
    if (agent.role !== "AGENT") {
        throw new Error("Selected user is not an agent");
    }
    ticket.assignedTo = agentId;
    if(ticket.status=="ESCALATED"){
        ticket.status="IN_PROGRESS"
    }
    await ticket.save()
    return ticket   
}

const updateAIResolution=async(ticketId,resolution,steps,user,diagnosis)=>{
    const ticket=await Ticket.findById(ticketId);
    if(!ticket){
        throw new Error("Ticket not found");
    }
    if (!ticket.assignedTo && user?.role !== "ADMIN") {
        throw new Error("Ticket is not assigned to an agent");
    }

    if (user && user.role === "AGENT") {
        const assignedId = ticket.assignedTo?.toString();
        if (assignedId !== user.id.toString()) {
            throw new Error("You can only modify the AI resolution for tickets assigned to you");
        }
    }

    if (resolution) {
        ticket.aiResolution={
            resolution,
            steps: steps || ticket.aiResolution?.steps || []
        };
    }
    if (diagnosis) {
        ticket.aiDiagnosis = {
            rootCause: diagnosis.rootCause || ticket.aiDiagnosis?.rootCause,
            reasoning: diagnosis.reasoning || ticket.aiDiagnosis?.reasoning,
            confidence: diagnosis.confidence !== undefined ? diagnosis.confidence : ticket.aiDiagnosis?.confidence
        };
    }
    await ticket.save()
    return ticket
}

const resolveTicket=async(ticketId,user)=>{
    const ticket=await Ticket.findById(ticketId)
    if(!ticket){
         throw new Error("Ticket not found");
    }
    if(!ticket.assignedTo){
        throw new Error("ticket is not assigned to agent")
    }

    if (user && user.role === "AGENT") {
        const assignedId = ticket.assignedTo?._id?.toString() || ticket.assignedTo?.toString();
        if (assignedId !== user.id.toString()) {
            throw new Error("You can only resolve tickets assigned to you");
        }
    }

    if(ticket.status!=="IN_PROGRESS" && ticket.status!=="ESCALATED"){
         throw new Error("Ticket cannot be resolved in current status");
    }
    ticket.status="RESOLVED"
    await ticket.save()
    return ticket
}

const getAssignedTickets = async (agentId) => {
    const tickets = await Ticket.find({ assignedTo: agentId })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
    return tickets;
};

const getEscalatedTickets = async () => {
    const tickets = await Ticket.find({
        $or: [{ status: "ESCALATED" }, { aiEscalated: true }]
    })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
    return tickets;
};

const getAgentStats = async (agentId) => {
    const assigned = await Ticket.countDocuments({ assignedTo: agentId });
    const inProgress = await Ticket.countDocuments({ assignedTo: agentId, status: "IN_PROGRESS" });
    const resolved = await Ticket.countDocuments({ assignedTo: agentId, status: "RESOLVED" });
    const escalated = await Ticket.countDocuments({
        $or: [{ status: "ESCALATED" }, { aiEscalated: true }]
    });
    const totalTickets = await Ticket.countDocuments({});

    return {
        assigned,
        inProgress,
        resolved,
        escalated,
        totalTickets
    };
};

module.exports={
    createTicket,
    getTicketById,
    getAllTicket,
    updateTicket,
    deleteTicket,
    getMyTickets,
    getMyTicketStatus,
    assignTicket,
    updateAIResolution,
    resolveTicket,
    getAssignedTickets,
    getEscalatedTickets,
    getAgentStats
}

