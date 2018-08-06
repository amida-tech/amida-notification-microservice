import httpStatus from 'http-status';
import Promise from 'bluebird';
import db from '../../config/sequelize';
import APIError from '../helpers/APIError';
import Sequelize from 'sequelize';

const User = db.User;
const Device = db.Device;
const Op = Sequelize.Op;

/**
 * Start a new thread
 * @property {string} req.body.username - Body of the message
 * @returns {User}
 */
function create(req, res, next) {
    const { username } = req.body;
    User.findOrCreate({where: {username}})
    .spread((user, created) => {
      res.send({user})
    });
}

function sendPushNotification(req, res, next) {
    res.send(req.body);
}

function updateDevice(req, res, next) {
  const { username, token, deviceType } = req.body;
  User.findOne({where: {username}}).then(deviceUser => {
    Device.findOrCreate({
      where: {
        token,
        type: deviceType,
        UserId: deviceUser.id
      }
    })
    .spread((device, created) => {
      res.send({
        success: `Device ${created ?  "created" : "updated"}`,
        device
      });
    });
  });
}

export default {
    create,
    sendPushNotification,
    updateDevice
};
