import config from './config/config';

const path = require('path');

const request = require('request');

const params = {
    headers: { 'Content-Type': 'application/json' },
    uri: `${config.authMicroserviceUrl}/user`,
    method: 'POST',
    body: JSON.stringify({
        email: 'push_notifications_service_user@amida.com',
        username: config.pushNotificationsServiceUserUsername,
        password: config.pushNotificationsServiceUserPassword,
        scopes: ['admin'],
    }),
};

const main = function () {
    request(params, (err, res, body) => {
        if (err) {
            console.error(`${path.basename(__filename)}: Error creating push notifications service user:`);
            console.error(err);
            process.exit(1);
        }
        const parsedBody = JSON.parse(body);
        if (parsedBody.status === 'ERROR' && JSON.parse(parsedBody.message)[0].type === 'unique violation') {
            // eslint-disable-next-line no-console
            console.log(`User "${config.pushNotificationsServiceUserUsername}" or Email push_notifications_service_user@amida.com Already Exists`);
            process.exit(0);
        } else if (parsedBody.status === 'ERROR') {
            // eslint-disable-next-line no-console
            console.log('User Creation Failed');
            process.exit(1);
        } else {
            // eslint-disable-next-line no-console
            console.log(`User Creation For User "${config.pushNotificationsServiceUserUsername}" Succeded`);
            process.exit(0);
        }
    });
};

main();
