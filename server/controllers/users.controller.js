import httpStatus from 'http-status';
import Promise from 'bluebird';
import db from '../../config/sequelize';
import APIError from '../helpers/APIError';
import Sequelize from 'sequelize';

const User = db.User;
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

export default {
    create,
    sendPushNotification
};
