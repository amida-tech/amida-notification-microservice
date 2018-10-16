import db from './config/sequelize';
const User = db.User;
import config from './config/config';
import request from 'request';
import uuidv4 from 'uuid/v4';


const makeRequest = (data, callback) => {
    request.post(data, callback);
};
const getRequest = (data, callback) => {
    request.get(data, callback);
};

module.exports = () => new Promise((resolve, reject) => {
    User.findAll({ where: { uuid: null } }).then((users) => {
        if (users.length > 0) {
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

                    if (!authUsers[0].uuid) {
                        console.log('\n\nERROR: Please migrate auth service to include the uuid column with the following command: `node_modules/.bin/sequelize db:migrate`\n\n');
                        resolve('UUID migration pending on Auth Service');
                        return;
                    }
                    users.forEach((user) => {
                        const authUser = authUsers.find(_authUser => _authUser.username === user.username);
                        if (!authUser) {
                            // user.update({ uuid: uuidv4() }).then(() => resolve('uuids updated'));
                            console.log('User with username ', user.username, ' is missing from auth service');
                        } else {
                            user.update({ uuid: authUser.uuid }).then(() => resolve('uuids updated'));
                        }
                    });
                });
            });
        } else {
            resolve();
        }
    });
});
