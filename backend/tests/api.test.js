const request = require("supertest");
const jwt = require("jsonwebtoken");

process.env.NODE_ENV = "test";

const app = require("../server");

describe("API Security, Auth Validation & Routing", () => {
    const jwtSecret = process.env.JWT_ACCESS_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT_ACCESS_SECRET is not configured");
    }

    // Sample tokens for RBAC tests
    const employeeToken = jwt.sign(
        {
            id: "660000000000000000000001",
            role: "EMPLOYEE"
        },
        jwtSecret,
        {
            expiresIn: "1h"
        }
    );

    const agentToken = jwt.sign(
        {
            id: "660000000000000000000002",
            role: "AGENT"
        },
        jwtSecret,
        {
            expiresIn: "1h"
        }
    );

    describe("Authentication Endpoints", () => {

        test("should reject signup with missing required fields", async () => {
            const res = await request(app)
                .post("/api/v1/signup")
                .send({
                    email: "invalid-email"
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.errorType).toBe("VALIDATION_ERROR");
        });

        test("should reject signup with password less than 8 characters", async () => {
            const res = await request(app)
                .post("/api/v1/signup")
                .send({
                    name: "Test User",
                    email: "shortpass@example.com",
                    password: "123"
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should reject login with empty credentials", async () => {
            const res = await request(app)
                .post("/api/v1/login")
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should reject login with invalid email format", async () => {
            const res = await request(app)
                .post("/api/v1/login")
                .send({
                    email: "notanemail",
                    password: "Password123"
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe("Protected Routes Token Verification", () => {

        test("should reject unauthorized access to tickets without token", async () => {
            const res = await request(app)
                .get("/api/ticket/my");

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should reject unauthorized access to admin stats without token", async () => {
            const res = await request(app)
                .get("/api/admin/stats");

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should reject access when authorization header does not use Bearer format", async () => {
            const res = await request(app)
                .get("/api/ticket/my")
                .set("Authorization", "Basic invalidtoken");

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should reject access with an invalid token", async () => {
            const res = await request(app)
                .get("/api/ticket/my")
                .set("Authorization", "Bearer invalidtoken123");

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should return 404 for unknown endpoints", async () => {
            const res = await request(app)
                .get("/api/nonexistent-route");

            expect(res.status).toBe(404);
            expect(res.body.errorType).toBe("NOT_FOUND");
        });
    });

    describe("Role-Based Access Control (RBAC)", () => {

        test("should forbid EMPLOYEE from accessing admin stats (403)", async () => {
            const res = await request(app)
                .get("/api/admin/stats")
                .set("Authorization", `Bearer ${employeeToken}`);

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });

        test("should forbid EMPLOYEE from accessing admin users (403)", async () => {
            const res = await request(app)
                .get("/api/admin/users")
                .set("Authorization", `Bearer ${employeeToken}`);

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });

        test("should forbid EMPLOYEE from accessing agent assigned tickets (403)", async () => {
            const res = await request(app)
                .get("/api/ticket/assigned")
                .set("Authorization", `Bearer ${employeeToken}`);

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });

        test("should forbid EMPLOYEE from accessing agent escalated tickets (403)", async () => {
            const res = await request(app)
                .get("/api/ticket/escalated")
                .set("Authorization", `Bearer ${employeeToken}`);

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });

        test("should forbid AGENT from accessing admin stats (403)", async () => {
            const res = await request(app)
                .get("/api/admin/stats")
                .set("Authorization", `Bearer ${agentToken}`);

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });

        test("should forbid AGENT from accessing admin users (403)", async () => {
            const res = await request(app)
                .get("/api/admin/users")
                .set("Authorization", `Bearer ${agentToken}`);

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });

        test("should forbid EMPLOYEE from modifying users via PATCH (403)", async () => {
            const res = await request(app)
                .patch("/api/user/660000000000000000000001")
                .set("Authorization", `Bearer ${employeeToken}`)
                .send({
                    role: "ADMIN"
                });

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });

        test("should forbid AGENT from modifying users via PATCH (403)", async () => {
            const res = await request(app)
                .patch("/api/user/660000000000000000000002")
                .set("Authorization", `Bearer ${agentToken}`)
                .send({
                    role: "ADMIN"
                });

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });

        test("should forbid EMPLOYEE from creating a user (403)", async () => {
            const res = await request(app)
                .post("/api/user")
                .set("Authorization", `Bearer ${employeeToken}`)
                .send({
                    name: "Agent New",
                    email: "agentnew@example.com",
                    password: "Password123",
                    role: "AGENT"
                });

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });

        test("should forbid AGENT from creating a user (403)", async () => {
            const res = await request(app)
                .post("/api/user")
                .set("Authorization", `Bearer ${agentToken}`)
                .send({
                    name: "Admin New",
                    email: "adminnew@example.com",
                    password: "Password123",
                    role: "ADMIN"
                });

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    afterAll(async () => {
        const mongoose = require("mongoose");

        await mongoose.connection.close();
    });
});