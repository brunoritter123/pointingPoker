const proxy = [
    {
      context: ['/api'],
      target: 'http://localhost:3000/',
      secure: false,
      loglevel: 'debug'
    }
  ];
  module.exports = proxy;