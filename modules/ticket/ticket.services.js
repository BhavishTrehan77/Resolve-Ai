const  {Ticket}  = require("./ticket.schema")

const createTicket=async(data)=>{
    const ticket=await Ticket.create(data)
    return ticket
}

const getTicketById=async(ticketId)=>{
    const ticket=await Ticket.findById(ticketId).populate("createdBy","name email role")
    .populate("assignedTo","name email role")
    if(!ticket){
          throw new Error("Ticket not found");
    }
    return ticket
}

const getAllTicket=async()=>{
    const ticket=await Ticket.find({}).populate("createdBy","name email role")
    .populate("assignedTo", "name email role")
    .sort({createdAt: -1})
    return ticket
}

const updateTicket=async(ticketId,data)=>{
    const ticket=await Ticket.findByIdAndUpdate(ticketId,data,{new:true,runValidators:true}).populate("createdBy","name email role").populate("assignedTo","name email role")
    if(!ticket){
          throw new Error("Ticket not found");
    }
    return ticket
}

const deleteTicket=async(ticketId)=>{
    const ticket=await Ticket.findByIdAndDelete(ticketId)

    if (!ticket) {
        throw new Error("Ticket not found");
    }
    return ticket
}

module.exports={
    createTicket,
    getTicketById,
    getAllTicket,
    updateTicket,
    deleteTicket
}
