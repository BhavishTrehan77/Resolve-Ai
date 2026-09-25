const mongoose=require('mongoose')



const KnowledgeSchema=new mongoose.Schema({
    documentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Document',
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
    }
},{
    timestamps:true
})

const Knowledge=mongoose.model('Knowledge',KnowledgeSchema)

module.exports=Knowledge