const express = require("express");
const { AuthMiddleware } = require("../../middleware/auth");
const {
    getAdminStatsController,
    getAdminTicketsController,
    getAdminUsersController,
    getAdminEscalatedController
} = require("./admin.controller");
const { Rbac } = require("../../middleware/rbac");

const router = express.Router();

router.get("/stats", AuthMiddleware, Rbac("ADMIN"), getAdminStatsController);
router.get("/tickets", AuthMiddleware, Rbac("ADMIN"), getAdminTicketsController);
router.get("/users", AuthMiddleware, Rbac("ADMIN"), getAdminUsersController);
router.get("/escalated", AuthMiddleware, Rbac("ADMIN"), getAdminEscalatedController);

module.exports = router;