/* eslint-env mocha */
import request from 'supertest';
import httpStatus from 'http-status';
import { expect } from 'chai';

import {
    Message,
} from '../../config/sequelize';
import { auth, auth2, baseURL, app } from './common.integration.js';


const testMessageObject = {
    to: ['user1', 'user2'],
    subject: 'Test Message',
    message: 'Test post please ignore',
};

const inaccessibleMessageObject = {
    to: ['user007'],
    subject: 'For your eyes only',
    message: '*Self destruct*',
};

const threadMessageTemplate = {
    subject: 'subject',
    message: 'message',
    isDeleted: false,
    isArchived: false,
    readAt: null,
    owner: 'user0',
    from: 'user0',
    to: ['user0'],
};

const getThreadsTestObject = [
    {
        id: 1,
        originalMessageId: 1,
        parentMessageId: null,
    },
    // thread with one archived
    {
        id: 2,
        originalMessageId: 2,
        parentMessageId: null,
    },
    {
        id: 3,
        originalMessageId: 2,
        parentMessageId: 2,
        isArchived: true,
    },
    // thread with all archived
    {
        id: 4,
        originalMessageId: 4,
        parentMessageId: null,
        isArchived: true,
    },
    {
        id: 5,
        originalMessageId: 4,
        parentMessageId: 4,
        isArchived: true,
    },
    // thread with one read
    {
        id: 6,
        originalMessageId: 6,
        parentMessageId: null,
    },
    {
        id: 7,
        originalMessageId: 6,
        parentMessageId: 6,
        readAt: new Date(),
    },
    // thread with all read
    {
        id: 8,
        originalMessageId: 8,
        parentMessageId: null,
        readAt: new Date(),
    },
    {
        id: 9,
        from: 'user1',
        originalMessageId: 8,
        parentMessageId: 8,
        readAt: new Date(),
    },
    // deleted
    {
        id: 10,
        origionalMessageId: 10,
        parentMessageId: null,
        isDeleted: true,
    },
].map((message, index) => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + index);
    return Object.assign({}, threadMessageTemplate, { createdAt: date, updatedAt: date }, message);
});

