const {
    getAdminStats,
    getAdminTickets,
    getAdminUsers,
    getAdminEscalated
} = require("./admin.service");

const getAdminStatsController = async (req, res) => {
    try {
        const data = await getAdminStats();
        res.json({
            success: true,
            data,
            Data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAdminTicketsController = async (req, res) => {
    try {
        const data = await getAdminTickets();
        res.json({
            success: true,
            data,
            Data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAdminUsersController = async (req, res) => {
    try {
        const data = await getAdminUsers();
        res.json({
            success: true,
            data,
            Data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAdminEscalatedController = async (req, res) => {
    try {
        const data = await getAdminEscalated();
        res.json({
            success: true,
            data,
            Data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAdminStatsController,
    getAdminTicketsController,
    getAdminUsersController,
    getAdminEscalatedController
};