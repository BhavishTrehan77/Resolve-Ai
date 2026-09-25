const calculateConfidence=(results)=>{
     if (!results || results.length === 0) {
        return 0;
    }
    const score=results.map(result=>result.score||0)

    const average=score.reduce((sum,score)=>{
        return sum+score;
    },0)/score.length
    return Number(average.toFixed(3))
}
module.exports={
    calculateConfidence
}
