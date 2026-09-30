require('dotenv').config()
const express=require('express')
const mongoose = require('mongoose')
const router = require('./modules/auth/auth.routes')
const Userrouter=require('./modules/user/user.routes')
const ticketrouter=require('./modules/ticket/ticket.routes')
const Commentrouter=require('./modules/comment/controller.route')
const Incidentrouter=require('./modules/incident/incident.route')
const UploadRouter=require('./modules/documents/document.routes')
const ragRouter=require('./ai/rag/rag.routes')
const adminRouter=require('./modules/admin/admin.route')
const knowledgeRouter=require('./modules/knowledge/knowledge.route')

const cors = require('cors');

const app=express()
app.use(cors());
app.use(express.json())


const { bootstrapDefaultUsers } = require('./config/bootstrap');

async function connectDb(){
    try {
        const url = (process.env.MONGO_URL || '').trim()
        await mongoose.connect(url)
        console.log("mongodb connection done")
        if (process.env.NODE_ENV !== 'test') {
            await bootstrapDefaultUsers();
        }
    } catch (err) {
        console.error("MongoDB connection error:", err.message)
    }
}
connectDb()



app.use("/api/v1",router)

app.use("/api/user",Userrouter)

app.use("/api/ticket",ticketrouter)
app.use("/api/comm",Commentrouter)

app.use("/api/incident",Incidentrouter)
app.use("/api/upload",UploadRouter)
app.use("/api/knowledge",knowledgeRouter)
app.use("/api/rag",ragRouter)
app.use("/api/admin", adminRouter);

// Root and Health Check endpoints for deployment monitoring (Render, Railway, AWS, etc.)
app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "ResolveAI API Server is live" });
});
app.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// 404 Handler for unmatched routes
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
app.use(notFoundHandler);

// Centralized Error Handler (Multer, Zod, Mongoose, AI, Generic)
app.use(errorHandler);

const PORT = process.env.PORT || 3000
let server;
if (process.env.NODE_ENV !== 'test') {
    server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

module.exports = app;

