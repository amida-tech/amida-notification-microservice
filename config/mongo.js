import mongoose from 'mongoose';
import config from './config';
// TODO replace this for mongo
// import { ensureConnectionIsEncrypted } from './helpers';

const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
};

if (config.sslEnabled) {
    options.server = {};
    options.server.ssl = config.mongo.sslEnabled;
    if (config.sslCaCert) {
        options.server.sslCA = config.mongo.sslCaCert;
    }
}

const connection = mongoose.createConnection(config.mongo.connectionString, options);
export default connection;
