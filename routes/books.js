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
];
