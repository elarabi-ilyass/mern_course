const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createAuthor,
  getAllAuthors,
  getAuthor,
  addBooksToAuthor
} = require('../controllers/authorController');
const upload = multer(); // This handles multipart/form-database

router.post('/',upload.none(),createAuthor);
router.get('/', getAllAuthors);
router.get('/:id', getAuthor);
router.patch('/:id/books',upload.none(),addBooksToAuthor);

module.exports = router;