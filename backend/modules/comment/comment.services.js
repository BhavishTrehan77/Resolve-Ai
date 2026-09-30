const { Ticket } = require("../ticket/ticket.schema")
const { createTicket } = require("../ticket/ticket.services")
const User = require("../user/user.schema")
const { comment } = require("./comment.schema")

const CreateComment=async(data)=>{
    const Data=await comment.create(data)
    if(!Data){
        throw new Error("no data")
    }
    return Data
}

const getTicketComments=async(ticketId, user)=>{
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new Error("Ticket not found");
    }

    if (user) {
        const creatorId = ticket.createdBy?.toString();
        const assignedId = ticket.assignedTo?.toString();

        if (user.role === "EMPLOYEE" && creatorId !== user.id.toString()) {
            throw new Error("Unauthorized to view comments on this ticket");
        }
        if (user.role === "AGENT") {
            const isAssigned = assignedId === user.id.toString();
            const isEscalated = ticket.status === "ESCALATED" || ticket.aiEscalated === true;
            if (!isAssigned && !isEscalated) {
                throw new Error("Unauthorized to view comments on this ticket");
            }
        }
    }

    const comments=await comment.find({ticketId}).populate("createdBy","name email role").sort({createdAt:1})
    return comments || [];
}

const DeleteComments=async(commentId, user)=>{
    const existing = await comment.findById(commentId);
    if (!existing) {
        throw new Error("Comment not found");
    }

    if (user && user.role !== "ADMIN" && existing.createdBy.toString() !== user.id.toString()) {
        throw new Error("Unauthorized to delete this comment");
    }

    const data=await comment.findByIdAndDelete(commentId)
    return data
}

const createComm = async (ticketId, userId, content) => {

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
        throw new Error("Ticket not found");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.role === "EMPLOYEE") {
        if (ticket.createdBy.toString() !== userId.toString()) {
            throw new Error("You can comment only on your own ticket");
        }
    }

    if (user.role === "AGENT") {
        if (
            !ticket.assignedTo ||
            ticket.assignedTo.toString() !== userId.toString()
        ) {
            throw new Error("You can comment only on assigned tickets");
        }
    }

    const newComment = await comment.create({
        ticketId,
        createdBy: userId,
        message: content
    });

    await newComment.populate("createdBy", "name email role");
    return newComment;
};

module.exports={
    CreateComment,
    getTicketComments,
    DeleteComments,
    createComm
}