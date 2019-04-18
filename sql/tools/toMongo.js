import db from '../sequelize';
import logger from '../../config/winston';
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
                paranoid: false,
            }],
        })).map(user => ({
            uuid: user.uuid,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            devices: user.Devices.filter((device) => {
                const doMigrate = device.token;
                if (!doMigrate) {
                    logger.warn(`Not migrating device ${device.id} because it doesn't have a token`);
                }
                return doMigrate;
            }).map(device => ({
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
        notifications = await (await SqlNotification.findAll({
            offset,
            limit: LIMIT,
            include: [{
                model: SqlDevice,
                paranoid: false,
            }],
        })).filter((notification) => {
            const doMigrate = notification.Device.token;
            if (!doMigrate) {
                logger.warn(`Not migrating notification ${notification.id} because the device it was "sent" to doesn't have a token`);
            }
            return doMigrate;
        }).reduce(async (result, notification) => {
            const postgresUser = await SqlUser.findByPk(notification.Device.UserId);
            if (!postgresUser) {
                logger.warn(`Not migrating notification ${notification.id} because we couldn't find the original user it was tied to in postgres`);
                return await result;
            }
            const mongoUser = await MongoUser.findOne({ uuid: postgresUser.uuid });
            if (!mongoUser) {
                logger.warn(`Not migrating notification ${notification.id} because we couldn't find the new user it should be tied to in mongo`);
                return await result;
            }
            return (await result).concat([{
                type: notification.type,
                payload: notification.payload,
                status: notification.status,
                deviceType: notification.Device.type,
                token: notification.Device.token,
                // eslint-disable-next-line no-underscore-dangle
                userId: mongoUser._id,
                createdAt: notification.createdAt,
                updatedAt: notification.updatedAt,
            }]);
        }, Promise.resolve([]));
        await MongoNotification.insertMany(notifications);
        offset += users.length;
    } while (notifications.length >= LIMIT);
})()
.then(process.exit)
.catch((err) => {
    logger.error(err);
    process.exit(1);
});
