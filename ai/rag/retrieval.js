const Knowledge = require("../../modules/knowledge/knowledge.schema")
const embedding = require("./embedding")

const retrival=async(query)=>{
    const queryEmbedding=await embedding(query)

     const results=await Knowledge.aggregate([{
        $vectorSearch:{
            index:"vector_index",
            path:"embedding",
            queryVector:queryEmbedding,
            numCandidates:50,
            limit:5
        }
     },{
        $project:{
            _id:1,
            text:1,
            score:{
                $meta:"vectorSearchScore"
            }
        }
     }])
     return results
}
    

module.exports=retrival