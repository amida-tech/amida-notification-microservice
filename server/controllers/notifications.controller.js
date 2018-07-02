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

  const usernames = pushData.map(data => data.username);

  //Find all users specified above, left join on device table
  User.findAll({
    include: [ Device ],
    where: {
      username: {
        [Op.in]: usernames
      }
    }
  }).then(users => {
    if (!users) return
    users.forEach((user) => {
      if(!user) return
        const userData = pushData.find((userData) =>{
          return userData.username === user.username
        });
        pushNotificationHelper.sendPushNotification(user, userData);
    })
    res.send({success: true});
  })
}

export default {
    sendPushNotifications
};
