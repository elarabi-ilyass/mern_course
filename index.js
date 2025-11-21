const express = require('express');
const multer = require('multer');
require('dotenv').config();

const { connectDB } = require('./config/database');
const Book = require('./models/Book');

const app = express();
const port = 8000;

// 🔥 CONNEXION À LA BASE DE DONNÉES
connectDB();

// Middleware
app.use(express.json());

// ✅ Configure multer for form-data
const upload = multer(); // This handles multipart/form-data

// Routes API

// 🔥 USE upload.none() TO PARSE FORM-DATA
app.post('/books', upload.none(), async (req, res) => {
  try {
    // req.body now contains form-data instead of JSON
    const { title, author, publishedYear, isAvailable } = req.body;

    // Validation simple
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // Convert string values to appropriate types
    const newBook = new Book({
      title,
      author,
      publishedYear: publishedYear ? parseInt(publishedYear) : undefined,
      isAvailable: isAvailable ? (isAvailable === 'true') : true // Convert string to boolean
    });
    
    const savedBook = await newBook.save();
    res.status(201).json({
      book: savedBook,
      message: 'Book created successfully'
    });
  }
  catch(error){
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//fetch all books
app.get('/books', async (req, res) => {
  try{
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({
      books,
      message: 'Books retrieved successfully'
    });
  }
  catch(error){
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//fetch book by id
app.get('/books/:id', async (req, res) => {
  console.log('🔍 Route /books/:id appelée avec ID:', req.params.id);
  
  try {
    console.log('📖 Recherche du livre dans la base...');
    const book = await Book.findById(req.params.id);
    
    console.log('📚 Résultat de la recherche:', book);
    
    if (!book) {
      console.log('❌ Livre non trouvé');
      return res.status(404).json({ error: 'Book not found' });
    }
    
    console.log('✅ Livre trouvé, envoi de la réponse');
    res.status(200).json({
      book,
      message: 'Book retrieved successfully'
    });
    
  } catch (error) {
    console.error('💥 Erreur:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid book ID format' });
    }
    
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Update by id 
app.put('/books/:id', upload.none(), async (req, res) => {
  try {
    const { title, author, publishedYear, isAvailable } = req.body;

    const updatedData = {
      title,
      author,
      publishedYear: publishedYear ? parseInt(publishedYear) : undefined,
      isAvailable: isAvailable ? (isAvailable === 'true') : true
    };

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({
      book: updatedBook,
      message: 'Book updated successfully'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Delete by id
app.delete('/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});