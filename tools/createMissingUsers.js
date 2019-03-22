// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from 'node-fetch';
import config from '../config/config';
import { User } from '../server/models/user.model';

(async () => {
    const loginResponse = await fetch(`${config.authServiceAPI}/auth/login`, {
        method: 'post',
        body: JSON.stringify({
            username: config.pushNotificationsServiceUserUsername,
            password: config.pushNotificationsServiceUserPassword,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (loginResponse.status !== 200 && loginResponse.status !== 201) {
        throw Error('Could Not Authenticate as Admin Push Notification Service User');
    }
    const adminToken = (await loginResponse.json()).token;

    // get all users currently on authservice and save uuids for those
    // on notification service
    const usersResponse = await fetch(`${config.authServiceAPI}/user`, {
        method: 'get',
        headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
        },
    });
    if (usersResponse.status !== 200 && usersResponse.status !== 201) {
        throw Error((await usersResponse.json()).message);
    }
    const authUsers = await usersResponse.json();
    const createUserPromises = authUsers.map(user => User.findOneAndUpdate(
        { username: user.username },
        { username: user.username, uuid: user.uuid },
        { new: true, upsert: true }
    ));
    await Promise.all(createUserPromises);
})()
.then(process.exit)
.catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
