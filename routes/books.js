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
    // console.log('#', book.dataValues, '$');
    const bookObj = book.dataValues;
    if (bookObj.author in booksByAuthor) {
      booksByAuthor[bookObj.author].push(bookObj);
    } else {
      const Author = bookObj.author;
      booksByAuthor[Author] = [];
      booksByAuthor[Author].push(bookObj);
    }
  });
  // console.log(booksByAuthor);
  return booksByAuthor;
};
const validateId = (id) => {
  const promise = new Promise((resolve) => {
    Models.books.find({
      where: {
        bookId: id,
      },
    }).then((user) => {
      if (user) resolve(true);
      else { resolve(false); }
    });
  });
  return promise;
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
    method: 'GET',
    path: '/books/local',
    handler: (request, response) => {
      Models.books.findAll().then((result) => {
        console.log(result);
        console.log(result.length);
        if (result.length === 0) {
          response({
            message: 'empty',
          });
        }
        // console.log(result[1].dataValues);
        const booksByAuthor = groupByAuthor(result);
        response({
          booksByAuthor,
          message: 'not empty',
        });
      });
    },
  },
  {
    method: 'PUT',
    path: '/like/{id}',
    handler: (request, response) => {
      const validPromise = validateId(request.params.id);
      validPromise.then((valid) => {
        if (valid) {
          Models.likes.upsert({
            bookId: request.params.id,
            liked: 1,
          }).then(() => {
            response({
              statusCode: 200,
              message: 'Liked',
            });
          });
        } else {
          response({
            message: 'Book does not exist',
          });
        }
      });
    },
  },
  {
    method: 'PUT',
    path: '/unlike/{id}',
    handler: (request, response) => {
      const validPromise = validateId(request.params.id);
      validPromise.then((valid) => {
        if (valid) {
          console.log('valid');
          Models.likes.upsert({
            bookId: request.params.id,
            liked: 0,
          }).then(() => {
            response({
              statusCode: 200,
              message: 'unliked',
            });
          });
        } else {
          response({
            message: 'Book does not exist',
          });
        }
      });
    },
  },
  {
    method: 'GET',
    path: '/likes',
    handler: (request, reply) => {
      Models.likes.findAll().then((result) => {
        reply(result);
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
