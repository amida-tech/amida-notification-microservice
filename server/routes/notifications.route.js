import express from 'express';

import notificationsCtrl from '../controllers/notifications.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/sendPushNotifications')
    .post(notificationsCtrl.sendPushNotifications);

router.route('/sendEmail')
    .post(notificationsCtrl.sendEmail);

router.route('/sendSms')
    .post(notificationsCtrl.sendSms);

export default router;
