// Load .env file only in development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
  
  // Initialize OpenAI client
  const { OpenAI } = require('openai');
  
  const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000", // For local testing
      "X-Title": "My Awesome App"
    }
  });

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