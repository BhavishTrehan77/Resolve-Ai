const express=require('express')
const { signup, login, forgot, reset } = require('./auth.controllers')

const router=express.Router()



router.post("/signup",signup)
router.post("/login",login)
router.post("/forgot",forgot)
router.post("/reset",reset)


module.exports=router