const User = require("../user/user.schema")
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')


const Signup=async({name,email,password,role})=>{
    const existingUser=await User.findOne({email})
    if(existingUser){
        throw new Error("user already exists")
    }
    const hashedPassword=await bcrypt.hash(password,10)

    let assignedRole = "EMPLOYEE";
    const userCount = await User.countDocuments();
    if (userCount === 0) {
        // Bootstrap: first user created in an empty database can be ADMIN
        assignedRole = role === "ADMIN" ? "ADMIN" : "ADMIN";
    }

    const user=await User.create({
        name,
        email,
        password:hashedPassword,
        role: assignedRole
    })
    const token=jwt.sign({id:user._id,role:user.role},process.env.JWT_ACCESS_SECRET,{expiresIn:"12d"})
    return{
        user:{
            id:user._id,
            name:user.name,
            role:user.role,
            email:user.email
        },
        token,
        AccToken: token,
        assToken: token
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
    const token=jwt.sign({id:user._id,role:user.role},process.env.JWT_ACCESS_SECRET,{expiresIn:"12d"})

    return{
        token,
        AccToken: token,
        assToken: token,
        user:{
            id:user._id,
            name:user.name,
            role:user.role,
            email:user.email
        }
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
    }).select("+passwordResetToken +passwordResetExpires")
    if(!user){
        throw new Error("Invalid or expired password reset token")
    }
    const hashedPassword=await bcrypt.hash(newPassword,10)
    user.password=hashedPassword
    user.passwordResetToken=undefined
    user.passwordResetExpires=undefined
    await user.save()
    return{
        message:"password reset success"
    }
}

module.exports={
    Signup,Login,Forgot,Reset
}