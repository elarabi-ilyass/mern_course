const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 8000;

// Set view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define Tab BEFORE using it in routes
const Tab = [
    {
        id: 1,
        name: 'Home',
        link: '/'
    },
    {
        id: 2,
        name: 'About',
        link: '/about'
    },
    {
        id: 3,
        name: 'Contact',
        link: '/contact'
    }
];

const Person=[
    {
        nom:"amal",
        age:24

    },
    {
        nom:"sara",
        age:22

    },
    {
        nom:"mohamed",
        age:26

    }
];

// Verify Tab is accessible
console.log('Available tabs:', Tab);
console.log('Available tabs:', Person);

app.get('/', (req, res) => {
    res.render('Home', {
        title: 'Home Page',
        Tab: Tab,  // Pass the Tab array
        Person:Person,
        activeTab: 'Home'
    });
});

app.get('/about', (req, res) => {
    res.render('About', {
        title: 'About Page',
        Tab: Tab,  // Pass the Tab array
        activeTab: 'About'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});