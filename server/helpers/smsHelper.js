import AWS from './aws';
import logger from '../../config/winston';

const sns = AWS.sns;

function sendSms(receiver, data) {
  // eslint-disable-line no-unused-vars
    return new Promise((resolve, reject) => {
        const params = {
            Message: data.message, /* required */

            PhoneNumber: data.phone,
            Subject: data.subject,
        };

        sns.publish(params, (err, response) => {
            if (err) {
                logger.error({ message: err.message, service: 'notification-service' });
                reject(err);
            } else {
                logger.info({
                    message: `SMS sent successfully with MessageId: ${response.MessageId}`,
                    service: 'notification-service',
                });
                resolve();
            }
        });
    });
}

export default {
    sendSms,
};
