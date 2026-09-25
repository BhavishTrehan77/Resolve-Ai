const { GetUserById, getAllUser, deleteUser, updateUser } = require("./user.service")

const GetUser=async(req,resp)=>{
    const data=await GetUserById(req.params.id)
    resp.json({
        data
    })
}

const GetUsers=async(req,resp)=>{
    const data=await getAllUser()
    resp.json({data})
}

const update = async (userId, data) => {

    if (data.email) {
        const existingUser = await User.findOne({
            email: data.email,
            _id: { $ne: userId }
        });

        if (existingUser) {
            throw new Error("Email already exists");
        }
    }

    const user = await User.findByIdAndUpdate(
        userId,
        data,
        {
            new: true,
            runValidators: true
        }
    ).select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

const Delete=async(req,resp)=>{
    const data=await deleteUser(req.params.id)
    resp.json({data})
}

module.exports={
    GetUser,
    GetUsers,
    update,
    Delete
}