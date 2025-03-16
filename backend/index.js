const express= require("express");
const cors = require('cors');
const deepseekRoutes=require("./deepseekService");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/",deepseekRoutes);
const PORT = 5000;

app.listen(PORT,()=>{
    console.log("server is running..")
});