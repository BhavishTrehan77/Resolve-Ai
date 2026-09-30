const mongoose=require('mongoose')



const KnowledgeSchema=new mongoose.Schema({
    documentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doc',
        required:true
    },
    text:{
        type:String,
        trim:true,
        required:true
    },
    embedding:{
        type:[Number],
        required:true
    },
   
    category:{
        type:String,
        enum:[
            "NETWORK",
            "HARDWARE",
            "SOFTWARE",
                "DATABASE",
                "SECURITY",
                "ACCESS",
                "CLOUD",
                "OTHER"
        ]
    },
    source:{
        type:String,
        default:"Knowledge Base"
    },
    metadata:{
        type:mongoose.Schema.Types.Mixed,
        default:{}
    }
},{
    timestamps:true
})

const Knowledge=mongoose.model('Knowledge',KnowledgeSchema)

module.exports=Knowledge