const EventEmitter = require('events');

class ChatRoom extends EventEmitter {
    constructor() {
        super();
    }
    
    sendMessage(user, message) {
        this.emit('message', { user, message, timestamp: new Date() });
    }
    
    userJoins(user) {
        this.emit('userJoin', user);
    }
    
    userLeaves(user) {
        this.emit('userLeave', user);
    }
}

// Create chat room
const chat = new ChatRoom();

// Multiple listeners for the same event
chat.on('message', (data) => {
    console.log(`[MESSAGE] ${data.user}: ${data.message}`);
});

chat.on('message', (data) => {
    // Save to database (simulated)
    console.log(`[DATABASE] Saving message from ${data.user}`);
});

chat.on('userJoin', (user) => {
    console.log(`🎉 ${user} joined the chat!`);
});

chat.on('userLeave', (user) => {
    console.log(`👋 ${user} left the chat`);
});

// Simulate chat activity
chat.userJoins('John');
chat.sendMessage('John', 'Hello everyone!');
chat.sendMessage('Alice', 'Hi John! Welcome!');
chat.userJoins('Bob');
chat.sendMessage('Bob', 'Hey guys!');
chat.userLeaves('John');