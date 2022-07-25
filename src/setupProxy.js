const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://i.maoyan.com/',
      changeOrigin: true,
    })
  );
  app.use(
    '/ajax',
    createProxyMiddleware({
      target: 'https://i.maoyan.com/',
      changeOrigin: true,
    })
  );
};