const { ExtractPdfAndSave } = require("../knowledge/knowledge.service");
const { CreateDocument, updateDocumentStatus, GetDocumentById, GetAllDocuments, DeleteDocument } = require("./documet.service");

const Cdocs=async(req,resp)=>{
    let createdDoc = null;
    try {
        if (!req.file) {
            return resp.status(400).json({ success: false, message: "No PDF file uploaded" });
        }
        // 1. Initial status: UPLOADED
        createdDoc = await CreateDocument({
            ...req.body,
            fileName: req.file.filename,
            fileUrl: req.file.path,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            uploadedBy: req.user.id,
            status: "UPLOADED"
        });

        // 2. Transition status: PROCESSING
        await updateDocumentStatus(createdDoc._id, "PROCESSING");

        // 3. Process PDF: Extract, chunk, embed, store in MongoDB Knowledge
        const ans = await ExtractPdfAndSave(req.file.path, createdDoc._id, createdDoc.category, createdDoc.fileName || createdDoc.title);

        // 4. Transition status: PROCESSED
        const finalDoc = await updateDocumentStatus(createdDoc._id, "PROCESSED");

        resp.json({
            success: true,
            Data: finalDoc,
            data: finalDoc,
            ans
        });
    } catch (err) {
        console.error("Document processing error:", err);
        if (createdDoc?._id) {
            // 5. Transition status: FAILED
            await updateDocumentStatus(createdDoc._id, "FAILED").catch(() => {});
        }
        resp.status(400).json({ success: false, message: err.message });
    }
};

const GdocsbyId=async(req,resp)=>{
    try {
        const Data=await GetDocumentById(req.params.docId)
        resp.json(Data)
    } catch (err) {
        resp.status(404).json({ success: false, message: err.message })
    }
}

const GAllDocs=async(req,resp)=>{
    try {
        const Data=await GetAllDocuments()
        resp.json(Data)
    } catch (err) {
        resp.status(400).json({ success: false, message: err.message })
    }
}

const DelDocs=async(req,resp)=>{
    try {
        const Data=await DeleteDocument(req.params.docId)
        resp.json(Data)
    } catch (err) {
        resp.status(400).json({ success: false, message: err.message })
    }
}

module.exports={
    Cdocs,
    GdocsbyId,
    GAllDocs,
    DelDocs
}