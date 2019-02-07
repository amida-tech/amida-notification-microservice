/* eslint-env mocha */
/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import chaiDatetime from 'chai-datetime';
import chaiDateString from 'chai-date-string';
import { setTimeout } from 'timers';
import uuid from 'uuid/v1';

import { User, Device } from '../../config/sequelize';
import { app, auth, baseURL } from './common.integration.js';

chai.use(chaiDatetime);
chai.use(chaiDateString);

const testUserObject = {
    username: 'notified@example.com',
    uuid: uuid(),
};

const deviceRequestData = {
    username: testUserObject.username,
    token: '4b569d24',
    deviceType: 'iOS',
};

const testPushData = {
    pushData: [{
        username: testUserObject.username,
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

    describe('Create User and Update Device Token', () => {
        it('Should fail without Authorization header', () => request(app)
            .post(`${baseURL}/users`)
            .send(testUserObject)
            .expect(httpStatus.UNAUTHORIZED)
        );

        it('Should fail with badtoken in Authorization header', () => request(app)
            .post(`${baseURL}/users`)
            .set('Authorization', 'Bearer badtoken')
            .send(testUserObject)
            .expect(httpStatus.UNAUTHORIZED)
        );

        it('should should create and respond with a user', () => request(app)
            .post(`${baseURL}/users`)
            .set('Authorization', `Bearer ${auth}`)
            .send(testUserObject)
            .expect(httpStatus.OK)
            .then((res) => {
                User.findById(res.body.user.id)
                  .then((user) => {
                      expect(user.username).to.equal(testUserObject.username);
                  });
            })
        );

        it('should create a device for a user', () => request(app)
            .post(`${baseURL}/users/updateDevice`)
            .set('Authorization', `Bearer ${auth}`)
            .send(deviceRequestData)
            .expect(httpStatus.OK)
            .then(res => User.findOne({   // eslint-disable-line no-unused-vars
                where: {
                    username: testUserObject.username,
                },
                include: [{
                    model: Device,
                }],
            })
              .then((user) => {
                  // eslint-disable-next-line max-len
                  const device = user.Devices.find(_device => _device.token === deviceRequestData.token);
                  expect(device).to.not.equal(null);
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
    });
});
