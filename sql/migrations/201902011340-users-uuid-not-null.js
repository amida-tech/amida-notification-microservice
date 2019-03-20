const logger = require('../../config/winston');

const info = {
    revision: 3,
    name: '201902011340-users-uuid-not-null.js',
    created: '2019-02-01T21:43:14.984Z',
    comment: '',
};

module.exports = {
    up: async (queryInterface, Sequelize) => {
        logger.info('1: Adding NOT NULL to `Devices.uuid`...');
        await queryInterface.changeColumn('Users', 'uuid', {
            type: Sequelize.UUID,
            allowNull: false,
        });
    },
    down: async (queryInterface, Sequelize) => {
        logger.info('1: Removing NOT NULL to `Devices.uuid`...');
        await queryInterface.changeColumn('Users', 'uuid', {
            type: Sequelize.UUID,
            allowNull: true,
        });
    },
    info,
};
