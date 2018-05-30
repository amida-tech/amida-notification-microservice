import express from 'express';

import usersCtrl from '../controllers/users.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .post(usersCtrl.create);

export default router;
