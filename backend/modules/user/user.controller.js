const { GetUserById, getAllUser, deleteUser, updateUser, createUser } = require("./user.service")

const GetUser=async(req,resp)=>{
    try {
        const data=await GetUserById(req.params.id)
        resp.json({
            success: true,
            data
        })
    } catch (err) {
        resp.status(404).json({ success: false, message: err.message })
    }
}

const GetUsers=async(req,resp)=>{
    try {
        const data=await getAllUser()
        resp.json({
            success: true,
            data
        })
    } catch (err) {
        resp.status(400).json({ success: false, message: err.message })
    }
}

const update=async(req,resp)=>{
    try {
        const data=await updateUser(req.params.id,req.body)
        resp.json({
            success: true,
            data
        })
    } catch (err) {
        resp.status(400).json({ success: false, message: err.message })
    }
}

const Delete=async(req,resp)=>{
    try {
        const data=await deleteUser(req.params.id)
        resp.json({
            success: true,
            data
        })
    } catch (err) {
        resp.status(400).json({ success: false, message: err.message })
    }
}

const createUserController=async(req,resp)=>{
    try {
        const data=await createUser(req.body)
        resp.status(201).json({
            success: true,
            data
        })
    } catch (err) {
        resp.status(400).json({ success: false, message: err.message })
    }
}

module.exports={
    GetUser,
    GetUsers,
    update,
    Delete,
    createUserController
}