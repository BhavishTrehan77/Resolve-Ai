const { Incident } = require("./incident.schema")


const CreateIncident=async(body)=>{
    const Data=await Incident.create(body)
    if(!Data){
        throw new Error("specific incident not found")
    }
    return Data
}

const getIncidentById=async(incidentId)=>{
    const Data=await Incident.findById(incidentId).populate("resolvedBy").populate("originalTicket")
    if(!Data){
        throw new Error("no specific data found on this date")
    }
    
        return Data

}

const getAllIncident=async()=>{
    const Data=await Incident.find({})
    return Data
}

const updateIncident=async(incidentId,data)=>{
    const Data=await Incident.findByIdAndUpdate(incidentId,data, { new:true, runValidators:true })
    return Data
}

const DeleteIncident=async(incidentId)=>{
    const Data=await Incident.findByIdAndDelete(incidentId)
   
        return Data
    
}

module.exports={
    CreateIncident,
    getIncidentById,
    getAllIncident,
    updateIncident,
    DeleteIncident
}