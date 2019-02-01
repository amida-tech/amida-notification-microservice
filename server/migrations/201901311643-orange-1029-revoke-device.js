'use strict';

var Sequelize = require('sequelize');

var info = {
    'revision': 2,
    'name': '201901311643-orange-1029-revoke-device',
    'created': '2019-01-31T21:43:14.984Z',
    'comment': ''
};

var migrationCommands = [{
        fn: 'removeColumn',
        params: ['Devices', 'isArchived']
    },
    {
        fn: 'addColumn',
        params: [
            'Devices',
            'disabled',
            {
                'type': Sequelize.DATE,
            }
        ]
    },
    {
        fn: 'addConstraint',
        params: [
          'Devices',
          ['token', 'UserId'],
          {
              type: 'unique',
              name: 'Devices_token_UserId_key'
          }
        ]
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
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
