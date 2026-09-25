require('dotenv').config()
const express=require('express')
const { default: mongoose } = require('mongoose')
const router = require('./modules/auth/auth.routes')
const Userrouter=require('../backend/modules/user/user.routes')
const ticketrouter=require('../backend/modules/ticket/ticket.routes')
const Commentrouter=require('../backend/modules/comment/controller.route')
const Incidentrouter=require('./modules/incident/incident.route')
const UploadRouter=require('../backend/modules/documents/document.routes')
const ragRouter=require('../backend/ai/rag/rag.routes')

const app=express()
app.use(express.json())


async function connectDb(){
    await mongoose.connect(process.env.MONGO_URL)
    console.log("mongodb connection done")
}
connectDb()



app.use("/api/v1",router)

app.use("/api/user",Userrouter)

app.use("/api/ticket",ticketrouter)
app.use("/api/comm",Commentrouter)

app.use("/api/incident",Incidentrouter)
app.use("/api/upload",UploadRouter)
app.use("/api/rag",ragRouter)


app.listen(3000)
