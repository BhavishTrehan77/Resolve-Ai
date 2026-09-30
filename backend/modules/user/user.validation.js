const { z } = require("zod");

const updateUserSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(50).optional(),
    email: z.string().trim().email("Invalid email address").optional(),
    role: z.enum(["EMPLOYEE", "AGENT", "ADMIN"]).optional(),
    isActive: z.boolean().optional()
});

const createUserSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["EMPLOYEE", "AGENT", "ADMIN"]).default("AGENT")
});

module.exports = {
    updateUserSchema,
    createUserSchema
};
