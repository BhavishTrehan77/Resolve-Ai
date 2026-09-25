const { createTicket } = require("../ticket/ticket.services")
const { comment } = require("./comment.schema")

const CreateComment=async(data)=>{
    const Data=await comment.create(data)
    if(!Data){
        throw new Error("no data")
    }
    return Data
}

const getTicketComments=async(ticketId)=>{
    const comments=await comment.find({ticketId}).populate("createdBy","name email role").sort({createdAt:-1})
    if(!comments){
        throw new Error("no comments")
    }

    return comments
}

const DeleteComments=async(commentId)=>{
    const data=await comment.findByIdAndDelete(commentId)
    if(!data){
        throw new Error("data not found")
    }
    return data
}


module.exports={
    CreateComment,
    getTicketComments,
    DeleteComments
}