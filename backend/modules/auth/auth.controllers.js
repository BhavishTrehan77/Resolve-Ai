const { Signup, Login, Forgot, Reset } = require("./auth.service")

const signup=async(req,resp)=>{
    try {
        const { name, email, password } = req.body;
        const data = await Signup({ name, email, password });
        resp.status(201).json({
            success: true,
            message: "User registered successfully",
            data
        });
    } catch (err) {
        resp.status(400).json({
            success: false,
            message: err.message
        });
    }
}
const login=async(req,resp)=>{
    try {
        const{email,password}=req.body
        const data=await Login({email,password})
        resp.status(200).json({
            success: true,
            message: "Login successful",
            data
        });
    } catch (err) {
        resp.status(400).json({
            success: false,
            message: err.message
        });
    }
}

const forgot=async(req,resp)=>{
    try {
        const data=await Forgot(req.body.email)
        resp.status(200).json({
            success:true,
            message:"password reset token generated",
            data
        })
    } catch (err) {
        resp.status(400).json({
            success: false,
            message: err.message
        });
    }
}
const reset=async(req,resp)=>{
    try {
        const data=await Reset(req.body.newPassword,req.body.token)
        resp.status(200).json({
            success: true,
            data
        })
    } catch (err) {
        resp.status(400).json({
            success: false,
            message: err.message
        });
    }
}
module.exports={
    signup,
    login,
    forgot,
    reset
}


