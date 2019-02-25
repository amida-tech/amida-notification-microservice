import app from './config/express';
import config from './config/config';
import logger from './config/winston';

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// module.parent check is required to support mocha watch
if (!module.parent) {
    // listen on port config.port
    app.listen(config.port, () => {
        logger.info(`server started on port ${config.port} (${config.env})`, {
            port: config.port,
            node_env: config.env,
        });
    });
}

export default app;
