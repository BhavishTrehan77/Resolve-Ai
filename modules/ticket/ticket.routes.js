const express=require('express')
const { AuthMiddleware } = require('../../middleware/auth')
const { getticket, createticket, Deleteticket, updateticket, getAllticket } = require('./ticket.controller')
const { Rbac } = require('../../middleware/rbac')
const router=express.Router()



router.get("/",AuthMiddleware,getAllticket)
router.post("/",AuthMiddleware,createticket)
router.get("/:id",AuthMiddleware,getticket)
router.patch("/:id",AuthMiddleware,updateticket)
router.delete("/:id",AuthMiddleware,Rbac("ADMIN"),Deleteticket)

module.exports=router