const pgp = require('pg-promise')();

module.exports = pgp(process.env.DATABASE_URL + (process.env.DATABASE_SSL === 'true' ? '?ssl=true' : ''));
