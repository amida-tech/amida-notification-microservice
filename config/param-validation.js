import Joi from 'joi';

export default {
    updateDevice: {
        body: {
            username: Joi.string().required(),
            token: Joi.string().required(),
            deviceType: Joi.string().required(),
        },
    },
};
