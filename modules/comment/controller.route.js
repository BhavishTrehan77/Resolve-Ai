const express=require('express')
const {getcommbyticket, deletecomm, createcomm } = require('./comment.controller')
const { AuthMiddleware } = require('../../middleware/auth')
const router=express.Router()



router.post("/",AuthMiddleware,createcomm)
router.get("/:ticketId",AuthMiddleware,getcommbyticket)
router.delete("/:commentId",AuthMiddleware,deletecomm)



module.exports=router