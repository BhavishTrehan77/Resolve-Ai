const { Ticket } = require("../ticket/ticket.schema");
const User = require("../user/user.schema");


const getAdminStats = async () => {

    const totalUsers = await User.countDocuments();

    const totalTickets = await Ticket.countDocuments();

    const openTickets = await Ticket.countDocuments({
        status: "OPEN"
    });

    const inProgressTickets = await Ticket.countDocuments({
        status: "IN_PROGRESS"
    });

    const escalatedTickets = await Ticket.countDocuments({
        status: "ESCALATED"
    });

    const resolvedTickets = await Ticket.countDocuments({
        status: "RESOLVED"
    });

    const closedTickets = await Ticket.countDocuments({
        status: "CLOSED"
    });

    return {
        totalUsers,
        totalTickets,
        openTickets,
        inProgressTickets,
        escalatedTickets,
        resolvedTickets,
        closedTickets
    };
};

const getAdminTickets = async () => {
    return await Ticket.find({})
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
};

const getAdminUsers = async () => {
    return await User.find({}, "-password").sort({ createdAt: -1 });
};

const getAdminEscalated = async () => {
    return await Ticket.find({
        $or: [{ status: "ESCALATED" }, { aiEscalated: true }]
    })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
};

module.exports = {
    getAdminStats,
    getAdminTickets,
    getAdminUsers,
    getAdminEscalated
};