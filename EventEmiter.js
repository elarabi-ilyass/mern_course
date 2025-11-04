const EventEmitter = require('events');
// Your house (Event Emitter)
const house = new EventEmitter();

// People in different rooms (Event Listeners) create event
house.on('doorbell', () => {
    console.log("Mom: I'll get the door!");
});

house.on('doorbell', () => {
    console.log("Dog: Woof! Woof! Someone's here!");
});

house.on('mail', () => {
    console.log("Dad: The mail arrived!");
});

house.on('phone', (caller) => {
    console.log(`Teen: Phone call from ${caller}`);
});

// Events happening (Event Triggers) send event
console.log("🔔 Doorbell rings:");
house.emit('doorbell');

console.log("\n📬 Mail arrives:");
house.emit('mail');

console.log("\n📞 Phone rings:");
house.emit('phone', 'Grandma');


// Event Emitter = Your House's Doorbell System

// Doorbell Button = .emit() (triggers the event)

// People Inside = .on() (listen for the event)

// Different Sounds = Different event types

// Actions Taken = What happens when event occurs