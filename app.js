(async() => {

    require('dotenv-safe').config({
        allowEmptyValues: true,
        path: process.env.NODE_ENV === 'production' ? '.env' : '.env.develop',
        example: '.env.example',
    })

    const express = require('express')
    const app = express()
    const { cors } = require('./src/core/cors')
    const { routesProxy } = require('./src/routes/load')
    const { setupLogging } = require("./src/core/logging")
    const { setupRateLimit } = require("./src/core/ratelimit")
    const { setupCreditCheck } = require("./src/core/creditcheck")
    const { setupProxies } = require("./src/core/proxy")
    const auth = require("./src/core/auth").auth
    const port = process.env.PORT || 4434

    const routes = await routesProxy()

    if (routes) {
        app.use(auth)
        app.use(cors)
        setupLogging(app)
        setupRateLimit(app, JSON.parse(routes))
        setupCreditCheck(app, JSON.parse(routes))
        setupProxies(app, JSON.parse(routes))

        app.listen(port, async() => {
            console.log(`API Gateway running in port ${port}!`)
        })
    }

})()