const express = require('express')
const { Cdocs, DelDocs, GdocsbyId, GAllDocs } = require('./document.controller')
const { AuthMiddleware } = require('../../middleware/auth')
const { Rbac } = require('../../middleware/rbac')
const { upload } = require('../../middleware/upload')
const router = express.Router()

router.get("/", AuthMiddleware, Rbac("ADMIN"), GAllDocs)
router.get("/:docId", AuthMiddleware, Rbac("ADMIN"), GdocsbyId)
router.post("/cdoc", AuthMiddleware, Rbac("ADMIN"), upload.single("file"), Cdocs)
router.delete("/:docId", AuthMiddleware, Rbac("ADMIN"), DelDocs)

module.exports = router