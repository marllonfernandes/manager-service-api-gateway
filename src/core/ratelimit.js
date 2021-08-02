require('dotenv-safe').config({
    allowEmptyValues: true,
    path: process.env.NODE_ENV === 'production' ? '.env' : '.env.develop',
    example: '.env.example'
})

const rateLimit = require("express-rate-limit");

const setupRateLimit = (app, routes) => {
    routes.forEach(r => {
        if (r.rateLimit) {
            app.use(r.url, rateLimit(r.rateLimit));
        }
    })
}

exports.setupRateLimit = setupRateLimit