const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    filename: function(req, file, cb) {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, `${Date.now()}-${safeName}`);
    },
    destination: function(req, file, cb) {
        const dir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    }
});


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