const { z } = require("zod");

const signupSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["EMPLOYEE", "AGENT", "ADMIN"]).optional()
});

const loginSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
});

const forgotSchema = z.object({
    email: z.string().trim().email("Invalid email address")
});

const resetSchema = z.object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters")
});

module.exports = {
    signupSchema,
    loginSchema,
    forgotSchema,
    resetSchema
};
