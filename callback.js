const fs = require('fs');
function calcule(num1,num2, callback) {
    return callback(num1,num2);
  }

  function add(n1,n2) {
    return n1 + n2;
  }

  function multiply(n1,n2) {
    return n1 * n2;
  }

  console.log(calcule(2,3,add)); // 5
  console.log(calcule(2,2,multiply)); // 6

  // Example of asynchronous file read using callback
  fs.readFile('input.txt', 'utf8',(err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    console.log('File content:', data);
  });

  fs.writeFile('output.txt', 'This is some output text.', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('File written successfully.');
  });

  fs.appendFile('output.txt','\nAppended text.', (err) => {
    if (err) {
      console.error('Error appending to file:', err);
      return;
    }
    console.log('Text appended successfully.');
  });