describe('Thread API:', () => {
    describe('GET /thread/', () => {
        before(() => Message
            .destroy({ where: {}, truncate: true })
            .then(() => Message.bulkCreate(getThreadsTestObject)));

        after(() => Message
            .destroy({ where: {}, truncate: true }));

        it('should return thread summaries', () => request(app)
            .get(`${baseURL}/thread`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then(({ body: { threads } }) => {
                expect(threads).to.be.an('array');
                expect(threads.length).to.equal(5);
                expect(threads.map(thread => thread.originalMessageId)).to.not.include(10);
            })
        );

        it('should return newest threads first', () => request(app)
            .get(`${baseURL}/thread`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then(({ body: { threads } }) => {
                expect(threads.length).to.be.greaterThan(1);
                threads.forEach((thread, index) => {
                    if (index < threads.length - 1) {
                        expect(thread.mostRecent > threads[index + 1].mostRecent, `index: ${index}`)
                        .to.equal(true);
                    }
                });
            })
        );

        it('should produce a correct isArchived value', () => request(app)
            .get(`${baseURL}/thread`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then(({ body: { threads } }) => {
                expect(threads).to.be.an('array');
                const isArchived = [false, false, true, false, false];
                threads.forEach((thread, index) => {
                    expect(thread.isArchived, `isArchived[${index}]`).to.equal(isArchived[index]);
                });
            })
        );

        it('should produce a correct unread value', () => request(app)
            .get(`${baseURL}/thread`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then(({ body: { threads } }) => {
                expect(threads).to.be.an('array');
                const unread = [false, true, true, true, true];
                threads.forEach((thread, index) => {
                    expect(thread.unread, `unread[${index}]`).to.equal(unread[index]);
                });
            })
        );

        it('should produce a correct count value', () => request(app)
            .get(`${baseURL}/thread`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then(({ body: { threads } }) => {
                expect(threads).to.be.an('array');
                const count = [2, 2, 2, 2, 1];
                threads.forEach((thread, index) => {
                    expect(thread.count, `count[${index}]`).to.equal(count[index]);
                });
            })
        );

        it('should produce a correct from value', () => request(app)
            .get(`${baseURL}/thread`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then(({ body: { threads } }) => {
                expect(threads).to.be.an('array');
                const from = [['user0', 'user1'],
                    ['user0'],
                    ['user0'],
                    ['user0'],
                    ['user0']];
                threads.forEach((thread, index) => {
                    expect(thread.from, `from[${index}]`).to.deep.equal(from[index]);
                });
            })
        );

        it('should produce a correct messageIds value', () => request(app)
            .get(`${baseURL}/thread`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then(({ body: { threads } }) => {
                expect(threads).to.be.an('array');
                const messageIds = [[8, 9], [6, 7], [4, 5], [2, 3], [1]];
                threads.forEach((thread, index) => {
                    expect(thread.messageIds, `messageIds[${index}]`).to.deep.equal(messageIds[index]);
                });
            })
        );

        it('should support limit parameter', () => request(app)
            .get(`${baseURL}/thread?limit=1`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then(({ body: { threads } }) => {
                expect(threads).to.be.an('array');
                expect(threads).to.have.length(1);
            })
        );

        it('should support offset parameter', () => request(app)
            .get(`${baseURL}/thread?offset=1`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then(({ body: { threads } }) => {
                expect(threads).to.be.an('array');
                expect(threads[0].originalMessageId).to.equal(6);
            })
        );

        it('should support archived=true parameter', () => request(app)
            .get(`${baseURL}/thread?archived=true`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then(({ body: { threads } }) => {
                expect(threads).to.have.length(1);
                expect(threads[0].isArchived).to.equal(true);
            })
        );

        it('should support archived=false parameter', () => request(app)
            .get(`${baseURL}/thread?archived=false`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then(({ body: { threads } }) => {
                expect(threads).to.have.length(4);
                expect(threads[0].isArchived).to.equal(false);
                expect(threads[1].isArchived).to.equal(false);
                expect(threads[2].isArchived).to.equal(false);
                expect(threads[3].isArchived).to.equal(false);
            })
        );

        it('should offset and limit archive-filtered results', () => request(app)
            .get(`${baseURL}/thread?archived=false&offset=1&limit=1`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then(({ body: { threads } }) => {
                expect(threads).to.have.length(1);
                expect(threads[0].originalMessageId).to.equal(6);
            })
        );

        it('returns the count of all threads', () => request(app)
            .get(`${baseURL}/thread`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then(({ body: { count } }) => {
                expect(count).to.equal(5);
            })
        );

        it('returns the count for archived queries', () => request(app)
            .get(`${baseURL}/thread?archived=false`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then(({ body: { count } }) => {
                expect(count).to.equal(4);
            })
        );

        it('returns the unlimited count for limited queries', () => request(app)
            .get(`${baseURL}/thread?limit=1`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then(({ body: { count, threads } }) => {
                expect(count).to.equal(5);
                expect(threads.length).to.equal(1);
            })
        );

        it('returns the unlimited, filtered count for limited, filtered queries', () => request(app)
            .get(`${baseURL}/thread?limit=1&archived=false`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then(({ body: { count, threads } }) => {
                expect(count).to.equal(4);
                expect(threads.length).to.equal(1);
            })
        );
    });

    describe('GET /thread/:originalMessageId', () => {
        let originalMessageId;
        let inaccessibleMessageId;
        let responseMessageId;

        const responseMessageObject = {
            to: ['user1', 'user2'],
            subject: 'Test Message',
            message: 'Response post please ignore',
        };

        before(() => request(app)
            .post(`${baseURL}/message/send`)
            .set('Authorization', `Bearer ${auth}`)
            .send(testMessageObject)
            .then((message) => {
                originalMessageId = message.body.originalMessageId;
                return request(app)
                .post(`${baseURL}/message/reply/${originalMessageId}`)
                .set('Authorization', `Bearer ${auth}`)
                .send(responseMessageObject)
                .then((response) => {
                    responseMessageId = response.body.id;
                    return request(app)
                    .post(`${baseURL}/message/reply/${responseMessageId}`)
                    .set('Authorization', `Bearer ${auth}`)
                    .send(responseMessageObject)
                    .expect(httpStatus.OK)
                    .then(deleteResponse => request(app)
                        .delete(`${baseURL}/message/delete/${deleteResponse.body.id}`)
                        .set('Authorization', `Bearer ${auth}`)
                        .send()
                        .expect(httpStatus.OK));
                });
            })
            .then(() => request(app)
                .post(`${baseURL}/message/send`)
                .set('Authorization', `Bearer ${auth2}`)
                .send(inaccessibleMessageObject)
                .then((message) => {
                    inaccessibleMessageId = message.body.originalMessageId;
                })
            )
        );

        it('should return OK', () => request(app)
            .get(`${baseURL}/thread/${originalMessageId}`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK));

        it('should return an array of messages with ids in reply order', () => request(app)
            .get(`${baseURL}/thread/${originalMessageId}`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then((res) => {
                expect(res.body).to.be.an('array');
                expect(res.body.map(body => body.id)).to.deep.equal(
                    [originalMessageId, responseMessageId]);
            }));

        it('should return an array with bodies matching the specified messages', () =>
            request(app)
            .get(`${baseURL}/thread/${originalMessageId}`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.OK)
            .then((res) => {
                const messageRequests = [testMessageObject, responseMessageObject];
                res.body.forEach((message, index) =>
                    expect(message).to.deep.include(messageRequests[index]));
            }));

        it('should 404 with unfound id', () =>
            request(app)
            .get(`${baseURL}/thread/-1`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.NOT_FOUND)
        );

        it('should 404 with inaccessible id', () =>
            request(app)
            .get(`${baseURL}/thread/${inaccessibleMessageId}`)
            .set('Authorization', `Bearer ${auth}`)
            .expect(httpStatus.NOT_FOUND)
        );
    });
});
