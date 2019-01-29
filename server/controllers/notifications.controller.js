import Sequelize from 'sequelize';
import db from '../../config/sequelize';
import pushNotificationHelper from '../helpers/pushNotificationHelper';
import smsHelper from '../helpers/smsHelper';
import emailHelper from '../helpers/emailHelper';
import logger from '../../config/winston';

const Device = db.Device;
const User = db.User;
const Op = Sequelize.Op;

function send(req, res) {
    const { data, protocol } = req.body;

    if (data == null) {
        res.status(404);
        res.send({ error: 'Request should include data attribute' });
        return;
    } else if (protocol == null) {
        res.status(404);
        res.send({ error: 'Request should include protocol attribute' });
        return;
    } else if (!Array.isArray(data)) {
        res.status(404);
        res.send({ error: 'Data attribute must be an array' });
        return;
    }

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
            res.send({ error: 'Users Not Found' });
            return;
        }
        const errors = [];
        users.forEach((user) => {
            let notificationError;
            if (!user) return;
            const userData = data.find(_userData => _userData.username === user.username);
            switch (protocol) {
            case 'push':
                if (!userData.title || !userData.body) {
                    notificationError = `Notification data for ${user.username} should contain a title and body`;
                    errors.push(notificationError);
                    logger.error({
                        service: 'notification-service',
                        message: notificationError,
                    });
                } else {
                    pushNotificationHelper.sendPushNotification(user, userData);
                }
                break;
            case 'email':
                if (!userData.email || !userData.body || !userData.subject || !userData.source) {
                    notificationError = `Email message for ${user.username} should contain source, email, body and subject fields`;
                    errors.push(notificationError);
                    logger.error({
                        service: 'notification-service',
                        message: notificationError,
                    });
                } else {
                    emailHelper.sendEmail(user, userData);
                }
                break;
            case 'sms':
                if (!userData.phone || !userData.message || !userData.subject) {
                    notificationError = `SMS message for ${user.username} should contain phone, message and subject fields`;
                    errors.push(notificationError);
                    logger.error({
                        service: 'notification-service',
                        message: notificationError,
                    });
                } else {
                    smsHelper.sendSms(user, userData);
                }
                break;
            default:
            }
        });
        if (errors.length) {
            res.send({ message: 'One or more notifications could not be processed', errors });
        } else {
            res.send({ success: true });
        }
    }).catch((err) => {
        logger.error({ ...err, service: 'notification-service' });
        res.status(500);
        res.send({ error: err });
    });
}

export default {
    send,
};
