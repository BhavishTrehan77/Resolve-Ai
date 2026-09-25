const mongoose=require('mongoose')


const TicketSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title is required"],
        trim:true,
        minlength:5,
        maxlength:150
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
    priority:{
        type:String,
        enum:[
            "LOW","MEDIUM","HIGH","CRITICAL"
        ],
        default:"MEDIUM"
    },
    status:{
        type:String,
        enum:[
            "OPEN",
            "IN_PROGRESS",
            "WAITING_FOR_USER",
            "ESCALATED",
            "RESOLVED",
            "CLOSED"
        ],
        default:"OPEN"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:null
    }

},{
        timestamps: true
    })
const Ticket=mongoose.model('Ticket',TicketSchema)

module.exports={
    Ticket
}