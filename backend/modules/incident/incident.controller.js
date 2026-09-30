const { CreateIncident, getIncidentById, getAllIncident, updateIncident, DeleteIncident } = require("./incident.service")

const createincident=async(req,resp)=>{
    const Data=await CreateIncident(req.body)
    resp.json({
        Data
    })
}

const getIncidentbyid=async(req,resp)=>{
    const incidentId = req.params.incidentId || req.params.id
    const Data=await getIncidentById(incidentId)
    resp.json({
        Data
    })
}

const getallincident=async(req,resp)=>{
    const Data=await getAllIncident({})
    resp.json({Data})
}

const updateincident=async(req,resp)=>{
    const incidentId = req.params.incidentId || req.params.id
    const Data=await updateIncident(incidentId,req.body)
    resp.json({
        Data
    })

}

const deleteIncident=async(req,resp)=>{
    const incidentId = req.params.incidentId || req.params.id
    const Data=await DeleteIncident(incidentId)
    resp.json({
        Data
    })
}


module.exports={
    createincident,
    getallincident,
    getIncidentById: getIncidentbyid,
    updateincident,
    deleteIncident
}