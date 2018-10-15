const config = require('../../config/config.js');
import AWS from './aws'
const sns = AWS.sns;

function sendSms(receiver, data) {
  // eslint-disable-line no-unused-vars

    const params = {
        Message: data.message, /* required */

        PhoneNumber: data.phone,
        Subject: data.subject,
    };

    sns.publish(params, (err, data) => {
        if (err) {
            console.log('Error sending a message', err);
        } else {
            console.log('Sent message:', data.MessageId);
        }
    });
}

export default {
    sendSms,
};
