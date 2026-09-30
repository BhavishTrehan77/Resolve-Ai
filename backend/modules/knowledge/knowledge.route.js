const express = require('express')
const { AuthMiddleware } = require('../../middleware/auth')
const { Rbac } = require('../../middleware/rbac')
const { upload } = require('../../middleware/upload')
const { finalExtraction } = require('./knowledge.controller')

const router = express.Router()

router.post("/:documentId/extract", AuthMiddleware, Rbac("ADMIN"), upload.single("document"), finalExtraction)

module.exports = router