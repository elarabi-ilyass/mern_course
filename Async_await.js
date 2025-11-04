
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function asyncFunction(name){
  await delay(9000);
  console.log(`Hello, ${name}!`);
}

// console.log("Async/Await lecture Start");
// asyncFunction("Alice").then(() => {
//   console.log("Async function completed.");
// });
// console.log("End of Async/Await lecture");




//Example Number Two: Handling Errors with Async/Await
async function divideAsync(num1, num2) {
  if (num2 <= 0) {
    throw new Error("Error: Division by zero");
  }
  return num1 / num2;
}

console.log("Async/Await lecture Start");
asyncFunction("Bob")
  .then(() => divideAsync(9000, 100))
  .then((result) => console.log(result))
  .catch((error) => console.error(error.message));
console.log("End of Async/Await lecture");




