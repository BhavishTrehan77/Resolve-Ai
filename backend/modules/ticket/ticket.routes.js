const express = require('express');
const { AuthMiddleware } = require('../../middleware/auth');
const { Rbac } = require('../../middleware/rbac');
const { validate } = require('../../middleware/validate');
const {
    createTicketSchema,
    updateTicketSchema,
    assignTicketSchema,
    updateAiResolutionSchema
} = require('./ticket.validation');
const {
    getticket,
    createticket,
    Deleteticket,
    updateticket,
    getAllticket,
    getMyTicketController,
    getTicketStatsController,
    assignTicketController,
    updateAI,
    resolveTicketController,
    getAssignedTicketsController,
    getEscalatedTicketsController,
    getAgentStatsController
} = require('./ticket.controller');

const router = express.Router();

// 1. Employee routes
router.post("/", AuthMiddleware, validate(createTicketSchema), createticket);
router.get("/my/stats", AuthMiddleware, getTicketStatsController);
router.get("/my", AuthMiddleware, getMyTicketController);
router.get("/my-tickets", AuthMiddleware, getMyTicketController);

// 2. Agent Dashboard APIs
router.get("/assigned", AuthMiddleware, Rbac("AGENT", "ADMIN"), getAssignedTicketsController);
router.get("/escalated", AuthMiddleware, Rbac("AGENT", "ADMIN"), getEscalatedTicketsController);
router.get("/agent/stats", AuthMiddleware, Rbac("AGENT", "ADMIN"), getAgentStatsController);

// 3. Organization wide (Admin / Agent / Employee)
router.get("/", AuthMiddleware, getAllticket);

// 4. Ticket parameter routes (must be after named static routes)
router.get("/:id", AuthMiddleware, getticket);
router.patch("/:id", AuthMiddleware, Rbac("ADMIN", "AGENT"), validate(updateTicketSchema), updateticket);
router.delete("/:id", AuthMiddleware, Rbac("ADMIN"), Deleteticket);
router.post("/:id/assign", AuthMiddleware, Rbac("ADMIN"), validate(assignTicketSchema), assignTicketController);
router.put(
    "/:id/ai-resolution",
    AuthMiddleware,
    Rbac("ADMIN", "AGENT"),
    validate(updateAiResolutionSchema),
    updateAI
);
router.put(
    "/:id/resolve",
    AuthMiddleware,
    Rbac("ADMIN", "AGENT"),
    resolveTicketController
);

module.exports = router;

