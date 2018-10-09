import config from './config/config';
import app from './config/express';
/* eslint-disable no-unused-vars */
import db from './config/sequelize';
import logger from './winston';

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

function startServer() {
  // module.parent check is required to support mocha watch
    if (!module.parent) {
    // listen on port config.port
        app.listen(config.port, () => {
            logger.info({
                service: 'notification-service',
                message: 'server started on port',
                port: config.port,
                node_env: config.env
            }
        );
        });
    }
}

db.sequelize
  .sync()
  .then(startServer)
  .catch((err) => {
      if (err) logger.debug('An error occured', err);
      else logger.debug('Database synchronized');
  });

export default app;
