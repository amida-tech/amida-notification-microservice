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

mongoose.connect(config.mongo.connectionString, options);

require('../server/models/user.model');
