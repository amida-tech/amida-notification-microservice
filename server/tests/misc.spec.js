/* eslint-env mocha */

import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';

import { app, auth } from './common.integration.js';

chai.config.includeStack = true;

describe('## Misc', () => {
    describe('# GET /api/health-check', () => {
        it('should return OK', () => request(app)
            .get('/api/health-check')
            .expect(httpStatus.OK)
            .then(res => expect(res.text).to.equal('OK'))
        );
    });

    describe('# GET /api/404', () => {
        it('should return 404 status', () => request(app)
            .get('/api/404')
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.NOT_FOUND)
            .then((res) => {
                expect(res.status).to.equal(404);
                expect(res.body.message).to.equal('Not Found');
            })
        );
    });

    describe('# GET /actuator', () => {
        it('/stats should return app statistics', () => request(app)
            .get('/swagger-stats/stats')
            .expect(httpStatus.OK)
            .then(res => expect(res.body.all).to.exist)
        );
    });
});
