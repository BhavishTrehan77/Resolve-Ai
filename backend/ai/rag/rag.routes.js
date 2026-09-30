const express=require('express')
const { RagAns } = require('./rag.controller')
const { AuthMiddleware } = require('../../middleware/auth')


const router=express.Router()



router.post("/chat",AuthMiddleware,RagAns)



module.exports=router