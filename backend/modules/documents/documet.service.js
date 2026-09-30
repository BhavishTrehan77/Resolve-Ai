const { Doc } = require("./document.schema");
const Knowledge = require("../knowledge/knowledge.schema");

const CreateDocument=async(data)=>{
    const Data=await Doc.create(data)
    if(!Data){
         throw new Error("Document not created");
    }
    return Data
}

const updateDocumentStatus = async (docId, status) => {
    return await Doc.findByIdAndUpdate(docId, { status }, { new: true });
};

const GetDocumentById=async(docId)=>{
    const Data=await Doc.findById(docId).populate("uploadedBy","name email role")
    if(!Data){
        throw new Error("Document not found");
    }
    return Data
}

const GetAllDocuments=async()=>{
    const Data=await Doc.find({}).populate("uploadedBy", "name email role").sort({ createdAt: -1 });
    return Data
}

const DeleteDocument=async(docId)=>{
    const Data=await Doc.findByIdAndDelete(docId);
    if (!Data) {
        throw new Error("Document not found");
    }
    // Clean up associated knowledge vectors
    await Knowledge.deleteMany({ documentId: docId });
    return Data;
};

module.exports={
    CreateDocument,
    updateDocumentStatus,
    GetDocumentById,
    GetAllDocuments,
    DeleteDocument
};


