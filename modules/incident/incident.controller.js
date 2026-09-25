const { CreateIncident, getIncidentById, getAllIncident, updateIncident, DeleteIncident } = require("./incident.service")

const createincident=async(req,resp)=>{
    const Data=await CreateIncident(req.body)
    resp.json({
        Data
    })
}

const getIncidentbyid=async(req,resp)=>{
    const Data=await getIncidentById(req.params.id)
    resp.json({
        Data
    })
}

const getallincident=async(req,resp)=>{
    const Data=await getAllIncident({})
    resp.json({Data})
}

const updateincident=async(req,resp)=>{
    const Data=await updateIncident(req.params.id,req.body)
    resp.json({
        Data
    })

}

const deleteIncident=async(req,resp)=>{
    const Data=await DeleteIncident(req.params.id)
    resp.json({
        Data
    })
}


module.exports={
    createincident,
    getallincident,
    getIncidentById,
    updateincident,
    deleteIncident
}