require('dotenv-safe').config({
    allowEmptyValues: true,
    path: process.env.NODE_ENV === 'production' ? '.env' : '.env.develop',
    example: '.env.example'
})

const logger = require('../logger')
const db = require('../db/connection')

const defaulDocNew = {
    path: "google",
    version: "v1.0",
    active: true,
    path_no_auth_gateway: false,
    type_protocol: 'REST',
    backend: "https://google.com",
    auth: "Bearer g",
    owner: "seuemail@provedor.com.br"
}

async function validatePreCreate(value) {

    const docNew = new db.RoutesProxy(value)
    const err = docNew.validateSync()

    if (!err) {
        return []
    }

    const props = Object.values(err.errors)

    return props.map(err => ({
        type: err.kind,
        field: err.path,
        value: err.value,
        message: err.message,
    }));

}

async function createDefault(value) {
    return await db.RoutesProxy.create(value)
}

async function get() {

    let routes = await db.RoutesProxy.find({})
    let dataRoutes = []

    routes.forEach(route => {

        if (!route.active) {
            return
        }

        let pathFormat = route.path.trim().indexOf('/') === -1 ? `/${route.path.trim()}/` : route.path.trim()
        let versionFormat = route.version.trim().indexOf('/') === -1 ? `${route.version.trim()}/` : route.version.trim()
        let pathComplet = pathFormat + versionFormat

        dataRoutes.push({
            url: pathComplet,
            auth: false,
            creditCheck: false,
            // rateLimit: {
            //     windowMs: 15 * 60 * 1000,
            //     max: 5
            // },
            proxy: {
                target: route.backend.trim(),
                changeOrigin: true,
                pathRewrite: {
                    [`^${pathComplet}`]: '',
                }
            }
        })

    })

    return dataRoutes
}

async function routesProxy() {
    try {
        let data = JSON.stringify(await get())
        if (JSON.parse(data).length <= 0) {
            const validError = await validatePreCreate(defaulDocNew)
            if (validError.length <= 0) {
                await createDefault(defaulDocNew)
            } else {
                logger.info('Unable to save default values, errors found:')
                logger.info(validError)
            }
            data = JSON.stringify(await get())
        }
        return data
    } catch (error) {
        logger.error(error.message)
    }
}

exports.routesProxy = routesProxy;