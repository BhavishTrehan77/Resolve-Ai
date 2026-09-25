const Rbac=(...roles)=>{
    return(req,resp,next)=>{
         if(!roles.includes(req.user.role)){
            return resp.json({
                success:false,
                message:"your are unathorized"
            })
         }else{
            return next()
         }
    }
   
}
module.exports={
    Rbac
}