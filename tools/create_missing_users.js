import db from '../config/sequelize';
const User = db.User;
import config from '../config/config';
import request from 'request';
import uuidv4 from 'uuid/v4';


const makeRequest = (data, callback) => {
    request.post(data, callback);
};
const getRequest = (data, callback) => {
    request.get(data, callback);
};

const createUsers = () => new Promise((resolve, reject) => {
        makeRequest({
            url: `${config.authServiceAPI}/auth/login`,
            body: {
                username: config.pushNotificationsServiceUserUsername,
                password: config.pushNotificationsServiceUserPassword,
            },
            json: true,
            headers: {
                'Content-Type': 'application/json',
            },
        }, (err, httpResponse) => {
            if (err) {
                throw err;
            } else if (httpResponse.statusCode !== 200 && httpResponse.statusCode !== 201) {
                throw Error('Could Not Authenticate as Admin');
            }

            const adminToken = httpResponse.body.token;
          // get all users currently on authservice and save uuids for those
          // on notification service
            getRequest({
                url: `${config.authServiceAPI}/user`,
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                    'Content-Type': 'application/json',
                },
                json: true,
            }, (err, httpResponse) => {
                if (err) {
                    throw err;
                } else if (httpResponse.statusCode !== 200 && httpResponse.statusCode !== 201) {
                    throw Error(httpResponse.body.message);
                }
                const authUsers = httpResponse.body;


                const createUserPromises = [];
                authUsers.forEach((authUser) => {
                    const { username, uuid } = authUser;
                    createUserPromises.push(User.findOrCreate({ where: { username }, defaults: { uuid } }));
                });
                Promise.all(createUserPromises).then(() => resolve());
            });
        });
});

createUsers().then(() => {process.exit(0)}).catch(err => process.exit(1));
