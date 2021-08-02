require('dotenv-safe').config({
    allowEmptyValues: true,
    path: process.env.NODE_ENV === 'production' ? '.env' : '.env.develop',
    example: '.env.example'
})

const cors = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // colocar os dominios permitidos | ex: 127.0.0.1:3000
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
}
exports.cors = cors