const jwt = require("jsonwebtoken");
const AuthMiddleware=async(req,resp,next)=>{
    try{
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')){
        throw new Error("token should be in correct form")
    }
    const token=req.headers.authorization.split(" ")[1]
    if(!token){
        return resp.status(401).json({
            success: false,
            message:"token not found"
        })
    }
    const decoded=jwt.verify(token,process.env.JWT_ACCESS_SECRET)
    req.user=decoded
    return next()
    }catch(err){
        return resp.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }

}

module.exports={
    AuthMiddleware
}