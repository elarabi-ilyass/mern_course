const lodash= require('lodash');
const path =require('path');
const fs = require('fs');


//Testing lodash sortBy function
const names = ['Eve','David','Bob','Alice','Charlie'];
const capitalaze= lodash.sortBy(names, name => name.toLowerCase());

console.log(capitalaze);

//Manage Path module
console.log("le path name est : ", path.basename(__filename));
console.log("le dir name est : ", path.dirname(__filename));
console.log("l'extention du fichier est : ", path.extname(__filename));
console.log("le path parse est : ", path.parse(__filename));
console.log("le path join est : ", path.join(__dirname, 'Test', 'hello.html'));
console.log("le path resolve est : ", path.resolve('Test', 'hello.html'));
console.log("le path format est : ", path.format({
    dir: __dirname,
    base: 'index.js'
}));


//Manage File System 
// fs.writeFileSync('test.txt', 'Hello World !');
// const data = fs.readFileSync('test.txt', 'utf8');
// console.log("le contenu du fichier test.txt est : ", data);
// fs.appendFileSync('test.txt', '\nAppended text.');
// const newData = fs.readFileSync('test.txt', 'utf8');
// console.log("le nouveau contenu du fichier test.txt est : ", newData);
// fs.renameSync('test.txt', 'renamed_test.txt');
// console.log("Le fichier a été renommé en renamed_test.txt");
// fs.unlinkSync('renamed_test.txt');
// console.log("Le fichier renamed_test.txt a été supprimé");

//Part 1: Create a directory if it doesn't exist
const dirPath = path.join(__dirname, 'data');
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
    console.log("Le répertoire data a été créé");
} else {
    console.log("Le répertoire data existe déjà");
}
//Part 2: Create and write to a file inside that directory
const filepath=path.join(dirPath,'info.txt');
fs.writeFileSync(filepath,'Hello, this is some information.');
console.log("Le fichier info.txt a été créé avec du contenu.");
//Part 3: Read the content of the file and log it to the console
const dataInfo = fs.readFileSync(filepath, 'utf8');
console.log("le contenu du fichier test.txt est : ", dataInfo);
//Part 4: Append additional content to the file
fs.appendFileSync(filepath, '\nThis is some appended information.');
const dataInfos = fs.readFileSync(filepath, 'utf8');
console.log("le nouvelle contenu du fichier test.txt est : ", dataInfos);
//Part 5: Rename the file
const newFilepath=path.join(dirPath,'updated_info.txt');
fs.renameSync(filepath,newFilepath);
console.log("Le fichier a été renommé en updated_info.txt");





