import AWS from './aws';
import logger from '../../config/winston';
import config from '../../config/config.js';

const ses = AWS.ses;


function sendEmail(receiver, data) {
  // eslint-disable-line no-unused-vars
    return new Promise((resolve, reject) => {
        const params = {
            Destination: {
                BccAddresses: data.cccAddresses || [],
                CcAddresses: data.ccAddresses || [],
                ToAddresses: [data.email],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: `${data.body}`,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: data.subject,
                },
            },
            Source: config.sesEmailSource,
        };
        ses.sendEmail(params, (err, response) => {
            if (err) {
                logger.error({ message: err.message, service: 'notification-service' });
                reject(err);
            } else {
                logger.info({
                    message: `Email sent successfully with MessageId: ${response.MessageId}`,
                    service: 'notification-service',
                });
                resolve();
            }
        });
    });
}

export default {
    sendEmail,
};
