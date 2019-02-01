'use strict';

var Sequelize = require('sequelize');

var info = {
    'revision': 1,
    'name': '201901290642-init',
    'created': '2019-01-29T00:11:42.944Z',
    'comment': ''
};

var migrationCommands = [{
        fn: 'createTable',
        params: [
            'Users',
            {
                'id': {
                    'type': Sequelize.INTEGER,
                    'primaryKey': true,
                    'autoIncrement': true
                },
                'uuid': {
                    'type': Sequelize.UUID,
                    'unique': true
                },
                'username': {
                    'type': Sequelize.STRING,
                    'allowNull': false
                },
                'createdAt': {
                    'type': Sequelize.DATE,
                    'allowNull': false
                },
                'updatedAt': {
                    'type': Sequelize.DATE,
                    'allowNull': false
                }
            },
            {}
        ]
    },
    {
        fn: 'createTable',
        params: [
            'Devices',
            {
                'id': {
                    'type': Sequelize.INTEGER,
                    'primaryKey': true,
                    'autoIncrement': true
                },
                'type': {
                    'type': Sequelize.STRING,
                    'allowNull': false
                },
                'token': {
                    'type': Sequelize.STRING,
                    'allowNull': false
                },
                'isArchived': {
                    'type': Sequelize.BOOLEAN,
                    'defaultValue': false,
                    'allowNull': false
                },
                'createdAt': {
                    'type': Sequelize.DATE,
                    'allowNull': false
                },
                'updatedAt': {
                    'type': Sequelize.DATE,
                    'allowNull': false
                },
                'UserId': {
                    'type': Sequelize.INTEGER,
                    'onUpdate': 'CASCADE',
                    'onDelete': 'SET NULL',
                    'references': {
                        'model': 'Users',
                        'key': 'id'
                    },
                    'allowNull': true
                }
            },
            {}
        ]
    },
    {
        fn: 'createTable',
        params: [
            'Notifications',
            {
                'id': {
                    'type': Sequelize.INTEGER,
                    'primaryKey': true,
                    'autoIncrement': true
                },
                'type': {
                    'type': Sequelize.STRING,
                    'allowNull': false
                },
                'payload': {
                    'type': Sequelize.JSON,
                    'allowNull': false
                },
                'status': {
                    'type': Sequelize.STRING,
                    'allowNull': false
                },
                'createdAt': {
                    'type': Sequelize.DATE,
                    'allowNull': false
                },
                'updatedAt': {
                    'type': Sequelize.DATE,
                    'allowNull': false
                },
                'DeviceId': {
                    'type': Sequelize.INTEGER,
                    'onUpdate': 'CASCADE',
                    'onDelete': 'SET NULL',
                    'references': {
                        'model': 'Devices',
                        'key': 'id'
                    },
                    'allowNull': true
                }
            },
            {}
        ]
    },
    {
        // This manual query is required, rather than using sequelize's addIndex() because addIndex() does not support IF NOT EXISTS.
        fn: 'query',
        query: 'CREATE INDEX IF NOT EXISTS users_uuid ON public."Users" USING btree (uuid);'
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log('[#'+index+'] execute: ' + command.fn);
                    index++;
                    if (command.fn === 'query') {
                        queryInterface.sequelize.query(command.query).then(next, reject);
                    }
                    else {
                        queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                    }
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
