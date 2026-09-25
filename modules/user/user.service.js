const User = require("./user.schema")


const GetUserById=async(userId)=>{
    const user=await User.findById(userId).select("-password")

    if(!user){
        throw new Error("user not found")
    }

    return user
}

const getAllUser=async()=>{
    const user=await User.find().select("-password")

    if(!user){
        throw new Error("user not found")
    }
    return user
}

const deleteUser=async(userId)=>{
    const user=await User.findByIdAndDelete(userId)
    return user
}


const updateUser=async(userId,data)=>{
    const user=await User.findByIdAndUpdate(userId,data).select("-password")
    if(!user){
        throw new Error("user not found")
    }
    return user
}

module.exports={
    GetUserById,
    getAllUser,
    updateUser,
    deleteUser
}

