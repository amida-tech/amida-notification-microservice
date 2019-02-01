const Sequelize = require('sequelize');

const logger = require('../../config/winston');

const info = {
    revision: 2,
    name: '201901311643-orange-1029-revoke-device',
    created: '2019-01-31T21:43:14.984Z',
    comment: '',
};

const migrationCommands = [
    {
        fn: 'removeColumn',
        params: ['Devices', 'isArchived'],
    },
    {
        fn: 'addColumn',
        params: [
            'Devices',
            'disabled',
            {
                type: Sequelize.DATE,
            },
        ],
    },
    {
        fn: 'addConstraint',
        params: [
            'Devices',
            ['token', 'UserId'],
            {
                type: 'unique',
                name: 'Devices_token_UserId_key',
            },
        ],
    },
];

module.exports = {
    pos: 0,
    up(queryInterface) {
        let index = this.pos;
        return new Promise((resolve, reject) => {
            function next() {
                if (index < migrationCommands.length) {
                    const command = migrationCommands[index];
                    logger.info(`[Migration #${index}] execute: ${command.fn}`);
                    index += 1;
                    // eslint-disable-next-line prefer-spread, max-len
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                } else {
                    resolve();
                }
            }
            next();
        });
    },
    info,
};
