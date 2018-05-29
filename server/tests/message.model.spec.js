/* eslint-env mocha */

import chai, { expect } from 'chai';
// eslint-disable-next-line import/no-extraneous-dependencies
import chaiDateTime from 'chai-datetime';

import {
    Message,
} from '../../config/sequelize';

chai.use(chaiDateTime);

const testMessageObject = {
    owner: 'user1',
    to: ['user1'],
    from: 'user0',
    subject: 'Test Message',
    message: 'Test post please ignore',
    createdAt: new Date(),
};

describe('Message Model:', () => {
    before(() => Message.sync({ force: true }));

    // after(() => Message.destroy({truncate: true}));

    describe('Object creation', () => {
        it('Create Message', () => Message
            .create(testMessageObject)
            .then(message => expect(message).to.exist)
        );

        it('Verify message', () => Message
            .create(testMessageObject)
            .then(createdMessage => Message
                .findById(createdMessage.id)
                .then((message) => {
                    expect(message.owner).to.equal(testMessageObject.owner);
                    expect(message.originalMessageId).to.be.a('null');
                    expect(message.parentMessageId).to.be.a('null');
                    expect(message.to).to.deep.equal(testMessageObject.to);
                    expect(message.from).to.equal(testMessageObject.from);
                    expect(message.subject).to.equal(testMessageObject.subject);
                    expect(message.message).to.equal(testMessageObject.message);
                    expect(message.createdAt).to.equalDate(testMessageObject.createdAt);
                    expect(message.readAt).to.be.a('null');
                    return;
                })
            )
        );
    });
});
