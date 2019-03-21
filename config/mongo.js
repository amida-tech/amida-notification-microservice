import mongoose from 'mongoose';
import config from './config';
// TODO replace this for mongo
// import { ensureConnectionIsEncrypted } from './helpers';

const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
};

if (config.mongo.sslEnabled) {
    options.ssl = config.mongo.sslEnabled;
    if (config.sslCaCert) {
        options.sslCA = config.mongo.sslCaCert;
    }
}

const connection = mongoose.createConnection(config.mongo.connectionString, options);
export default connection;
