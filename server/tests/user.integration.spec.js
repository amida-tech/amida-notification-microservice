/* eslint-env mocha */
/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import chaiDatetime from 'chai-datetime';
import chaiDateString from 'chai-date-string';
import { setTimeout } from 'timers';
import uuid from 'uuid/v1';

import { app, auth, baseURL } from './common.integration.js';
import { User } from '../../server/models/user.model';

chai.use(chaiDatetime);
chai.use(chaiDateString);

const userA = {
    username: 'a@example.com',
    uuid: uuid(),
};

const userB = {
    username: 'b@example.com',
    uuid: uuid(),
};

const userADeviceA = {
    username: userA.username,
    token: '4b569d24',
    deviceType: 'iOS',
};

const userADeviceB = {
    username: userA.username,
    token: 'abcdefg',
    deviceType: 'Android',
};

const testPushData = {
    pushData: [{
        username: userA.username,
        notificationType: 'New Message',
        data: {
            title: 'New Message',
            body: 'This is a test Push Notification',
        },
    }],
};

describe('Notifications API:', () => {
    // run health check to ensure sync runs
    before((done) => {
        request(app)
            .get('/api/health-check')
            .expect(httpStatus.OK)
            .then(setTimeout(done, 1000));
    });

    describe('Require authorization', () => {
        it('Should fail without Authorization header', () => request(app)
            .post(`${baseURL}/users`)
            .send(userA)
            .expect(httpStatus.UNAUTHORIZED)
        );

        it('Should fail with badtoken in Authorization header', () => request(app)
            .post(`${baseURL}/users`)
            .set('Authorization', 'Bearer badtoken')
            .send(userA)
            .expect(httpStatus.UNAUTHORIZED)
        );
    });

    describe('Create User and Update Device Token', () => {
        it('should create and respond with a user', () => request(app)
            .post(`${baseURL}/users`)
            .set('Authorization', `Bearer ${auth}`)
            .send(userA)
            .expect(httpStatus.OK)
            // eslint-disable-next-line no-underscore-dangle
            .then(res => User.findById(res.body.user._id))
            .then((user) => {
                // eslint-disable-next-line no-unused-expressions
                expect(user).to.not.be.null;
                expect(user.username).to.equal(userA.username);
                expect(user.uuid).to.equal(userA.uuid);
            })
        );

        it('should return success but not create a duplicate user', () => request(app)
            .post(`${baseURL}/users`)
            .set('Authorization', `Bearer ${auth}`)
            .send(userA)
            .expect(httpStatus.OK)
            // eslint-disable-next-line no-underscore-dangle
            .then(res => User.find({ username: res.body.user.username }))
            .then((users) => {
                // eslint-disable-next-line no-unused-expressions
                expect(users).to.not.be.null;
                expect(users.length).to.equal(1);
            })
        );

        it('should create a device for a user', () => request(app)
            .post(`${baseURL}/users/updateDevice`)
            .set('Authorization', `Bearer ${auth}`)
            .send(userADeviceA)
            .expect(httpStatus.OK)
            .then(() => User.findOne({
                username: userA.username,
            }))
            .then((user) => {
                // eslint-disable-next-line max-len
                const device = user.devices.find(_device => _device.token === userADeviceA.token);
                expect(device).to.not.equal(null);
                expect(device.type).to.equal('iOS');
            })
        );

        it('should disable device on other user when added to a new user', () => request(app)
            .post(`${baseURL}/users`)
            .set('Authorization', `Bearer ${auth}`)
            .send(userB)
            .expect(httpStatus.OK)
            .then(() => request(app)
                .post(`${baseURL}/users/updateDevice`)
                .set('Authorization', `Bearer ${auth}`)
                .send({
                    ...userADeviceA,
                    username: userB.username,
                })
                .expect(httpStatus.OK)
                .then(() => User.findOne({
                    username: userA.username,
                }))
                .then((user) => {
                    // eslint-disable-next-line max-len
                    const device = user.devices.find(_device => _device.token === userADeviceA.token);
                    expect(device).to.not.equal(null);
                    expect(device.status).to.equal('disabled');
                })
            )
        );

        it('should make a successful request to send a push notification', () => request(app)
            .post(`${baseURL}/notifications/sendPushNotifications`)
            .set('Authorization', `Bearer ${auth}`)
            .send(testPushData)
            .expect(httpStatus.OK)
            .then((res) => {
                expect(res.body.success).to.not.equal(null);
            })
        );

        it('should revoke a device for a user', () => request(app)
            .post(`${baseURL}/users/updateDevice`)
            .set('Authorization', `Bearer ${auth}`)
            .send(userADeviceB)
            .expect(httpStatus.OK)
            .then(() => request(app)
                .delete(`${baseURL}/users/revoke-device`)
                .set('Authorization', `Bearer ${auth}`)
                .send(userADeviceB)
                .expect(httpStatus.OK)
                .then(() => User.findOne({
                    username: userA.username,
                }))
                .then((user) => {
                    // eslint-disable-next-line max-len
                    const device = user.devices.find(_device => _device.token === userADeviceA.token);
                    expect(device).to.not.equal(null);
                    expect(device.status).to.equal('disabled');
                })
            )
        );

        it('should reenable a previously revoked device rather than adding a new one', () => request(app)
            .post(`${baseURL}/users/updateDevice`)
            .set('Authorization', `Bearer ${auth}`)
            .send(userADeviceB)
            .expect(httpStatus.OK)
            .then(() => User.findOne({
                username: userA.username,
            }))
            .then((user) => {
                const devices = user.devices.filter(d => d.token === userADeviceB.token);
                expect(devices).to.not.equal(null);
                expect(devices.length).to.equal(1);
                expect(devices[0].status).to.equal('enabled');
                expect(devices[0].token).to.equal(userADeviceB.token);
                expect(devices[0].type).to.equal(userADeviceB.deviceType);
            })
        );
    });
});
