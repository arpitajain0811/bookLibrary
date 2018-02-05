const server = require('../src/server');

describe('Testing that the Hapi server connects', () => {
  it('Should return 200 status code for sucessful GET request', (done) => {
    const request = {
      method: 'GET',
      url: '/',
    };
    server.inject(request, (response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
  it('Should return number of books for sucessful call to api1', (done) => {
    const request = {
      method: 'GET',
      url: '/books',
    };
    server.inject(request, (response) => {
      expect(response.result).toBe(12);
      done();
    });
  });
});
