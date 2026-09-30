const Rbac=(...roles)=>{
    return(req,resp,next)=>{
         if(!req.user || !roles.includes(req.user.role)){
            return resp.status(403).json({
                success:false,
                message:"You are unauthorized"
            })
         }else{
            return next()
         }
    }
   
}
module.exports={
    Rbac
}