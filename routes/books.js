const rp = require('request-promise');
const Models = require('../models');

const getBooks = () => {
  const url = 'https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks';
  const promise = new Promise((resolve) => {
    rp(url).then((response) => {
      const booksObj = JSON.parse(response);
      resolve(booksObj);
    });
  });
  return promise;
};

const getRatings = (books) => {
  const promiseArray = [];
  books.forEach((book) => {
    const promise = new Promise((resolve) => {
      const url1 = `https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/${book.id}`;
      rp(url1).then((res) => {
        const ratingObj = JSON.parse(res);
        book.Rating = ratingObj.rating;
        resolve(book);
      });
    });
    promiseArray.push(promise);
  });
  return promiseArray;
};

const groupByAuthor = (books) => {
  const booksByAuthor = {};
  books.forEach((book) => {
    if (book.Author in booksByAuthor) {
      booksByAuthor[book.Author].push(book);
    } else {
      const author = book.Author;
      booksByAuthor[author] = [];
      booksByAuthor[author].push(book);
    }
  });
  return booksByAuthor;
};
const addBooksToTable = (books) => {
  const promiseArray = [];
  books.forEach((book) => {
    const promise = new Promise((resolve) => {
      Models.books.create({
        bookId: book.id,
        name: book.Name,
        author: book.Author,
        rating: book.Rating,
      });
      resolve(book);
    });
    promiseArray.push(promise);
  });
  return promiseArray;
};
const route = [
  {
    method: 'GET',
    path: '/books',
    handler: (request, reply) => {
      const booksPromise = getBooks();
      booksPromise.then((booksObj) => {
        const promiseArray = getRatings(booksObj.books);
        Promise.all(promiseArray).then(() => {
          const booksByAuthor = groupByAuthor(booksObj.books);
          reply(booksByAuthor);
        });
      });
    },
  },
  {
    method: 'POST',
    path: '/book',
    handler: (request, response) => {
      const booksPromise = getBooks();
      booksPromise.then((booksObj) => {
        const promiseArray = getRatings(booksObj.books);
        Promise.all(promiseArray).then(() => {
          Models.books.destroy({ where: {} }).then(() => {
            const promiseArray2 = addBooksToTable(booksObj.books);
            Promise.all(promiseArray2).then(() => {
              response({
                statusCode: 201,
                message: 'Books added to database',
              });
            });
          });
        });
      });
    },
  },
  {
    method: 'PUT',
    path: '/like/{id}',
    handler: (request, response) => {
      Models.likes.upsert(
        { 
          bookId:request.params.id,
          liked: 1,
        },  
      ).then(() => {
        response({
          statusCode: 200,
          message: 'Liked',
        });
      });
    },
  },
  {
    method: 'PUT',
    path: '/unlike/{id}',
    handler: (request, response) => {
      Models.likes.upsert(
        {
          bookId: request.params.id,
          liked: 0,
        },
      ).then(() => {
        response({
          statusCode: 200,
          message: 'unliked',
        });
      });
    },
  },
];
module.exports = {
  route,
  getBooks,
  getRatings,
  groupByAuthor,
};
