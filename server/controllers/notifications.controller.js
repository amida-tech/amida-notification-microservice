/* eslint-disable import/prefer-default-export */
import mongoose from 'mongoose';
import { userModelName } from '../models/user.model';
import { sendPushNotification } from '../helpers/pushNotificationHelper';

const User = mongoose.model(userModelName);

export async function sendPushNotifications(req, res) {
    const { pushData } = req.body;

    const usernames = pushData.map(data => data.username);

    const users = await User.find({
        username: {
            $in: usernames,
        },
    });
    // TODO how are we doing errors?
    if (!users) throw new Error('USERS_NOT_FOUND');
    users.forEach((user) => {
        const userData = pushData.find(_userData => _userData.username === user.username);
        sendPushNotification(user, userData);
    });

    res.send({ success: true });
}
