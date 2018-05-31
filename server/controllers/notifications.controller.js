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

  pushData.forEach((userData) => {
    const { username } = userData;
    const { data } = userData;
    User.findOne({
      where: {username},
      include: [{ model: Device }]
    }).then(receiver => {
      pushNotificationHelper.sendPushNotification(receiver, data);
    })
  });
  res.send({success: true});
}

export default {
    sendPushNotifications
};
