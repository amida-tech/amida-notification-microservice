import express from 'express';

import passErrors from '../helpers/passErrors';
import { create, updateDevice, revokeDevice } from '../controllers/users.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .post(passErrors(create));
router.route('/updateDevice')
    .post(passErrors(updateDevice));
router.route('/revoke-device')
    .delete(passErrors(revokeDevice));

export default router;
