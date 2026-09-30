const embedding = require("../../ai/rag/embedding")
const { chunkText } = require("../../utils/chunkText")
const { extractFilePath } = require("../../utils/pdfParser")
const { cleanText } = require("../../utils/textCleaner")
const Knowledge = require("./knowledge.schema")

const ExtractPdfAndSave=async(filePath,documentId,category,source="Document Upload")=>{
    const text=await extractFilePath(filePath)
    const clean=cleanText(text)
    const chunks=chunkText(clean)
    const res=[]
    for(const chunk of chunks){
        const embed=await embedding(chunk)
        const data=await Knowledge.create({
            documentId:documentId,
            text:chunk,
            embedding:embed,
            category:category,
            source:source,
            metadata:{ sourceFile: filePath, charLength: chunk.length }
        })
        res.push(data)
    }
    return res
}

module.exports={
    ExtractPdfAndSave
}