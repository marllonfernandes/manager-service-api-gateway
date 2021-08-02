(async() => {

    require('dotenv-safe').config({
        allowEmptyValues: true,
        path: process.env.NODE_ENV === 'production' ? '.env' : '.env.develop',
        example: '.env.example',
    })

    const express = require('express')
    const app = express()
    const { cors } = require('./core/cors')
    const { routesProxy } = require('./routes/load')
    const { setupLogging } = require("./core/logging")
    const { setupRateLimit } = require("./core/ratelimit")
    const { setupCreditCheck } = require("./core/creditcheck")
    const { setupProxies } = require("./core/proxy")
    const auth = require("./core/auth").auth
    const port = process.env.PORT || 4434
    const logger = require('./logger')

    const routes = await routesProxy()

    if (routes) {
        app.use(auth)
        app.use(cors)
        setupLogging(app)
        setupRateLimit(app, JSON.parse(routes))
        setupCreditCheck(app, JSON.parse(routes))
        setupProxies(app, JSON.parse(routes))

        app.listen(port, async() => {
            logger.info(`API Gateway running in port ${port}!`)
        })
    }

})()