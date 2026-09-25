const { Signup, Login, Forgot, Reset } = require("./auth.service")

const signup=async(req,resp)=>{
    const{name,email,password}=req.body
    const data=await Signup({name,email,password})
    resp.status(201).json({
        success: true,
        message: "User registered successfully",
        data
    });
}
const login=async(req,resp)=>{
    const{email,password}=req.body
    const data=await Login({email,password})
     resp.status(200).json({
        success: true,
        message: "Login successful",
        data
    });
}

const forgot=async(req,resp)=>{
    const data=await Forgot(req.body.email)
    resp.status(200).json({
        success:true,
        message:"password reset token generated",
        data
    })
}
const reset=async(req,resp)=>{
    const data=await Reset(req.body.newPassword,req.body.token)
    resp.status(200).json({
        data
    })
}
module.exports={
    signup,
    login,
    forgot,
    reset
}


