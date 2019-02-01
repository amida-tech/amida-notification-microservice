module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.changeColumn('Users', 'uuid', {
            type: Sequelize.UUID,
            unique: true,
            allowNull: false,
        });
    },
};
