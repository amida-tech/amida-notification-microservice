/**
 * Message Schema
 */
module.exports = (sequelize, DataTypes) => {
    const Article = sequelize.define('Article', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        articleTrack: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        articleReference: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        articleId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        articleDeliveryDay: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        articleOrder: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        isArchived: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        defaultScope: {
            where: {
                isArchived: false,
            },
        }
    });
    // Class methods

    return Article;
};
