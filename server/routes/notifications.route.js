import express from 'express';

import notificationsCtrl from '../controllers/notifications.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/send')
    .post(notificationsCtrl.send);


export default router;
