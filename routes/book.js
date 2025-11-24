const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createBook,
  getAllBooks,
  getBook,
  addAuthorsToBook,
  removeAuthorsFromBook
} = require('../controllers/bookController');


const upload = multer(); // This handles multipart/form-data
router.post('/',upload.none(), createBook);
router.get('/', getAllBooks);
router.get('/:id', getBook);
router.patch('/:id/authors', upload.none(),addAuthorsToBook);
router.delete('/:id/authors',removeAuthorsFromBook);



module.exports = router;