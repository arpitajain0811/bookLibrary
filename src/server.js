const Hapi = require('hapi');
const Routes = require('../routes');
// const https = require('https');

const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: Number(4000),
});

// console.log(booksObj);

server.route(Routes);

module.exports = server;
