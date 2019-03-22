import mongoose from 'mongoose';
import config from './config';

const mongoConf = config.mongo;

const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
};
if (mongoConf.db) {
    options.dbName = mongoConf.db;
}
if (mongoConf.authSource) {
    options.authSource = mongoConf.authSource;
}
if (mongoConf.user || mongoConf.password) {
    options.auth = {};
    if (mongoConf.user) {
        options.auth.user = mongoConf.user;
    }
    if (mongoConf.password) {
        options.auth.password = mongoConf.password;
    }
}
if (mongoConf.sslEnabled) {
    options.ssl = mongoConf.sslEnabled;
    if (mongoConf.sslCaCert) {
        options.sslCA = mongoConf.sslCaCert;
    }
}

const connection = mongoose.createConnection(mongoConf.connectionString, options);
export default connection;
