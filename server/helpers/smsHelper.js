import AWS from './aws';
import logger from '../../config/winston';
import db from '../../config/sequelize';

const sns = AWS.sns;
const Notification = db.Notification;

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
                Notification.create({
                    payload: data,
                    type: data.notificationType,
                    protocol: 'sms',
                    status: 'success',
                }).then(() => resolve()).catch(notificationCreateError => reject(notificationCreateError));
            }
        });
    });
}

export default {
    sendSms,
};
