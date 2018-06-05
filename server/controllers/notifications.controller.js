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
  var users = [];

  //Get all users to search for in database
  pushData.forEach((userData) => {
      users.push(userData.username);
  });

  //Find all users specified above, left join on device table
  User.findAll({
    include: [
      { model: Device }
    ],
    where: {
      username: {
        [Op.in]: users
      }
    }
  }).then(deviceData => {
    if (!deviceData) return

    //Iteratve over all
    deviceData.forEach((userData) => {
      const { deviceId } = deviceData.deviceId;
      const { data } = deviceData;
      if(deviceId)
        pushNotificationHelper.sendPushNotification(deviceId, data);
    })
  })
  res.send({success: true});
}

export default {
    sendPushNotifications
};
