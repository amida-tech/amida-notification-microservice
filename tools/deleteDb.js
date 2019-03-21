import mongoConn from '../config/mongo';

(async () => {
    await mongoConn;
    await mongoConn.dropDatabase();
})()
.then(process.exit)
.catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
