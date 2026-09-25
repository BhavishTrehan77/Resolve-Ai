const { ExtractPdfAndSave } = require("../knowledge/knowledge.service")
const { CreateDocument, GetDocumentById, GetAllDocuments, DeleteDocument } = require("./documet.service")

const Cdocs=async(req,resp)=>{
    console.log("REQ.FILE =", req.file);
    const Data=await CreateDocument({...req.body,
        fileName: req.file.filename,
        fileUrl: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,

        uploadedBy: req.user.id
    })
    const ans=await ExtractPdfAndSave(req.file.path,Data._id,Data.category)
        console.log("CONTENT TYPE:", req.headers["content-type"]);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    resp.json({Data,ans})
}
const GdocsbyId=async(req,resp)=>{
    const Data=await GetDocumentById(req.params.docId)
    resp.json(Data)
}

const GAllDocs=async(req,resp)=>{
    const Data=await GetAllDocuments()
    resp.json(Data)
}

const DelDocs=async(req,resp)=>{
    const Data=await DeleteDocument(req.params.docId)
    resp.json(Data)
}

module.exports={
    Cdocs,
    GdocsbyId,
    GAllDocs,
    DelDocs
}