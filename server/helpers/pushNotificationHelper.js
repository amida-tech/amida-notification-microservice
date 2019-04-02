const config = require('../../config/config.js');
const PushNotifications = require('node-pushnotifications');
const metaDataHelper = require('./metaDataHelper');
const request = require('request');
const prefMap = require('./preferenceMap');
const logger = require('../../config/winston');
const Notification = require('../models/notification.model').Notification;

function sendPushNotification(receiver, data) {
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
        title: 'Message from Orange',
        body: 'Hello',
        topic: config.apnTopic,
    };

    let androidPushData = {
        title: 'Message from Orange',
        body: 'Hello',
        sound: 'default',
        priority: 'high',
        show_in_foreground: true,
    };

    const deliverNotifications = () => {
        iosPushData = { ...iosPushData, ...data, data };
        androidPushData = { ...androidPushData, ...data, data };

        receiver.devices.filter(device => device.status === 'enabled').forEach((device) => {
            if (device.type === 'iOS' && config.apnEnabled) {
                push.send([device.token], iosPushData, (err, result) => {
                    if (err) {
                        logger.error('Push notification error', { err });
                    } else {
                        const message = result[0].message;

                        Notification.create({
                            type: data.notificationType,
                            payload: data,
                            status: message.error == null ? 'success' : 'failure',
                            deviceType: device.type,
                            token: device.token,
                        });
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
                }, (err, fcmRes, fcmResBody) => {
                    if (err) {
                        logger.error('Firebase Error', { err });
                    }

                    let success;
                    try {
                        success = JSON.parse(fcmResBody).success;
                    } catch (e) {
                        logger.debug(`Failed to send push notification because JSON.prase(fcmResBody) failed. fcmResBody is: ${fcmResBody}`);
                        success = 0;
                    }

                    Notification.create({
                        type: data.notificationType,
                        payload: data,
                        status: success === 1 ? 'success' : 'failure',
                        deviceType: device.type,
                        token: device.token,
                    });
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
                // eslint-disable-next-line no-param-reassign
                data.title = displayDetail.title;
                // eslint-disable-next-line no-param-reassign
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
