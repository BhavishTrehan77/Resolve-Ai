const express=require('express')
const { createincident, getIncidentById, getallincident, deleteIncident, updateincident } = require('./incident.controller')
const { AuthMiddleware } = require('../../middleware/auth')

const router=express.Router()




router.post("/",AuthMiddleware,createincident)
router.get("/:incidentId",AuthMiddleware,getIncidentById)
router.get("/",AuthMiddleware,getallincident)
router.patch("/:incidentId",AuthMiddleware,updateincident)
router.delete("/:incidentId",AuthMiddleware,deleteIncident)

module.exports=router