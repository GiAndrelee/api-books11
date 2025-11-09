const express = require('express');
const app = express();

app.use(express.json());

// In memory "database" of books
let books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    copiesAvailable: 5
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    copiesAvailable: 3
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian Fiction",
    copiesAvailable: 7
  }
];

// Helper to get the next id
function getNextId() {
  if (books.length === 0) return 1;
  return Math.max(...books.map((b) => b.id)) + 1;
}

// GET /api/books - get all books
app.get('/api/books', (req, res) => {
  res.json(books);
});

// GET /api/books/:id - get one book by id
app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json(book);
});

// POST /api/books - create a new book
app.post('/api/books', (req, res) => {
  const { title, author, genre, copiesAvailable } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  const newBook = {
    id: getNextId(),
    title,
    author,
    genre: genre || 'Unknown',
    copiesAvailable:
      typeof copiesAvailable === 'number' ? copiesAvailable : 0,
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /api/books/:id - update a book
app.put('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const { title, author, genre, copiesAvailable } = req.body;

  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (genre !== undefined) book.genre = genre;
  if (copiesAvailable !== undefined) book.copiesAvailable = copiesAvailable;

  res.json(book);
});

// DELETE /api/books/:id - delete a book
app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books.splice(index, 1);
  res.status(204).send();
});

// Export app for tests
module.exports = app;

// Only start the server if this file is run directly
if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}












