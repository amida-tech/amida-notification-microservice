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

    // let data = {
    //     title: 'My Orange Push Notification', // REQUIRED
    //     body: 'BOOYAH', // REQUIRED
    //     topic: 'com.amida.orangeIgnite', // REQUIRED for apn and gcm for ios
    //     custom: {
    //         sender: 'Orange'
    //     },
    // eslint-disable-next-line max-len
    //     priority: 'high', // gcm, apn. Supported values are 'high' or 'normal' (gcm). Will be translated to 10 and 5 for apn. Defaults to 'high'
    //     contentAvailable: true, // gcm for android
    //     delayWhileIdle: true, // gcm for android
    //     restrictedPackageName: '', // gcm for android
    //     dryRun: false, // gcm for android
    //     icon: '', // gcm for android
    //     tag: '', // gcm for android
    //     color: '', // gcm for android
    //     clickAction: '', // gcm for android. In ios, category will be used if not supplied
    //     locKey: '', // gcm, apn
    //     bodyLocArgs: '', // gcm, apn
    //     retries: 1, // gcm, apn
    //     encoding: '', // apn
    //     badge: 2, // gcm for ios, apn
    //     sound: 'ping.aiff', // gcm, apn
    //     // alert: {}, // apn, will take precedence over title and body
    //     alert: 'My Orange Push Notification', // It is also accepted a text message in alert
    //     titleLocKey: '', // apn and gcm for ios
    //     titleLocArgs: '', // apn and gcm for ios
    //     launchImage: '', // apn and gcm for ios
    //     action: '', // apn and gcm for ios
    //     category: '', // apn and gcm for ios
    //     mdm: '', // apn and gcm for ios
    //     urlArgs: '', // apn and gcm for ios
    //     truncateAtWordEnd: true, // apn and gcm for ios
    //     mutableContent: 0, // apn
    //     threadId: '', // apn
    //     expiry: Math.floor(Date.now() / 1000) + 28 * 86400, // seconds
    // eslint-disable-next-line max-len
    //     timeToLive: 28 * 86400, // if both expiry and timeToLive are given, expiry will take precedency
    //     headers: [], // wns
    //     launch: '', // wns
    //     duration: '', // wns
    //     consolidationKey: 'my notification' // ADM
    // };

    let iosPushData = {
        title: 'Message from Orange',
        body: 'Hello',
        topic: config.apnTopic,
    };

    let androidPushData = {
        title: 'Message from Orange',
        body: 'Hello',
        // 'icon': '@drawable/orange_icon',
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
                        device.createNotification({
                            payload: data,
                            type: data.notificationType,
                            status: message.error == null ? 'success' : 'failure',
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

                    device.createNotification({
                        payload: data,
                        type: data.notificationType,
                        status: success === 1 ? 'success' : 'failure',
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
