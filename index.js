import 'babel-polyfill';
import app from './config/express';
import config from './config/config';
import logger from './config/winston';
import mongoConn from './config/mongo';

// module.parent check is required to support mocha watch
if (!module.parent) {
    // establish connection to mongo
    mongoConn.then(() => {
        // listen on port config.port
        app.listen(config.port, () => {
            logger.info(`server started on port ${config.port} (${config.env})`, {
                port: config.port,
                node_env: config.env,
            });
        });
    }).catch((err) => {
        logger.error(err);
        process.exit(1);
    });
}

export default app;
