const { ExtractPdfAndSave } = require("./knowledge.service")

const finalExtraction=async(req,resp)=>{
    const ans=await ExtractPdfAndSave(req.file.path,req.params.documentId,req.body.category)
    resp.json({
        ans
    })
}

module.exports={
    finalExtraction
}