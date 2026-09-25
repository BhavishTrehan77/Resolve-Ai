
const { CreateComment, getTicketComments, DeleteComments } = require("./comment.services")

const createcomm=async(req,resp)=>{
    const D=await CreateComment({...req.body,createdBy:req.user.id})
    resp.json({
        D
    })
}

const getcommbyticket=async(req,resp)=>{
    const T=await getTicketComments(req.params.ticketId)
    resp.json({
        T
    })
}

const deletecomm=async(req,resp)=>{
    const D=await DeleteComments(req.params.commentId)
    resp.json({
        D
    })
}

module.exports={
    createcomm,
    getcommbyticket,
    deletecomm
}