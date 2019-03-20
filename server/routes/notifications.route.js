import express from 'express';

import passErrors from '../helpers/passErrors';
import { sendPushNotifications } from '../controllers/notifications.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/sendPushNotifications')
    .post(passErrors(sendPushNotifications));

export default router;
