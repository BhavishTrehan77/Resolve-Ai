const express=require('express')
const { GetUser, GetUsers, update, Delete } = require('./user.controller')
const { AuthMiddleware } = require('../../middleware/auth')
const { Rbac } = require('../../middleware/rbac')
const router=express.Router()



router.get("/:id",AuthMiddleware,GetUser)
router.get("/",AuthMiddleware,GetUsers)
router.patch("/:id",AuthMiddleware,update)
router.delete("/:id",AuthMiddleware,Delete)


module.exports=router