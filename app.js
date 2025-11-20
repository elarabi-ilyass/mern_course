const express = require('express');
const app = express();
const port = 8000;
const multer = require('multer');

app.use(express.json());

// Initialize multer for form-data parsing
const upload = multer();

// Initialize books array and nextId - MAKE SURE THESE ARE AT THE TOP LEVEL
let books = [
  { id: 1, title: 'The Great Gatsby', createdAt: '2023-01-01' },
  { id: 2, title: 'To Kill a Mockingbird', createdAt: '2023-01-02' },
  { id: 3, title: 'Souad zain', createdAt: '2023-01-02' }
];

let nextId = 3; // This should be defined here, not inside any function

// POST endpoint to create a new book
app.post('/api/books', upload.none(), (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log
    
    // Check if req.body exists and has title
    if (!req.body || !req.body.title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required in form-data'
      });
    }

    const { title } = req.body;

    // Basic validation
    if (!title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title cannot be empty'
      });
    }

    // Create new book object
    const newBook = {
      id: nextId++,
      title: title.trim(),
      createdAt: new Date().toISOString()
    };

    // Add to our "database"
    books.push(newBook);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: newBook
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// GET endpoint to see all books
app.get('/api/books', (req, res) => {
  res.json({
    success: true,
    data: books
  });
});

//Get single book by id
app.get('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }

  res.json({
    success: true,
    data: book
  });
});

//Update data by id
app.put('/api/books/:id', upload.none(), (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const bookIndex = books.findIndex(b => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }

  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Title is required and cannot be empty'
    });
  }

  books[bookIndex].title = title.trim();

  res.json({
    success: true,
    message: 'Book updated successfully',
    data: books[bookIndex]
  });
});

//Delete book by id
app.delete('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const bookIndex = books.findIndex(b => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }

  const deletedBook = books.splice(bookIndex, 1);

  res.json({
    success: true,
    message: 'Book deleted successfully',
    data: deletedBook[0]
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});