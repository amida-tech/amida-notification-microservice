const logger = require('../../config/winston');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        logger.info('1: Adding NOT NULL to `Devices.uuid`...');
        await queryInterface.changeColumn('Users', 'uuid', {
            type: Sequelize.UUID,
            allowNull: false,
        });
    },
};
