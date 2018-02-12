const server = require('../src/server');
const bookFns = require('../routes/books.js');

describe('testing functions for getting books and ratings', () => {
  it('get books from URL1', () => {
    const promise = bookFns.getBooks();
    promise.then((booksObj) => {
      expect(booksObj.books.length).toBe(12);
    });
  });
  it('get ratings for books from URL2', () => {
    const books = [{
      Author: 'J K Rowling',
      id: 2,
      Name: 'Harry Potter and the Chamber of Secrets (Harry Potter, #2)',
    },
    ];
    const promiseArray = bookFns.getRatings(books);

    Promise.all(promiseArray).then((booksWithRatings) => {
      expect(booksWithRatings[0].Rating).toBe(4.38);
    });
  });
  it('groups books by author', () => {
    const books = [{
      Author: 'J K Rowling',
      id: 1,
      Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)',
      Rating: 4.45,
    },
    {
      Author: 'J K Rowling',
      id: 2,
      Name: 'Harry Potter and the Chamber of Secrets (Harry Potter, #2)',
      Rating: 4.38,
    }];
    const booksByAuthor = bookFns.groupByAuthor(books);
    expect(booksByAuthor['J K Rowling'].length).toEqual(2);
  });
  it('returns books grouped by author', (done) => {
    const request = {
      method: 'GET',
      url: '/books',
    };
    server.inject(request, (response) => {
      expect(Array.isArray(response.result['J K Rowling'])).toEqual(true);
      done();
    });
  }, 10000);
  it('adds books to the database', (done) => {
    const request = {
      method: 'POST',
      url: '/book',
    };
    server.inject(request, (response) => {
      expect(response.result.message).toEqual('Books added to database');
      done();
    });
  }, 100000);
});
