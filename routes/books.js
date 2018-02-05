const https = require('https');

// const getBooks = () => {
//   const url = 'https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks';
//   let booksObj = {};
//   https.get(url, (response) => {
//     response.setEncoding('utf8');
//     response.on('data', (data) => {
//       booksObj = JSON.parse(data);
//       return booksObj;
//     });
//   });
// };
module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => reply('server connected'),
  },
  {
    method: 'GET',
    path: '/books',
    handler: (request, reply) => {
      const url = 'https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks';
      let booksObj = {};
      https.get(url, (response) => {
        response.setEncoding('utf8');
        response.on('data', (data) => {
          booksObj = JSON.parse(data);
          reply(booksObj.books.length);
        });
      });
    },
  },
  {
    method: 'GET',
    path: '/bookRatings',
    handler: (request, reply) => {
      const url = 'https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks';
      let booksObj = {};
      https.get(url, (response) => {
        response.setEncoding('utf8');
        response.on('data', (data) => {
          booksObj = JSON.parse(data);
          const arr = [];
          booksObj.books.forEach((book) => {
            const promise = new Promise((resolve) => {
              const url1 = `https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/${book.id}`;
              https.get(url1, (res) => {
                res.setEncoding('utf8');
                res.on('data', (data1) => {
                  const ratingObj = JSON.parse(data1);
                  book.Rating = ratingObj.rating;
                  resolve(book);
                });
              });
            });
            arr.push(promise);
          });
          Promise.all(arr).then(() => {
            reply(booksObj.books);
          });
        });
      });
    },
  },
  {
    method: 'GET',
    path: '/book/byAuthor',
    handler: (request, reply) => {
      const url = 'https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks';
      let booksObj = {};
      console.log('hello');

      https.get(url, (response) => {
        response.setEncoding('utf8');
        response.on('data', (data) => {
          booksObj = JSON.parse(data);
          // booksObj={books:[{},{}...]}
          // console.log('hello');
          const booksByAuthor = {};
          const promiseArray = [];
          booksObj.books.forEach((book) => {
            const promise = new Promise((resolve) => {
              const url1 = `https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/${book.id}`;
              https.get(url1, (res) => {
                res.setEncoding('utf8');
                res.on('data', (data1) => {
                  const ratingObj = JSON.parse(data1);
                  book.Rating = ratingObj.rating;
                  if (book.Author in booksByAuthor) {
                    booksByAuthor[book.Author].push({
                      id: book.id, Name: book.Name, Rating: book.Rating,
                    });
                  } else {
                    const author = book.Author;
                    booksByAuthor[author] = [];
                    booksByAuthor[author].push({
                      id: book.id, Name: book.Name, Rating: book.Rating,
                    });
                  }
                  resolve(booksByAuthor);
                });
              });
            });
            promiseArray.push(promise);
          });
          Promise.all(promiseArray).then(() => {
            reply(booksByAuthor);
          });
        });
      });
    },
  },
];
