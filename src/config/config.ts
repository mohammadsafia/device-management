import dotenv from 'dotenv';

dotenv.config();

const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: false
};

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

const MONGO = {
    host: MONGO_DB_NAME,
    password: MONGO_PASSWORD,
    username: MONGO_USERNAME,
    options: MONGO_OPTIONS,
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.cbbnz.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority
`
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 5000;
const NAMESPACE = process.env.NAMESPACE || 'Server';

const JWT = process.env.JWT_KEY || 'FotTest';

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    namespace: NAMESPACE,
    jwt: JWT
};

const config = {
    mongo: MONGO,
    server: SERVER
};

export default config;
