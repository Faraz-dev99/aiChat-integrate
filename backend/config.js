// Load .env file only in development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

const OpenAI= require("openai");

const openai=new OpenAI({
    baseURL: process.env.BASE_URL,
    apiKey: process.env.API_KEY
});


module.exports=openai;