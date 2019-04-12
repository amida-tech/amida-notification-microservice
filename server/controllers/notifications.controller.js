/* eslint-disable import/prefer-default-export */
import httpStatus from 'http-status';
import { User } from '../models/user.model';
import { sendPushNotification } from '../helpers/pushNotificationHelper';
import APIError from '../helpers/APIError';
import passErrors from '../helpers/passErrors';

export const sendPushNotifications = passErrors(async (req, res) => {
    const { pushData } = req.body;

    const usernames = pushData.map(data => data.username);

    const users = await User.find({
        username: {
            $in: usernames,
        },
    });

    // TODO how are we doing errors?
    if (!users) {
        throw new APIError('USERS_NOT_FOUND', httpStatus.BAD_REQUEST, true);
    }

    users.forEach((user) => {
        const userData = pushData.find(_userData => _userData.username === user.username);
        sendPushNotification(user, userData);
    });

    res.send({ success: true });
});
