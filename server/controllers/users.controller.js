import db from '../../config/sequelize';

const User = db.User;
const Device = db.Device;

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
        Device.findOrCreate({
            where: {
                token,
                type: deviceType,
                UserId: deviceUser.id,
            },
        })
        .spread((device, created) => {
            res.send({
                success: `Device ${created ? 'created' : 'updated'}`,
                device,
            });
        });
    });
}

export default {
    create,
    sendPushNotification,
    updateDevice,
};
