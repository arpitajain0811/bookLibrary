const Hapi = require('hapi');
const Routes = require('../routes');
// const https = require('https');

const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: Number(4009),
});

server.route(Routes);
server.start();
module.exports = server;
