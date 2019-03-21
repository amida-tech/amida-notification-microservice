let dbm;
// eslint-disable-next-line no-unused-vars
let type;
// eslint-disable-next-line no-unused-vars
let seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = (options, seedLink) => {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = (db, cb) => {
    db.createCollection('users', cb);
};

// eslint-disable-next-line no-unused-vars
exports.down = (db, cb) => {
};

// eslint-disable-next-line no-underscore-dangle
exports._meta = {
    version: 1,
};
