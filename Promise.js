function TimePromise(delay){
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

// console.log("Promise lecture Start")
// TimePromise(9000).then(()=>console.log("9 second passed"))
// console.log("End of Promise lecture");


function DividePromise(num1,num2){
  return new Promise((resolve, reject) => {
    if(num2 === 0){
      reject("Error: Division by zero");
    } else {
      resolve(num1 / num2);
    }
  });
}

console.log("Promise lecture Start")
DividePromise(9000,10)
        .then((resolve)=>console.log(resolve))
        .catch((reject) => console.error(reject));
console.log("End of Promise lecture");


// Role: Handle asynchronous operations (e.g., API calls, file reading) in a more organized way than callbacks.

// Three States:

// Pending: Initial state

// Fulfilled: Operation completed successfully

// Rejected: Operation failed

// Key Methods:

// .then() - Handles successful results

// .catch() - Handles errors/failures

// .finally() - Runs regardless of success/failure





