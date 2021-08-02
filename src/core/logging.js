require('dotenv-safe').config({
    allowEmptyValues: true,
    path: process.env.NODE_ENV === 'production' ? '.env' : '.env.develop',
    example: '.env.example'
})

const morgan = require("morgan");

const setupLogging = (app) => {
    app.use(morgan('tiny'));
}

exports.setupLogging = setupLogging