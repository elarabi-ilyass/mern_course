const app=require('express')();
require('dotenv').config();

const PORT=process.env.PORT || 8000;

app.get('/',(req,res)=>{
    res.send('Hello World!');
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});