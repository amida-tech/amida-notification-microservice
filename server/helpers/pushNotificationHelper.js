const config = require('../../config/config.js');
const PushNotifications = require('node-pushnotifications');
const metaDataHelper = require('./metaDataHelper');
const request = require('request');
const prefMap = require('./preferenceMap');
const logger = require('../../config/winston');

function sendPushNotification(receiver, data, req, res) {  // eslint-disable-line no-unused-vars
    return new Promise((resolve, reject) => {
        const settings = {
            gcm: {
                id: null,
            },
            apn: {
                token: {
                    key: config.apnKeyPath,
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
            const deviceNotificationPromises = [];
            receiver.Devices.forEach((device) => {
                if (device.type === 'iOS' && config.apnEnabled) {
                    push.send([device.token], iosPushData, (err, result) => {
                        if (err) {
                            logger.error('Push notification error', { err });
                            deviceNotificationPromises.push(Promise.reject(err));
                        } else {
                            const message = result[0].message;

                            // TODO JCB: ask Elijah if we can remove these
                            // console.log('showing push result message', message[0]);
                            device.createNotification({
                                payload: data,
                                type: data.notificationType,
                                status: message.error == null ? 'success' : 'failure',
                            }).then(deviceNotificationPromises.push(Promise.resolve()));
                        }
                    });
                } else {
                    deviceNotificationPromises.push(Promise.resolve());
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
                        if (err) {
                            logger.error('Firebase Error', { err });
                            deviceNotificationPromises.push(Promise.reject(err));
                        }

                        // TODO JCB: ask Elijah if we can remove these
                        // console.log('Showing Firebase Response', res1.statusCode);
                        // console.log('Showing Firebase Body', body1);
                        let success;
                        try {
                            success = JSON.parse(body1).success;
                        } catch (e) {
                            success = 0;
                        }

                        device.createNotification({
                            payload: data,
                            type: data.notificationType,
                            status: success === 1 ? 'success' : 'failure',
                        }).then(deviceNotificationPromises.push(Promise.resolve()));
                    });
                }
            });
            Promise.all(deviceNotificationPromises)
            .then(() => resolve())
            .catch(err => reject(err));
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
    });
}

export default {
    sendPushNotification,
};
