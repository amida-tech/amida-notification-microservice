import config from './config/config';
import app from './config/express';
/* eslint-disable no-unused-vars */
import db from './config/sequelize';

/* eslint-enable no-unused-vars */
import logger from './config/winston';
// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

function startServer() {
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
}

db.sequelize
  .sync()
  .then(startServer)
  .catch((err) => {
      if (err) logger.debug(err);
      else logger.debug('Database synchronized');
  });

export default app;
