const lodash= require('lodash');
const path =require('path');


//Testing lodash sortBy function
const names = ['Eve','David','Bob','Alice','Charlie'];
const capitalaze= lodash.sortBy(names, name => name.toLowerCase());

console.log(capitalaze);

//Path module
console.log("le path name est : ", path.basename(__filename));
console.log("le dir name est : ", path.dirname(__filename));
console.log("l'extention du fichier est : ", path.extname(__filename));
console.log("le path parse est : ", path.parse(__filename));
console.log("le path join est : ", path.join(__dirname, 'Test', 'hello.html'));
console.log("le path resolve est : ", path.resolve('Test', 'hello.html'));