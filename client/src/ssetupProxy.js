const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(proxy('/api/dateRecord', { target: 'http://localhost:5000' }));
};
