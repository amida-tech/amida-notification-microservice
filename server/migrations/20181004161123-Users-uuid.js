

module.exports = {
    up(queryInterface, Sequelize) {
   /*
     Add altering commands here.
     Return a promise to correctly handle asynchronicity.
     */
        return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;').then(() => queryInterface.addColumn('Users', 'uuid',
            {
                type: Sequelize.UUID,
                defaultValue: null,
                allowNull: true,
                unique: true,
                after: 'id',
               // primaryKey: true,
            })
         ).then(() => {
             queryInterface.addIndex('Users', ['uuid']);
         });
    },
    down(queryInterface) {
        return [
            queryInterface.removeColumn('Users', 'uuid'),
            queryInterface.removeIndex('Users', ['uuid']),
        ];
    },
};
