const Sequelize = require('sequelize');

const logger = require('../../config/winston');

const info = {
    revision: 1,
    name: '201901290642-init',
    created: '2019-01-29T00:11:42.944Z',
    comment: '',
};

const usersTableAttributes = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uuid: {
        type: Sequelize.UUID,
        unique: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
    },
};

const devicesTableAttributes = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isArchived: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    UserId: {
        type: Sequelize.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        references: {
            model: 'Users',
            key: 'id',
        },
        allowNull: true,
    },
};

const notificationsTableAttributes = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    payload: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    DeviceId: {
        type: Sequelize.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        references: {
            model: 'Devices',
            key: 'id',
        },
        allowNull: true,
    },
};

module.exports = {
    up: async (queryInterface) => {
        logger.info('1: Creating Users table...');
        await queryInterface.createTable('Users', usersTableAttributes, {});

        logger.info('2: Creating Devices table...');
        await queryInterface.createTable('Devices', devicesTableAttributes, {});

        logger.info('3: Creating Notifications table...');
        await queryInterface.createTable('Notifications', notificationsTableAttributes, {});
    },
    info,
};
