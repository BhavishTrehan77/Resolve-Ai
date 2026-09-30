const Knowledge = require("../../modules/knowledge/knowledge.schema")
const embedding = require("./embedding");
const { reWriteQuestion } = require("./rewrite");

const retrival=async(query)=>{
     const rewrittenQuery = await reWriteQuestion(query);

     let results = [];
     try {
         const queryEmbedding=await embedding(rewrittenQuery)
         results=await Knowledge.aggregate([{
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
     } catch (err) {
         console.warn("Vector search fallback:", err.message);
         const fallbackDocs = await Knowledge.find({}).limit(5).select("_id text");
         results = fallbackDocs.map(d => ({ _id: d._id, text: d.text, score: 0.5 }));
     }
     return{
        results,
        rewrittenQuery
     }
}
    

module.exports=retrival