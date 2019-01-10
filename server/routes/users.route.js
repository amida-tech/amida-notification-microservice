import express from 'express';

import usersCtrl from '../controllers/users.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .post(usersCtrl.create);
router.route('/sendPushNotification')
    .post(usersCtrl.sendPushNotification);
router.route('/updateDevice')
    .post(usersCtrl.updateDevice);
router.route('/revoke-device')
    .post(usersCtrl.revokeDevice);

export default router;
