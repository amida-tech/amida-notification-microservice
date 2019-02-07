import Sequelize from 'sequelize';
import db from '../../config/sequelize';

const User = db.User;
const Device = db.Device;
const Op = Sequelize.Op;

/**
 * Start a new thread
 * @property {string} req.body.username - Body of the message
 * @returns {User}
 */
function create(req, res, next) { // eslint-disable-line no-unused-vars
    const { username, uuid } = req.body;
    User.findOrCreate({ where: { username, uuid } })
    .spread((user, created) => { // eslint-disable-line no-unused-vars
        res.send({ user });
    });
}

function sendPushNotification(req, res, next) {  // eslint-disable-line no-unused-vars
    res.send(req.body);
}

function updateDevice(req, res, next) {  // eslint-disable-line no-unused-vars
    const { username, token, deviceType } = req.body;
    User.findOne({ where: { username } }).then((deviceUser) => {
        Device.destroy({
            where: {
                token,
                type: deviceType,
                UserId: {
                    [Op.ne]: deviceUser.id,
                },
            },
        }).then(() => {
            Device.upsert({
                token,
                type: deviceType,
                UserId: deviceUser.id,
                disabled: null,
            }, {
                where: {
                    token,
                    type: deviceType,
                    UserId: deviceUser.id,
                },
                paranoid: false,
            })
            .then((created) => {
                res.send({
                    message: `Device ${created ? 'created' : 'updated'}`,
                });
            });
        });
    });
}

function revokeDevice(req, res, next) {  // eslint-disable-line no-unused-vars
    const { username, token, deviceType } = req.body;
    User.findOne({ where: { username } }).then((deviceUser) => {
        Device.destroy({
            where: {
                token,
                type: deviceType,
                UserId: deviceUser.id,
            },
        }).then(() => {
            res.send({
                success: 'Device Revoked!',
            });
        });
    });
}

export default {
    create,
    sendPushNotification,
    updateDevice,
    revokeDevice,
};
