/**
 * User Schema
 */
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        uuid: {
            type: DataTypes.UUID,
            unique: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        indexes: [
            {
                fields: ['uuid'],
            },
        ],
    });

    return User;
};
