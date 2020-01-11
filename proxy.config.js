const proxy = [
  {
    context: ['/api', '/rest'],
    target: 'http://localhost:3000/',
    secure: false,
    loglevel: 'debug'
  }
];
module.exports = proxy;