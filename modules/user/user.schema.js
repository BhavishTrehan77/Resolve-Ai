const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true,
        minlength:2,
        maxlength:50
    },
    email:{
        type:
            String,
            required:[true,"Email is required"],
            
            trim :true
        
    },
    password:{
        type:String,
        required: [true, "Password is required"],
        minlength: 8
    },
    role:{
        type:String,
        enum:["EMPLOYEE","AGENT","ADMIN"],
        default:"EMPLOYEE"
    },
    isActive:{
        type:Boolean,
        default:true
    },
    passwordResetToken:{
        type:String,
        select:false
    },
    passwordResetExpires:{
        type:Date,
        select:false
    }

},{
        timestamps:true
    })
const User=mongoose.model('User',UserSchema)

module.exports=User