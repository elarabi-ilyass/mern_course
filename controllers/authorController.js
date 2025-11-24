const Author = require('../models/Author');
const Book = require('../models/Book');

// Create a new author
exports.createAuthor = async (req, res) => {
  try {
    const { name, email, nationality, bookIds = [] } = req.body;
    
    const author = new Author({
      name,
      email,
      nationality,
      books: bookIds
    });

    const savedAuthor = await author.save();

    // Update books with this author
    if (bookIds.length > 0) {
      await Book.updateMany(
        { _id: { $in: bookIds } },
        { $push: { authors: savedAuthor._id } }
      );
    }

    res.status(201).json({
      success: true,
      data: savedAuthor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all authors with books populated
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find().populate('books', 'title isbn publicationYear');
    
    res.status(200).json({
      success: true,
      count: authors.length,
      data: authors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single author with books
exports.getAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id).populate('books', 'title isbn publicationYear');
    
    if (!author) {
      return res.status(404).json({
        success: false,
        error: 'Author not found'
      });
    }

    res.status(200).json({
      success: true,
      data: author
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Add books to an author
exports.addBooksToAuthor = async (req, res) => {
  try {
    const { bookIds } = req.body;
    
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({
        success: false,
        error: 'Author not found'
      });
    }

    // Add new books to author
    author.books.push(...bookIds);
    await author.save();

    // Add author to books
    await Book.updateMany(
      { _id: { $in: bookIds } },
      { $addToSet: { authors: author._id } }
    );

    const updatedAuthor = await Author.findById(req.params.id).populate('books', 'title isbn publicationYear');

    res.status(200).json({
      success: true,
      data: updatedAuthor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};