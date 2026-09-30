const express = require('express')
const { Cdocs, DelDocs, GdocsbyId, GAllDocs } = require('./document.controller')
const { AuthMiddleware } = require('../../middleware/auth')
const { Rbac } = require('../../middleware/rbac')
const { upload } = require('../../middleware/upload')
const router = express.Router()

router.get("/", AuthMiddleware, GAllDocs)
router.get("/:docId", AuthMiddleware, GdocsbyId)
router.post("/cdoc", AuthMiddleware, Rbac("ADMIN"), upload.single("file"), Cdocs)
router.delete("/:docId", AuthMiddleware, Rbac("ADMIN"), DelDocs)

module.exports = router