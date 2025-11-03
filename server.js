const http=require('http');
const port=3000;

const server=http.createServer((req,res)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    // res.end('Salut Ilyass\n');
    url=req.url;
    if(url==='/'){
        res.end('Bienvenue sur la page d\'accueil\n');
    }else if(url==='/about'){
        res.end('Bienvenue sur la page à propos\n');
    }else{
        res.end('Page non trouvée\n');
    }
});

server.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}/`);
});