const request = require("supertest");
process.env.NODE_ENV = "test";
const app = require("../server");

describe("API Security, Auth Validation & Routing", () => {
    describe("Authentication Endpoints", () => {
        it("should reject signup with missing required fields", async () => {
            const res = await request(app)
                .post("/api/v1/signup")
                .send({
                    email: "invalid-email"
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.errorType).toBe("VALIDATION_ERROR");
        });

        it("should reject login with empty credentials", async () => {
            const res = await request(app)
                .post("/api/v1/login")
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe("Protected Routes Security", () => {
        it("should reject unauthorized access to tickets without token", async () => {
            const res = await request(app).get("/api/ticket/my");
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should reject unauthorized access to admin stats without token", async () => {
            const res = await request(app).get("/api/admin/stats");
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should return 404 for unknown endpoints", async () => {
            const res = await request(app).get("/api/nonexistent-route");
            expect(res.status).toBe(404);
            expect(res.body.errorType).toBe("NOT_FOUND");
        });
    });

    afterAll(async () => {
        const mongoose = require("mongoose");
        await mongoose.connection.close();
    });
});
