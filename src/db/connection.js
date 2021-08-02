require('dotenv-safe').config({
    allowEmptyValues: true,
    path: process.env.NODE_ENV === 'production' ? '.env' : '.env.develop',
    example: '.env.example'
})

const mongoose = require("mongoose")
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

// Or using promises
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.URL_DB}:${process.env.PORT_DB}/${process.env.NAME_DB}`, options)
    .then(() => {
        console.log('MongoDb connected!')
    })
    .catch((err) => {
        console.log(err.message)
        process.exit(2)
    })

const regexVersion = /(\d+\.)(\d+\.)(\d+\.)(\d)/g

const routesProxySchema = mongoose.Schema({
    path: {
        type: String,
        required: [true, 'path property is required']
    },
    version: {
        type: String,
        required: [true, 'version property is required']
    },
    backend: {
        type: String,
        required: [true, 'backend property is required']
    },
    auth: {
        type: String,
        default: '',
        required: false
    },
    path_no_auth_gateway: {
        type: Boolean,
        default: false,
        required: false
    },
    owner: {
        type: String,
        required: [true, 'owner property is required']
    },
    type_protocol: {
        type: String,
        required: [true, 'type_protocol property is required'],
        enum: ['REST', 'SOAP']
    },
    active: {
        type: Boolean,
        required: [true, 'active property is required']
    },
}, { timestamps: true })

// MODEL EXPORTS
exports.RoutesProxy = mongoose.model("RoutesProxy", routesProxySchema)