import Joi from 'joi';

export default {
  // POST /message/send
    sendMessage: {
        body: {
            to: Joi.array().items(Joi.string()).required(),
            subject: Joi.string().required(),
            message: Joi.string().required(),
        },
    },
    replyMessage: {
        body: {
            to: Joi.array().items(Joi.string()).required(),
            subject: Joi.string().required(),
            message: Joi.string().required(),
        },
        params: {
            messageId: Joi.number().required(),
        },
    },
};
