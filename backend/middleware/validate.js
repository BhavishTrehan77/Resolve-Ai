/**
 * Generic request body validation middleware using Zod.
 * Forwards any Zod validation errors to centralized error handling.
 */
const validate = (schema) => (req, res, next) => {
    try {
        if (!schema) return next();
        const parsed = schema.parse(req.body);
        req.body = parsed;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    validate
};
