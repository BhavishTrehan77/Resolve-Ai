const mongoose=require('mongoose')



const CommentSchema=new mongoose.Schema({
    ticketId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ticket",
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:[true,"Comment message is required"],
        trim :true,
           minlength: 1,
            maxlength: 2000
    }


},{
    timestamps:true
})

const comment=mongoose.model('comment',CommentSchema)

module.exports={
    comment
}
