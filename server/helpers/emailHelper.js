import AWS from './aws';
import logger from '../../config/winston';

const ses = AWS.ses;


function sendEmail(receiver, data) {
  // eslint-disable-line no-unused-vars

    const params = {
        Destination: {
            BccAddresses: [],
            CcAddresses: [],
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
        Source: data.source,
    };
    ses.sendEmail(params, (err, response) => {
        if (err) {
            logger.error({ message: err.message, service: 'notification-service' });
        }
    });
}

export default {
    sendEmail,
};
