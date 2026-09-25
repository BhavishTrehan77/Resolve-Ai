const mongoose=require('mongoose')

const DocumentSchema=new mongoose.Schema({
    title:{
        type: String,
        trim:true,
        minlength:3,
        maxlength:150
    },
    description:{
        type:String,
        trim:true
    },
    fileName:{
        type:String
    },
    fileUrl:{
        type:String
    },
    fileType:{
        type:String
    },
    fileSize:{
        type:Number
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:String,
        enum:[
            "NETWORK",
            "HARDWARE",
            "SOFTWARE",
            "DATABASE",
            "SECURITY",
            "ACCESS",
            "CLOUD",
            "OTHER"
        ],
        default:"OTHER"
    },
      status: {
            type: String,
            enum: [
                "UPLOADED",
                "PROCESSING",
                "PROCESSED",
                "FAILED"
            ],
            default: "UPLOADED"
        }
    
},  {
        timestamps: true
    })

const Doc=mongoose.model('Doc',DocumentSchema)

module.exports={
    Doc
}