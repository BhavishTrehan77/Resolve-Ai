const express = require('express');
const { GetUser, GetUsers, update, Delete, createUserController } = require('./user.controller');
const { AuthMiddleware } = require('../../middleware/auth');
const { Rbac } = require('../../middleware/rbac');
const { validate } = require('../../middleware/validate');
const { updateUserSchema, createUserSchema } = require('./user.validation');

const router = express.Router();

// Only ADMIN can list users
router.get("/", AuthMiddleware, Rbac("ADMIN"), GetUsers);

// Only ADMIN can create user/agent
router.post("/", AuthMiddleware, Rbac("ADMIN"), validate(createUserSchema), createUserController);

// Authenticated user can view profile
router.get("/:id", AuthMiddleware, GetUser);

// Only ADMIN can update user roles/properties
router.patch("/:id", AuthMiddleware, Rbac("ADMIN"), validate(updateUserSchema), update);

// Only ADMIN can delete users
router.delete("/:id", AuthMiddleware, Rbac("ADMIN"), Delete);

module.exports = router;
