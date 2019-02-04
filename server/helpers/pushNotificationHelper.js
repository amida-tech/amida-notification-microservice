const config = require('../../config/config.js');
const PushNotifications = require('node-pushnotifications');
const metaDataHelper = require('./metaDataHelper');
const request = require('request');
const prefMap = require('./preferenceMap');
const logger = require('../../config/winston');

function sendPushNotification(receiver, data, req, res) {  // eslint-disable-line no-unused-vars
    const settings = {
        gcm: {
            id: null,
        },
        apn: {
            token: {
                key: '/app/iosKey.p8', // optionally: fs.readFileSync('./certs/key.p8')
                keyId: config.apnKeyId,
                teamId: config.apnTeamId,
            },
            production: config.apnEnv === 'production',
        },
        adm: {
            client_id: null,
            client_secret: null,
        },
        wns: {
            client_id: null,
            client_secret: null,
            notificationMethod: 'sendTileSquareBlock',
        },
    };

    const push = new PushNotifications(settings);

    let iosPushData = {
        topic: config.apnTopic,
    };

    let androidPushData = {
        sound: 'default',
        priority: 'high',
        show_in_foreground: true,
    };

    const deliverNotifications = () => {
        iosPushData = { ...iosPushData, ...data, data };
        androidPushData = { ...androidPushData, ...data, data };

        receiver.Devices.forEach((device) => {
            if (device.type === 'iOS' && config.apnEnabled) {
                push.send([device.token], iosPushData, (err, result) => {
                    if (err) {
                        logger.error('Push notification error', { err });
                    } else {
                        const message = result[0].message;

                        // TODO JCB: ask Elijah if we can remove these
                        // console.log('showing push result message', message[0]);
                        if (message.error == null) {
                            device.createNotification({
                                payload: data,
                                type: data.notificationType,
                                status: 'success',
                            });
                        }
                    }
                });
            }

            if (device.type === 'Android') {
                let body = {
                    to: device.token,
                    notification: androidPushData,
                    priority: 10,
                };
                body = JSON.stringify(body);
                request({
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `key=${config.fcmServerKey}`,
                    },
                    uri: config.fcmApiUrl,
                    body,
                    method: 'POST',
                }, (err, res1, body1) => {
                    logger.error('Firebase Error', { err });

                    // TODO JCB: ask Elijah if we can remove these
                    // console.log('Showing Firebase Response', res1.statusCode);
                    // console.log('Showing Firebase Body', body1);
                    const { success } = body1;
                    if (success === 1) {
                        device.createNotification({
                            payload: data,
                            type: data.notificationType,
                            status: 'success',
                        });
                    }
                });
            }
        });
    };

    if (config.metaDataServiceEnabled) {
        metaDataHelper.getPushPreferences(receiver, data.namespace).then((metadata) => {
            const attribute = metadata.attributes
                .find(_attribute => _attribute.attribute === data.notificationType);

            const value = attribute.values.find(_value => _value.type === 'preview_type');

            const previewType = value.value;

            if (previewType === 'basic' || previewType === 'preview') {
                const displayDetail = prefMap[data.namespace][data.notificationType][previewType];
                data.title = displayDetail.title;
                data.body = displayDetail.body;
            }

            deliverNotifications();
        });
    } else {
        deliverNotifications();
    }
}

export default {
    sendPushNotification,
};
