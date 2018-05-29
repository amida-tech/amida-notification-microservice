import express from 'express';

// import messageRoutes from './message.route';
import articleRoutes from './article.route';
// import threadsRoutes from './threads.route';
import p from '../../package';

const router = express.Router(); // eslint-disable-line new-cap
const version = p.version.split('.').shift();
const baseURL = (version > 0 ? `/v${version}` : '');

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount message routes at /message
// router.use(`${baseURL}/message`, messageRoutes);
router.use(`${baseURL}/article`, articleRoutes);
// router.use(`${baseURL}/threads`, threadsRoutes);

export default router;
