

module.exports = {
    up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
        queryInterface.describeTable('Users').then((attributes) => {
            if (!attributes.uuid) {
                return queryInterface.addColumn('Users', 'uuid',
                    {
                        type: Sequelize.UUID,
                        defaultValue: null,
                        allowNull: true,
                        unique: true,
                        after: 'id',
                    }).then(() => {
                        queryInterface.addIndex('Users', ['uuid']);
                    });
            }
            return Promise.resolve();
        });
    },

    down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
        queryInterface.describeTable('Users').then((attributes) => {
            if (attributes.uuid) {
                return [
                    queryInterface.removeColumn('Users', 'uuid'),
                    queryInterface.removeIndex('Users', ['uuid']),
                ];
            }
            return Promise.resolve();
        });
    },
};
