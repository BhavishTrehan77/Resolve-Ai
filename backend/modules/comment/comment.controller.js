
const { CreateComment, getTicketComments, DeleteComments, createComm } = require("./comment.services");

const createCommentController = async (req, res) => {
    try {
        const ticketId = req.params.ticketId || req.body.ticketId;
        const message = req.body.content || req.body.message;

        if (!ticketId) {
            return res.status(400).json({ success: false, message: "Ticket ID is required" });
        }
        if (!message) {
            return res.status(400).json({ success: false, message: "Comment content is required" });
        }

        const data = await createComm(
            ticketId,
            req.user.id,
            message
        );

        res.json({
            success: true,
            data,
            Data: data,
            D: data
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getcommbyticket = async (req, resp) => {
    try {
        const T = await getTicketComments(req.params.ticketId, req.user);
        resp.json({
            success: true,
            T,
            data: T,
            Data: T
        });
    } catch (err) {
        resp.status(400).json({ success: false, message: err.message });
    }
};

const deletecomm = async (req, resp) => {
    try {
        const D = await DeleteComments(req.params.commentId, req.user);
        resp.json({
            success: true,
            D,
            data: D,
            Data: D
        });
    } catch (err) {
        resp.status(400).json({ success: false, message: err.message });
    }
};

module.exports = {
    createCommentController,
    createcomm: createCommentController,
    getcommbyticket,
    deletecomm
};