"use strict"

const environment = process.env.DB_ENV;
const config = require('./knexfile.js')[environment];

module.exports = require('knex')(config);
