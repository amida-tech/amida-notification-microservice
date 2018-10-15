import Sequelize from 'sequelize';
import db from '../../config/sequelize';
import pushNotificationHelper from '../helpers/pushNotificationHelper';
import smsHelper from '../helpers/smsHelper';
import emailHelper from '../helpers/emailHelper';

const Device = db.Device;
const User = db.User;
const Op = Sequelize.Op;

function send(req, res, next, protocol) {

    const { data } = req.body;

    const usernames = data.map(_data => _data.username);

  // Find all users specified above, left join on device table
    User.findAll({
        include: [Device],
        where: {
            username: {
                [Op.in]: usernames,
            },
        },
    }).then((users) => {
        if (!users.length > 0) {
          res.status(404);
          res.send({error: "Users Not Found"});
          return
        }
        users.forEach((user) => {
            if (!user) return;
            const userData = data.find(_userData => _userData.username === user.username);
            switch (protocol) {
            case 'push':
                pushNotificationHelper.sendPushNotification(user, userData);
                break;
            case 'email':
                emailHelper.sendEmail(user, userData);
                break;
            case 'sms':
                smsHelper.sendSms(user, userData);
                break;
            default:
            }
        });
        res.send({ success: true });
    }).catch((err) => {
      res.send({error: err})
    });
}

function sendPushNotifications(req, res, next) { // eslint-disable-line no-unused-vars
    req.body.data = req.body.pushData;
    send(req, res, next, 'push');
}

function sendEmail(req, res, next) { // eslint-disable-line no-unused-vars
    send(req, res, next, 'email');
}

function sendSms(req, res, next) { // eslint-disable-line no-unused-vars
    send(req, res, next, 'sms');
}

export default {
    sendPushNotifications,
    sendEmail,
    sendSms,
};
