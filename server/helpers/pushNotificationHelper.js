const config = require('../../config/config.js');
const PushNotifications = require('node-pushnotifications');
const metaDataHelper = require('./metaDataHelper');
const request = require('request');
const prefMap = require('./preferenceMap');

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
                        console.log('showing push error', err);
                    } else {
                        const message = result[0].message;
                        console.log('showing push result message', message[0]);
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
                    console.log('Showing Firebase Error', err);
                    console.log('Showing Firebase Response', res1.statusCode);
                    console.log('Showing Firebase Body', body1);
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
            const attribute = metadata.attributes.find(_attribute => _attribute.attribute === data.notificationType);

            const value = attribute.values.find(_value => _value.type === 'preview_type');

            const previewType = value.value;

            if (previewType === 'basic' || previewType === 'preview') {
                data.title = prefMap[data.namespace][data.notificationType][previewType].title;
                data.body = prefMap[data.namespace][data.notificationType][previewType].body;
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
