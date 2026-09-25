const chunkText=(text,textSize=500,overlap=50)=>{
    if(!text){
        throw new Error("no text")
    }
    const res=[]
    const words=text.trim().split(/\s+/)
    for(let i=0;i<words.length;i+=textSize-overlap){
        const chunk=words.slice(i,i+textSize)
        res.push(chunk.join(" "))
    }
    return res
}

module.exports={
    chunkText
}