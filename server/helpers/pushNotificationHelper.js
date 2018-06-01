"use strict";

const config  = require("../../config/config.js");
const PushNotifications = require("node-pushnotifications");
const request = require("request");

function sendPushNotification(receiver, data, req, res) {

    const settings = {
        gcm: {
            id: null
        },
        apn: {
            token: {
                key: "/app/iosKey.p8", // optionally: fs.readFileSync("./certs/key.p8")
                keyId: config.iosKeyId,
                teamId: config.teamId
            },
            production: config.apnENV === "production"
        },
        adm: {
            client_id: null,
            client_secret: null
        },
        wns: {
            client_id: null,
            client_secret: null,
            notificationMethod: "sendTileSquareBlock"
        }
    };

    const push = new PushNotifications(settings);

    // let data = {
    //     title: "My Orange Push Notification", // REQUIRED
    //     body: "BOOYAH", // REQUIRED
    //     topic: "com.amida.orangeIgnite", // REQUIRED for apn and gcm for ios
    //     custom: {
    //         sender: "Orange"
    //     },
    //     priority: "high", // gcm, apn. Supported values are "high" or "normal" (gcm). Will be translated to 10 and 5 for apn. Defaults to "high"
    //     collapseKey: "", // gcm for android, used as collapseId in apn
    //     contentAvailable: true, // gcm for android
    //     delayWhileIdle: true, // gcm for android
    //     restrictedPackageName: "", // gcm for android
    //     dryRun: false, // gcm for android
    //     icon: "", // gcm for android
    //     tag: "", // gcm for android
    //     color: "", // gcm for android
    //     clickAction: "", // gcm for android. In ios, category will be used if not supplied
    //     locKey: "", // gcm, apn
    //     bodyLocArgs: "", // gcm, apn
    //     retries: 1, // gcm, apn
    //     encoding: "", // apn
    //     badge: 2, // gcm for ios, apn
    //     sound: "ping.aiff", // gcm, apn
    //     // alert: {}, // apn, will take precedence over title and body
    //     alert: "My Orange Push Notification", // It is also accepted a text message in alert
    //     titleLocKey: "", // apn and gcm for ios
    //     titleLocArgs: "", // apn and gcm for ios
    //     launchImage: "", // apn and gcm for ios
    //     action: "", // apn and gcm for ios
    //     category: "", // apn and gcm for ios
    //     mdm: "", // apn and gcm for ios
    //     urlArgs: "", // apn and gcm for ios
    //     truncateAtWordEnd: true, // apn and gcm for ios
    //     mutableContent: 0, // apn
    //     threadId: "", // apn
    //     expiry: Math.floor(Date.now() / 1000) + 28 * 86400, // seconds
    //     timeToLive: 28 * 86400, // if both expiry and timeToLive are given, expiry will take precedency
    //     headers: [], // wns
    //     launch: "", // wns
    //     duration: "", // wns
    //     consolidationKey: "my notification" // ADM
    // };

    let iosPushData = {
      title: "Message from Orange",
      body: "Hello",
      topic: config.pushTopic
    };

    let androidPushData = {
        "title": "Message from Orange",
        "body": "Hello",
        // "icon": "@drawable/orange_icon",
        "sound": "default",
        "priority": "high",
        "show_in_foreground": true
    };

    iosPushData = Object.assign(iosPushData, data);
    androidPushData = Object.assign(androidPushData, data);

      receiver.Devices.forEach((device) => {
        if (device.type === 'iOS') {
          push.send([device.token], iosPushData, (err, result) => {
              if (err) {
                console.log("showing push error", err);
              } else {
                const message = result[0].message;
                  console.log("showing push result message", message[0]);
              }
          });
        }

        if (device.type === 'Android') {
          let body = {
            "to": device.token,
            "notification": androidPushData,
            "priority": 10
          };
          body = JSON.stringify(body);
          request({
            headers: {
               "Content-Type": "application/json",
               "Authorization": "key=" + config.firebaseServerKey
            },
            uri: config.firebaseAPIUrl,
            body,
            method: "POST"
          }, function (err, res, body) {
            console.log(err);
          });
        }
      });
};

export default {
  sendPushNotification
}
