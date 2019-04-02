import db from '../sequelize';
import { User as MongoUser } from '../../server/models/user.model';
import { Notification as MongoNotification } from '../../server/models/notification.model';

const SqlUser = db.User;
const SqlDevice = db.Device;
const SqlNotification = db.Notification;

(async () => {
    const LIMIT = 1000;
    let offset = 0;
    let users = [];
    do {
        users = (await SqlUser.findAll({
            offset,
            limit: LIMIT,
            include: [{
                model: SqlDevice,
            }],
        })).map(user => ({
            uuid: user.uuid,
            username: user.username,
            devices: user.Devices.map(device => ({
                type: device.type,
                token: device.token,
                status: device.disabled ? 'disabled' : 'enabled',
            })),
        }));
        await MongoUser.insertMany(users);
        offset += users.length;
    } while (users.length >= LIMIT);

    offset = 0;
    let notifications = [];
    do {
        notifications = (await SqlNotification.findAll({
            offset,
            limit: LIMIT,
            include: [{
                model: SqlDevice,
            }],
        })).map(notification => ({
            type: notification.type,
            payload: notification.payload,
            status: notification.status,
            deviceType: notification.Device.type,
            token: notification.Device.token,
        }));
        await MongoNotification.insertMany(notifications);
        offset += users.length;
    } while (notifications.length >= LIMIT);
})()
.then(process.exit)
.catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
