const { z } = require("zod");

const createTicketSchema = z.object({
    title: z.string().trim().min(5, "Title must be at least 5 characters").max(150),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    category: z.enum([
        "NETWORK",
        "HARDWARE",
        "SOFTWARE",
        "DATABASE",
        "SECURITY",
        "ACCESS",
        "CLOUD",
        "OTHER"
    ]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional()
});

const updateTicketSchema = z.object({
    title: z.string().trim().min(5).max(150).optional(),
    description: z.string().trim().min(10).optional(),
    category: z.enum([
        "NETWORK",
        "HARDWARE",
        "SOFTWARE",
        "DATABASE",
        "SECURITY",
        "ACCESS",
        "CLOUD",
        "OTHER"
    ]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
    status: z.enum([
        "OPEN",
        "IN_PROGRESS",
        "WAITING_FOR_USER",
        "ESCALATED",
        "RESOLVED",
        "CLOSED"
    ]).optional(),
    assignedTo: z.string().nullable().optional()
});

const assignTicketSchema = z.object({
    agentId: z.string().min(1, "agentId is required")
});

const updateAiResolutionSchema = z.object({
    resolution: z.string().min(1).optional(),
    steps: z.array(z.string()).optional(),
    diagnosis: z.object({
        rootCause: z.string().optional(),
        reasoning: z.string().optional(),
        confidence: z.number().optional()
    }).optional(),
    rootCause: z.string().optional(),
    reasoning: z.string().optional()
});

module.exports = {
    createTicketSchema,
    updateTicketSchema,
    assignTicketSchema,
    updateAiResolutionSchema
};
