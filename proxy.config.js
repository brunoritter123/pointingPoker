const proxy = [
  {
    context: ['/api', '/rest'],
    target: 'http://10.171.67.66:3000/',
    secure: false,
    loglevel: 'debug'
  }
];
module.exports = proxy;