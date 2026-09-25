const { createTicket, getTicketById, getAllTicket, updateTicket, deleteTicket } = require("./ticket.services")

const createticket=async(req,resp)=>{
    const data=await createTicket({...req.body,createdBy:req.user.id})
    resp.json({
        data
    })
}
const getticket=async(req,resp)=>{
    const data=await getTicketById(req.params.id)
    resp.json({
        data
    })
}

const getAllticket=async(req,resp)=>{
    const data=await getAllTicket()
    resp.json({
        data
    })
}
const updateticket=async(req,resp)=>{
    const data=await updateTicket(req.params.id,req.body)
    resp.json({
        data
    })
}

const Deleteticket=async(req,resp)=>{
    const data=await deleteTicket(req.params.id)
    resp.json({
        data
    })
}

module.exports={
    createticket,
    getticket,
    getAllticket,
    updateticket,
    Deleteticket
}