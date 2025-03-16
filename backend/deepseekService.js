const express= require("express");
const openai= require("./config");

const router=express.Router();

router.post("/deepseek",async (req,res)=>{
    try{
        const {query}=req.body;
        if(!query) return res.status(400).json({message:"Query is required"})

            //start time
            const startTime=Date.now();
           
        const completion = await openai.chat.completions.create({
            model:"deepseek/deepseek-r1:free",
            messages:[
                {
                    role:"user",
                    content:query
                }
            ]
        })

            //end time
            const endTime= Date.now();
            const responseTime=endTime-startTime;
        res.json({
            ...completion,
            responseTime
        });
    }
    catch(err){
        res.status(500).json({
            error:err.message
        })
    }
})

module.exports=router;