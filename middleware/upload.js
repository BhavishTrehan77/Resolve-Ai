const multer=require('multer')


const storage=multer.diskStorage({
    filename:function(req,file,cb){
        cb(null,file.originalname)
    },
    destination:function(req,file,cb){
        cb(null,'uploads/')
    }

})


const fileFilter=(req,file,cb)=>{
     console.log("MULTER RECEIVED FILE:", file);
    if(file.mimetype=="application/pdf"){
        cb(null,true)
    }else{
        cb(new Error("only pdf files are allowed"))
    }
}


const upload =multer({
    storage,
    fileFilter,
    limits:{
    fileSize:10 * 1024 * 1024
}

})

module.exports={
    upload
}