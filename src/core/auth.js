require('dotenv-safe').config({
    allowEmptyValues: true,
    path: process.env.NODE_ENV === 'production' ? '.env' : '.env.develop',
    example: '.env.example'
})
const app = require('../../app')
const db = require('../db/connection')

const auth = async(req, res, next) => {

    try {

        let path = req.path.split('/')[1].trim()
        let version = req.path.split('/')[2].trim()
        let route = await db.RoutesProxy.findOne({ path: path, version: version })

        if (!route) {
            res.status(404).send()
            return
        }

        if (req.headers['authorization']) {

            // api´s que ja possuem autenticaocao no backend nao sera validado no api-gateway
            if (route.path_no_auth_gateway) {
                next()
            } else {
                if (route.auth.trim() === req.headers['authorization'].trim()) {
                    next()
                } else {
                    res.status(401).send()
                }
            }
        } else {
            res.status(401).send()
        }
    } catch (error) {
        res.status(500).send(error.message)
    }

}
exports.auth = auth