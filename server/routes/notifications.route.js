import express from 'express';

import notificationsCtrl from '../controllers/notifications.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/sendPushNotifications')
    .post(notificationsCtrl.sendPushNotifications);

export default router;
