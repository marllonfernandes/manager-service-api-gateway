require('dotenv-safe').config({
    allowEmptyValues: true,
    path: process.env.NODE_ENV === 'production' ? '.env' : '.env.develop',
    example: '.env.example'
})

const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

const setupProxies = (app, routes) => {
    routes.forEach(r => {
        app.use(r.url, createProxyMiddleware(r.proxy));
    })
}

exports.setupProxies = setupProxies