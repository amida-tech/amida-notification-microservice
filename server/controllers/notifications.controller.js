import httpStatus from 'http-status';
import db from '../../config/sequelize';
import APIError from '../helpers/APIError';
import pushNotificationHelper from '../helpers/pushNotificationHelper';
import Sequelize from 'sequelize';

const Device = db.Device;
const Notification = db.Notification;
const User = db.User;
const Op = Sequelize.Op;



function sendPushNotifications(req, res, next) {
  const { pushData } = req.body;
  const { users } = [];

  pushData.forEach((userData) => {
      users.push(userData.username);
  });

  User.findAll({
    include: [
      { model: Device, required: true}
    ],
    where: {
      username: {
        [Op.in]: users
      }
    }
  }).then(devciceData => {
    const { users } = [];
    deviceData.forEach((userData) => {
      const { username } = userData.username;
      const { deviceId } = userData.deviceId;

      pushNotificationHelper.sendPushNotification(receiver, data);
    })
  })

  res.send({success: true});
}

export default {
    sendPushNotifications
};
