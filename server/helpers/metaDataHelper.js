const config = require('../../config/config.js');
const Client = require('node-rest-client').Client;

const client = new Client();

function getPushPreferences(receiver, namespace) {  // eslint-disable-line no-unused-vars
    const authArgs = {
        headers: { 'Content-Type': 'application/json' },
        data: {
            username: config.pushNotificationsServiceUserUsername,
            password: config.pushNotificationsServiceUserPassword,
        },
    };

    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
        client.post(`${config.authServiceAPI}/auth/login`, authArgs, (data, res) => { // eslint-disable-line no-unused-vars
            const { token } = data;
            const pushNotificationArgs = {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            };
            client.get(`${config.metaDataServiceAPI}/get/${receiver.uuid}/${namespace}/Notifications`, pushNotificationArgs, (body, res1) => { // eslint-disable-line no-unused-vars
                resolve(body);
            });
        });
    });
}

export default {
    getPushPreferences,
};
