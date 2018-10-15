const config = require('../../config/config.js');
import AWS from './aws';
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
                    Data: `${data.body}: <a class=\"ulink\" href=\"https://www.amidaorange.com\" target=\"_blank\">Amida Orange</a>.` || '<a class="ulink" href="https://www.amidaorange.com" target="_blank">Amida Orange</a>.',
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: data.subject || 'Message from Orange',
            },
        },
        Source: 'orange@amida-services.com',
    };
    ses.sendEmail(params, (err, data) => {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}

export default {
    sendEmail,
};
