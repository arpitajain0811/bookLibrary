const Hapi = require('hapi');
const Routes = require('../routes');

const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: Number(4000),
});

server.route(Routes);

module.exports = server;
