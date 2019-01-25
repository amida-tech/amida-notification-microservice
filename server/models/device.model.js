/**
 * Message Schema
 */
module.exports = (sequelize, DataTypes) => {
    const Device = sequelize.define('Device', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        deletedAt: 'disabled',
        paranoid: true,
    });

    return Device;
};
