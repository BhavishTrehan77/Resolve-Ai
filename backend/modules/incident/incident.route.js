const express = require('express')
const { createincident, getIncidentById, getallincident, deleteIncident, updateincident } = require('./incident.controller')
const { AuthMiddleware } = require('../../middleware/auth')
const { Rbac } = require('../../middleware/rbac')

const router = express.Router()

router.get("/", AuthMiddleware, getallincident)
router.get("/:incidentId", AuthMiddleware, getIncidentById)
router.post("/", AuthMiddleware, Rbac("ADMIN", "AGENT"), createincident)
router.patch("/:incidentId", AuthMiddleware, Rbac("ADMIN", "AGENT"), updateincident)
router.delete("/:incidentId", AuthMiddleware, Rbac("ADMIN"), deleteIncident)

module.exports = router