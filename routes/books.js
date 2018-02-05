const https = require('https');

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
        // const booksNumber = booksObj.books.length;
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
          // const getRating = () => {
          booksObj.books.forEach((book) => {
            const promise = new Promise((resolve) => {
              const url1 = `https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/${book.id}`;
              https.get(url1, (res) => {
                res.setEncoding('utf8');
                res.on('data', (data1) => {
                  // console.log(data1);
                  const ratingObj = JSON.parse(data1);
                  book.Rating = ratingObj.rating;
                  // console.log(book.Rating);
                  // arr.push(book);
                  resolve(book);
                  // return Promise.resolve('book');
                });
              });
            });
            arr.push(promise);
            // console.log(arr);
          });
          // };
          Promise.all(arr).then(() => {
            reply(booksObj.books);
          }).catch((e) => {
            console.log(e.message);
          });
        });
      });
      // reply(booksObj);
    },
  },
];
