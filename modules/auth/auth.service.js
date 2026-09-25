const User = require("../user/user.schema")
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')


const Signup=async({name,email,password})=>{
    const existingUser=await User.findOne({email})
    if(existingUser){
        throw new Error("user already exists")
    }
    const hashedPassword=await bcrypt.hash(password,10)

    const user=await User.create({
        name,
        email,
        password:hashedPassword
    })
    const assToken=jwt.sign({id:user._id,role:user.role},process.env.JWT_ACCESS_SECRET,{expiresIn:"12d"})
    return{
        user:{
            id:user._id,
            name:user.name,
            role:user.role,

        },
        assToken
    }
}

const Login=async({email,password})=>{
    const user=await User.findOne({email})
    if(!user){
        throw new Error("user not found")
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error("password didnt match")
    }
    const AccToken=jwt.sign({id:user._id,role:user.role},process.env.JWT_ACCESS_SECRET,{expiresIn:"12d"})

    return{
        AccToken
    }
}

const Forgot=async(email)=>{
    const user=await User.findOne({email})
    if(!user){
        throw new Error("user not found")
    }
    const resetToken=crypto.randomBytes(32).toString('hex')
    const hashedToken=crypto.createHash('sha256').update(resetToken).digest('hex')
    user.passwordResetToken=hashedToken
    user.passwordResetExpires=Date.now()+1000*60*60
    await user.save()
    return resetToken
}

const Reset=async(newPassword,token)=>{
    if(!newPassword){
        throw new Error("write newPassword")
    }
    const hashedToken=crypto.createHash('sha256').update(token).digest('hex')
    const user=await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires:{$gt:Date.now()}
    })
    if(!user){
        throw new Error("user not foudn")
    }
    const hashedPassword=await bcrypt.hash(newPassword,10)
    user.password=hashedPassword
    user.passwordResetToken=null
    user.passwordResetExpires=null
    await user.save()
    return{
        message:"password reset success"
    }
}

module.exports={
    Signup,Login,Forgot,Reset
}