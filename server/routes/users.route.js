import express from 'express';

import { create, updateDevice, revokeDevice } from '../controllers/users.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .post(create);
router.route('/updateDevice')
    .post(updateDevice);
router.route('/revoke-device')
    .delete(revokeDevice);

export default router;
