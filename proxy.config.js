const proxy = [
  {
    context: ['/api', '/rest'],
    target: 'http://www.scrumpoker.com.br:80/',
    secure: false,
    loglevel: 'debug'
  }
];
module.exports = proxy;