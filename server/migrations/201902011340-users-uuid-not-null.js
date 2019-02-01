'use strict';

var Sequelize = require('sequelize');

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.changeColumn('Users', 'uuid', {
            "type": Sequelize.UUID,
            "unique": true,
            "allowNull": false
        })
    }
}
