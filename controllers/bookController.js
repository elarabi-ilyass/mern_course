const Book = require('../models/Book');
const Author = require('../models/Author');

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { title, isbn, publicationYear, authorIds = [] } = req.body;
    
    const book = new Book({
      title,
      isbn,
      publicationYear,
      authors: authorIds
    });

    const savedBook = await book.save();

    // Update authors with this book
    if (authorIds.length > 0) {
      await Author.updateMany(
        { _id: { $in: authorIds } },
        { $push: { books: savedBook._id } }
      );
    }

    res.status(201).json({
      success: true,
      data: savedBook
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all books with authors populated
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('authors', 'name email nationality');
    
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single book with authors
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('authors', 'name email nationality');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Add authors to a book
exports.addAuthorsToBook = async (req, res) => {
  try {
    const { authorIds } = req.body;
    
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    // Add new authors to book
    book.authors.push(...authorIds);
    await book.save();

    // Add book to authors
    await Author.updateMany(
      { _id: { $in: authorIds } },
      { $addToSet: { books: book._id } }
    );

    const updatedBook = await Book.findById(req.params.id).populate('authors', 'name email nationality');

    res.status(200).json({
      success: true,
      data: updatedBook
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Remove authors from a book
exports.removeAuthorsFromBook = async (req, res) => {
  try {
      const authorIds = req.query.ids ? req.query.ids.split(',') : [];
      
        if (authorIds.length === 0) {
          return res.status(400).json({
            success: false,
            error: "authorIds are required in query string: ?ids=id1,id2"
          });
        }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found"
      });
    }

    // Remove authors from book
    book.authors = book.authors.filter(
      id => !authorIds.includes(id.toString())
    );
    await book.save();

    // Remove book from authors
    await Author.updateMany(
      { _id: { $in: authorIds } },
      { $pull: { books: book._id } }
    );

    const updatedBook = await Book.findById(req.params.id)
      .populate("authors", "name email nationality");

    res.status(200).json({
      success: true,
      data: updatedBook
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};



// This example with populate('addressId')
// {
//   "name": "Ilyass",
//   "email": "test@gmail.com",
//   "addressId": {
//     "_id": "65f3c8a4b2c9183b8a9d5892",
//     "city": "Tanger",
//     "street": "Avenue Mohamed VI",
//     "country": "Morocco",
//     "postalCode": "90000"
//   }
// }

// This example without populate('addressId')
// {
//   "name": "Ilyass",
//   "email": "test@gmail.com",
//   "addressId": "65f3c8a4b2c9183b8a9d5892" 
// }

// 👉 populate('addressId') = remplace l’ObjectId par le document complet de l’adresse
// 👉 équivalent de JOIN entre User et Address
// 👉 te permet d’avoir toutes les infos du user + address en 1 seule query


//==================================================================



// | Opération    | Rôle                                                |
// | ------------ | --------------------------------------------------- |
// | **$lookup**  | Fais un JOIN : User ↔ Address (retourne un tableau) |
// | **$unwind**  | Enlève le tableau et retourne l’objet seul          |
// | **$project** | Choisit les champs à retourner                      |

//preserveNullAndEmptyArrays: true
// Pour retourne just l'objet avec l'address car il y a des users qui n'ont pas d'address