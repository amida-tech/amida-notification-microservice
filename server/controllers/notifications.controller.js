/* eslint-disable import/prefer-default-export */
import { User } from '../models/user.model';
import { sendPushNotification } from '../helpers/pushNotificationHelper';

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
