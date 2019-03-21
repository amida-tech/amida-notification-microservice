import mongoose from 'mongoose';
import config from '../config/config';

require('babel-polyfill');

(async () => {
    await mongoose.connect(config.mongo.connectionString, { useNewUrlParser: true });
    await mongoose.connection.dropDatabase();
})()
.then(process.exit)
.catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
