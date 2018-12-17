import Sequelize from 'sequelize';
import db from '../../config/sequelize';
import pushNotificationHelper from '../helpers/pushNotificationHelper';

const Device = db.Device;
const User = db.User;
const Op = Sequelize.Op;


function sendPushNotifications(req, res, next) { // eslint-disable-line no-unused-vars
    const { pushData } = req.body;

    const usernames = pushData.map(data => data.username);

    // Find all users specified above, left join on device table
    User.findAll({
        include: [Device],
        where: {
            username: {
                [Op.in]: usernames,
            },
        },
    }).then((users) => {
        if (!users) return;
        users.forEach((user) => {
            if (!user) return;
            const userData = pushData.find(_userData => _userData.username === user.username);
            pushNotificationHelper.sendPushNotification(user, userData);
        });
        res.send({ success: true });
    });
}

export default {
    sendPushNotifications,
};
