const { createTicket, getTicketById, getAllTicket, updateTicket, deleteTicket, getMyTickets, getMyTicketStatus, assignTicket, updateAIResolution, resolveTicket, getAssignedTickets, getEscalatedTickets, getAgentStats } = require("./ticket.services");

const createticket=async(req,resp)=>{
    try {
        const payload = { ...req.body };
        delete payload.createdBy;
        delete payload.userId;
        const data=await createTicket({ ...payload, createdBy: req.user.id })
        resp.json({
            success: true,
            data,
            Data: data
        })
    } catch (err) {
        resp.status(400).json({ success: false, message: err.message })
    }
}
const getticket=async(req,resp)=>{
    try {
        const data=await getTicketById(req.params.id, req.user)
        resp.json({
            success: true,
            data,
            Data: data
        })
    } catch (err) {
        const isAuthError = err.message.includes("Unauthorized") || err.message.includes("Forbidden");
        const status = isAuthError ? 403 : 404;
        resp.status(status).json({ success: false, message: err.message })
    }
}

const getAllticket=async(req,resp)=>{
    try {
        const data=await getAllTicket(req.user)
        resp.json({
            success: true,
            data,
            Data: data
        })
    } catch (err) {
        resp.status(400).json({ success: false, message: err.message })
    }
}
const updateticket=async(req,resp)=>{
    try {
        const data=await updateTicket(req.params.id, req.body, req.user)
        resp.json({
            success: true,
            data,
            Data: data
        })
    } catch (err) {
        const isAuthError = err.message.includes("Unauthorized") || err.message.includes("Forbidden");
        resp.status(isAuthError ? 403 : 400).json({ success: false, message: err.message })
    }
}

const Deleteticket=async(req,resp)=>{
    try {
        const data=await deleteTicket(req.params.id)
        resp.json({
            success: true,
            data,
            Data: data
        })
    } catch (err) {
        resp.status(400).json({ success: false, message: err.message })
    }
}

const getMyTicketController=async(req,resp)=>{
    try {
        const data=await getMyTickets(req.user.id)
        resp.json({
            success: true,
            Data:data,
            data
        })
    } catch (err) {
        resp.status(400).json({ success: false, message: err.message })
    }
}

const getTicketStatsController=async(req,resp)=>{
    try {
        const data=await getMyTicketStatus(req.user.id)
        resp.json({
            success: true,
            Data:data,
            data
        })
    } catch (err) {
        resp.status(400).json({ success: false, message: err.message })
    }
}
const assignTicketController = async (req, res) => {
    try {
        const { id } = req.params;
        const { agentId } = req.body;

        const data = await assignTicket(id, agentId);

        res.json({
            success: true,
            Data: data,
            data
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};
const updateAI=async(req,resp)=>{
    try {
        const id = req.params.id || req.body.id;
        const { resolution, steps, diagnosis, rootCause, reasoning } = req.body;
        if (!resolution && !diagnosis && !rootCause) {
            return resp.status(400).json({
                message: "Resolution or diagnosis is required"
            });
        }
        const diagData = diagnosis || (rootCause ? { rootCause, reasoning } : null);
        const data=await updateAIResolution(id, resolution, steps||[], req.user, diagData)

        resp.json({
            success: true,
            Data:data,
            data
        })
    } catch (err) {
        const isAuthError = err.message.includes("only modify") || err.message.includes("Unauthorized");
        resp.status(isAuthError ? 403 : 400).json({ message: err.message });
    }
}

const resolveTicketController = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await resolveTicket(id, req.user);

        res.json({
            success: true,
            Data: data,
            data
        });

    } catch (error) {
        const isAuthError = error.message.includes("only resolve") || error.message.includes("Unauthorized");
        res.status(isAuthError ? 403 : 400).json({
            message: error.message
        });
    }
};

const getAssignedTicketsController = async (req, res) => {
    try {
        const data = await getAssignedTickets(req.user.id);
        res.json({
            success: true,
            data,
            Data: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getEscalatedTicketsController = async (req, res) => {
    try {
        const data = await getEscalatedTickets();
        res.json({
            success: true,
            data,
            Data: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAgentStatsController = async (req, res) => {
    try {
        const data = await getAgentStats(req.user.id);
        res.json({
            success: true,
            data,
            Data: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports={
    createticket,
    getticket,
    getAllticket,
    updateticket,
    Deleteticket,
    getMyTickets,
    getMyTicketController,
    getTicketStatsController,
    assignTicketController,
    updateAI,
    resolveTicketController,
    getAssignedTicketsController,
    getEscalatedTicketsController,
    getAgentStatsController
}