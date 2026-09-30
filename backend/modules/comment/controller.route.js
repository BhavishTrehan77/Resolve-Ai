const express = require('express');
const { getcommbyticket, deletecomm, createCommentController } = require('./comment.controller');
const { AuthMiddleware } = require('../../middleware/auth');

const router = express.Router();

router.get("/:ticketId", AuthMiddleware, getcommbyticket);
router.post("/:ticketId", AuthMiddleware, createCommentController);
router.delete("/:commentId", AuthMiddleware, deletecomm);

module.exports = router;