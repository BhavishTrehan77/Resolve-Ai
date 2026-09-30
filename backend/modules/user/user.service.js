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
    const user=await User.findByIdAndUpdate(userId,data, { new: true, runValidators: true }).select("-password")
    if(!user){
        throw new Error("user not found")
    }
    return user
}

const bcrypt = require('bcrypt');

const createUser = async ({ name, email, password, role = "AGENT" }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "AGENT"
    });
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
    };
};

module.exports={
    GetUserById,
    getAllUser,
    updateUser,
    deleteUser,
    createUser
}

