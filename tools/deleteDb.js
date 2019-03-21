import mongoConn from '../config/mongo';

require('babel-polyfill');

(async () => {
    await mongoConn.dropDatabase();
})()
.then(process.exit)
.catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
