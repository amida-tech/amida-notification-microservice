import express from 'express';

import { sendPushNotifications } from '../controllers/notifications.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/sendPushNotifications')
    .post(sendPushNotifications);

export default router;
