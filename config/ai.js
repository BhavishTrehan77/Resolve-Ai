const{GoogleGenAI}=require('@google/genai')

const ai=new GoogleGenAI({
    apiKey:process.env.Gemini_Api_Key
})


module.exports={
    ai
}