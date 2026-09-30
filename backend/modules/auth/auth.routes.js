const express = require('express');
const { signup, login, forgot, reset } = require('./auth.controllers');
const { validate } = require('../../middleware/validate');
const { signupSchema, loginSchema, forgotSchema, resetSchema } = require('./auth.validation');

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/forgot", validate(forgotSchema), forgot);
router.post("/reset", validate(resetSchema), reset);

module.exports = router;