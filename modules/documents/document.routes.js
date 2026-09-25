const express=require('express')
const { Cdocs, DelDocs, GdocsbyId, GAllDocs } = require('./document.controller')
const { GetDocumentById, GetAllDocuments } = require('./documet.service')
const { AuthMiddleware } = require('../../middleware/auth')
const { upload } = require('../../middleware/upload')
const router=express.Router()



router.post("/cdoc",AuthMiddleware,upload.single("file"),Cdocs)
router.get("/:docId",AuthMiddleware,GdocsbyId)
router.get("/",AuthMiddleware,GAllDocs)
router.delete("/:docId",AuthMiddleware,DelDocs)

module.exports=router