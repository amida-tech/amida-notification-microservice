import AWS from './aws';
import logger from '../../config/winston';

const sns = AWS.sns;

function sendSms(receiver, data) {
  // eslint-disable-line no-unused-vars

    const params = {
        Message: data.message, /* required */

        PhoneNumber: data.phone,
        Subject: data.subject,
    };

    sns.publish(params, (err, response) => {
        if (err) {
            logger.error({ message: err.message, service: 'notification-service' });
        }
    });
}

export default {
    sendSms,
};
