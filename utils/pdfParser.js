const fs=require('fs')
const { PDFParse } = require('pdf-parse')

const extractFilePath=async(filePath)=>{
    const buffer=fs.readFileSync(filePath)
    const parser=new PDFParse({data:buffer})
    const result=await parser.getText();
    await parser.destroy()
    return result.text
}

module.exports={
    extractFilePath
}