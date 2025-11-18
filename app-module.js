const app=require('express')();
require('dotenv').config();

const PORT=process.env.PORT || 8000;

//To dynamically generate the final HTML page on the server, mixing your template with real data, before sending it to the user's browser.
// It's the "V" (View) in the MVC (Model-View-Controller) design pattern, which is a common way to structure web applications.

app.set("view engine","ejs");

app.get("/",(req,res)=>{
    console.dir(req.ip);
    console.dir(req.hostname);
    console.dir(req.originalUrl);
    console.dir(req.baseUrl) // '/admin'
    console.dir(req.path) // '/new'
    res.send('Hello from app-module.js!');
});

const data=[
    {id:1, name:'Item 1'},
    {id:2, name:'Item 2'},
    {id:3, name:'Item 3'}
];


app.get('/app',(req,res)=>{
    res.send({
        message: 'Data endpoint hit',
        query: data
    });
});

app.post('/app/add',(req,res)=>{
    res.send({
        message: 'Add endpoint hit',
        data:req.body
    });
});

// Catches errors that occur during the request-response cycle

// Centralizes error handling instead of having try-catch blocks in every route

app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
