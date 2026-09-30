const multer = require("multer");
const { ZodError } = require("zod");

/**
 * 404 handler for unmatched routes.
 */
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        errorType: "NOT_FOUND",
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
};

/**
 * Centralized error handling middleware.
 * Formats Multer, Zod, Mongoose, and AI errors consistently.
 */
const errorHandler = (err, req, res, next) => {
    console.error("Centralized Error Handler caught:", err.name, err.message);

    // 1. Multer upload errors
    if (err instanceof multer.MulterError) {
        let message = `Upload error: ${err.message}`;
        if (err.code === "LIMIT_FILE_SIZE") {
            message = "File size limit exceeded (maximum 10MB allowed)";
        }
        return res.status(400).json({
            success: false,
            errorType: "FILE_UPLOAD_ERROR",
            code: err.code,
            message
        });
    }

    // Custom multer filter errors (e.g., only PDF allowed)
    if (err.message && err.message.toLowerCase().includes("only pdf files are allowed")) {
        return res.status(400).json({
            success: false,
            errorType: "INVALID_FILE_TYPE",
            message: err.message
        });
    }

    // 2. Zod validation errors
    if (err instanceof ZodError) {
        const issues = (err.issues || []).map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
        }));

        return res.status(400).json({
            success: false,
            errorType: "VALIDATION_ERROR",
            message: issues[0]?.message || "Validation failed",
            errors: issues
        });
    }

    // 3. Mongoose validation errors
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors || {}).map((e) => ({
            field: e.path,
            message: e.message
        }));

        return res.status(400).json({
            success: false,
            errorType: "DATABASE_VALIDATION_ERROR",
            message: err.message,
            errors
        });
    }

    // 4. Mongoose duplicate key errors (code 11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "Resource";
        return res.status(400).json({
            success: false,
            errorType: "DUPLICATE_KEY_ERROR",
            message: `${field} already exists`
        });
    }

    // 5. Mongoose invalid ObjectId CastError
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            errorType: "INVALID_IDENTIFIER",
            message: `Invalid format for ID: ${err.value}`
        });
    }

    // 6. AI API / Gemini errors
    if (
        err.name === "GoogleGenAIError" ||
        err.message?.includes("GoogleGenerativeAI") ||
        err.message?.includes("Gemini") ||
        err.message?.includes("GEMINI_API_KEY")
    ) {
        return res.status(502).json({
            success: false,
            errorType: "AI_SERVICE_ERROR",
            message: `AI service error: ${err.message}`
        });
    }

    // 7. Generic or custom thrown errors
    const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
    return res.status(statusCode).json({
        success: false,
        errorType: "INTERNAL_ERROR",
        message: err.message || "Internal server error"
    });
};

module.exports = {
    notFoundHandler,
    errorHandler
};
