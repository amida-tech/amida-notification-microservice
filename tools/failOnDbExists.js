import mongoose from 'mongoose';
import config from '../config/config';

require('babel-polyfill');

(async () => {
    const databaseName = config.mongo.connectionString.split('/').slice(-1)[0];
    await mongoose.connect(config.mongo.connectionString, { dbName: 'test', useNewUrlParser: true });
    const databases = await (new mongoose.mongo.Admin(mongoose.connection.db)).listDatabases();
    const databaseExists = databases.databases.find(db => db.name === databaseName);
    if (databaseExists) {
        throw new Error('Database exists. Failing.');
    }
})()
.then(process.exit)
.catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
