import express from 'express';
import httpStatus from 'http-status';
import passport from 'passport';
import config from '../../config/config';
import APIError from '../helpers/APIError';

import notificationsRoutes from './notifications.route';
import usersRoutes from './users.route';
import p from '../../package';

const router = express.Router(); // eslint-disable-line new-cap
const version = p.version.split('.').shift();
const baseURL = (version > 0 ? `/v${version}` : '');

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use(passport.authenticate('jwt', { session: false }));

var authorize = function (req, res, next) {
  if (req.user.username !== config.pushNotificationsServiceUserUsername) {
    const err = new APIError('Unauthorized User!', httpStatus.NOT_FOUND, true);
    return next(err);
  }
  next();
}

router.use(authorize);


router.use(`${baseURL}/notifications`, notificationsRoutes);
router.use(`${baseURL}/users`, usersRoutes);

export default router;
