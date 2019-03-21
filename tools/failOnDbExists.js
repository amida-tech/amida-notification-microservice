import mongoose from 'mongoose';
import config from '../config/config';
import mongoConn from '../config/mongo';

(async () => {
    const databaseName = config.mongo.connectionString.split('/').slice(-1)[0];
    await mongoConn;
    const databases = await (new mongoose.mongo.Admin(mongoConn.db)).listDatabases();
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
