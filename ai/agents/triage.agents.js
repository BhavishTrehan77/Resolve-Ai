const { ai } = require("../../config/ai");

const triageAgent=async(ticket)=>{
    if(!ticket){
         throw new Error("Ticket is required");
    }
    const prompt=`You are an it support triage agent.
    Analyze the following support ticket : ${JSON.stringify(ticket)}

    Classify the ticket.
    Category must be one of:
NETWORK
HARDWARE
SOFTWARE
DATABASE
SECURITY
ACCESS
CLOUD
OTHER

Priority must be one of:
LOW
MEDIUM
HIGH
CRITICAL

return ONLY VALID JSON

Format:{
"category": "...",
    "priority": "...",
    "intent": "...",
    "summary": "..."
}
    
    `
    const response=await ai.models.generateContent({
        model:"gemini-3.6-flash",
        contents:prompt
    })
    return JSON.parse(response.text)
}
module.exports={
    triageAgent
}