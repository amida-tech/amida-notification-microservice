const postgres = require('./config').postgres;

const config = {
    username: postgres.user,
    password: postgres.password,
    database: postgres.db,
    host: postgres.host,
    port: postgres.port,
    dialect: 'postgres',
};

module.exports = {
    development: config,
    test: config,
    production: config,
};
