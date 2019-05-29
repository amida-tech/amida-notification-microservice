import express from 'express';
import validate from 'express-validation';

import { create, updateDevice, revokeDevice } from '../controllers/users.controller';
import { updateDevice as updateDeviceValidationSpec } from '../../config/param-validation';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .post(create);
router.route('/updateDevice')
    .post(validate(updateDeviceValidationSpec), updateDevice);
router.route('/revoke-device')
    .delete(revokeDevice);

export default router;
