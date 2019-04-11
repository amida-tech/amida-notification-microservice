/* eslint-disable no-console */
import readline from 'readline';
import mongoConn from '../config/mongo';
import config from '../config/config';

(async () => {
    if (config.env !== 'test') {
        const theUserIsSure = await new Promise(resolve => readline
            .createInterface(process.stdin, process.stdout)
            .question(`WARNING: NODE_ENV=${config.env}. Are you sure you want to delete your ${config.env} database? (yes/no) `,
                      answer => resolve(answer === 'yes'))
        );
        if (!theUserIsSure) {
            console.log('Aborting.');
            process.exit(2);
        }
    }
    await mongoConn;
    await mongoConn.dropDatabase();
})()
.then(process.exit)
.catch((err) => {
    console.error(err);
    process.exit(1);
});
