const Rbac = (...roles) => {
    return (req, resp, next) => {
        const userRole = (req.user?.role || "").toUpperCase();
        const allowed = roles.map(r => r.toUpperCase());
        if (!req.user || !allowed.includes(userRole)) {
            return resp.status(403).json({
                success: false,
                message: "Forbidden: You are unauthorized to access this resource"
            });
        }
        return next();
    };
};

module.exports = {
    Rbac
};