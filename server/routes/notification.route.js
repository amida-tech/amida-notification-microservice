import express from 'express';

import notificationCtrl from '../controllers/notification.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .post(notificationCtrl.create);

export default router;
