module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => reply('server connected'),
  },
];
