const mongoose=require('mongoose')


const IncidentSchema=new mongoose.Schema({
    title:{
          type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: 5,
            maxlength: 150
    },
    description:{
        type:String,
        required:[true,"Description is required"],
        trim:true,
        minlength:10
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
    rootCause:{
        type:String,
        required:true
    },
    resolution:{
        type:String,
        required:true
    },
    originalTicket:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ticket",
        required:true
    },
    resolvedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    resolvedAt:{
        type:Date,
        default:Date.now
    }

},{timestamps:true})

const Incident=mongoose.model('Incident',IncidentSchema)

module.exports={
    Incident
}