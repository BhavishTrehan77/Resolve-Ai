const { Doc } = require("./document.schema");


const CreateDocument=async(data)=>{
    const Data=await Doc.create(data)
    if(!Data){
         throw new Error("Document not created");
    }
    return Data
}

const GetDocumentById=async(docId)=>{
    const Data=await Doc.findById(docId).populate("uploadedBy","name email role")
    if(!Data){
        throw new Error("Document not found");
    }
    return Data
}


const GetAllDocuments=async()=>{
    const Data=await Doc.find({}).populate("uploadedBy")
    return Data
}

const DeleteDocument=async(docId)=>{
    const Data=await Doc.findByIdAndDelete(docId)
      if (!Data) {
        throw new Error("Document not found");
    }
    return Data
}


module.exports={
    CreateDocument,
    GetDocumentById,
    GetAllDocuments,
    DeleteDocument
}

