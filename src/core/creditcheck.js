require('dotenv-safe').config({
    allowEmptyValues: true,
    path: process.env.NODE_ENV === 'production' ? '.env' : '.env.develop',
    example: '.env.example'
})

const logger = require('../logger')

const checkCredit = (req) => {
    return new Promise((resolve, reject) => {
        logger.info("Checking credit with token", req.headers["authorization"]);
        setTimeout(() => {
            reject('No sufficient credits');
        }, 500);
    })
}

const setupCreditCheck = (app, routes) => {
    routes.forEach(r => {
        if (r.creditCheck) {
            app.use(r.url, function(req, res, next) {
                checkCredit(req).then(() => {
                    next();
                }).catch((error) => {
                    res.status(402).send({ error });
                })
            });
        }
    })
}

exports.setupCreditCheck = setupCreditCheck