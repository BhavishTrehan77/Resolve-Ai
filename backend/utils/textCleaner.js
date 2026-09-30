const cleanText=(text)=>{
    if(!text){
        throw new Error("text is required")
    }
    const cleanText=text.replace(/\r/g, " ")
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    return cleanText
}

module.exports={
    cleanText
}