const request = require('supertest');
const app = require('../server');

describe('Books API', () => {
  let createdBookId;

  test('GET /api/books should return all books', async () => {
    const res = await request(app).get('/api/books');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });

  test('GET /api/books/1 should return The Great Gatsby', async () => {
    const res = await request(app).get('/api/books/1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('title', 'The Great Gatsby');
    expect(res.body).toHaveProperty('author', 'F. Scott Fitzgerald');
    expect(res.body).toHaveProperty('genre', 'Fiction');
    expect(res.body).toHaveProperty('copiesAvailable', 5);
  });

  test('GET /api/books/999 should return 404 for non existing book', async () => {
    const res = await request(app).get('/api/books/999');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Book not found');
  });

  test('POST /api/books should create a new book', async () => {
    const newBook = {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      genre: 'Fantasy',
      copiesAvailable: 4,
    };

    const res = await request(app)
      .post('/api/books')
      .send(newBook);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toMatchObject({
      title: newBook.title,
      author: newBook.author,
      genre: newBook.genre,
      copiesAvailable: newBook.copiesAvailable,
    });

    createdBookId = res.body.id;
  });

  test('PUT /api/books/:id should update an existing book', async () => {
    const updatedData = {
      title: 'The Hobbit (Updated)',
      copiesAvailable: 10,
    };

    const res = await request(app)
      .put(`/api/books/${createdBookId}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdBookId);
    expect(res.body).toHaveProperty('title', updatedData.title);
    expect(res.body).toHaveProperty(
      'copiesAvailable',
      updatedData.copiesAvailable
    );
  });

  test('PUT /api/books/999 should return 404 when updating non existing book', async () => {
    const res = await request(app)
      .put('/api/books/999')
      .send({ title: 'Does not matter' });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Book not found');
  });

  test('DELETE /api/books/:id should delete an existing book', async () => {
    const res = await request(app).delete(`/api/books/${createdBookId}`);

    expect(res.statusCode).toBe(204);
  });

  test('GET /api/books/:id after delete should return 404', async () => {
    const res = await request(app).get(`/api/books/${createdBookId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Book not found');
  });

  test('DELETE /api/books/999 should return 404 for non existing book', async () => {
    const res = await request(app).delete('/api/books/999');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Book not found');
  });
});
