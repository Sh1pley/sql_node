const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

function clearSecrets() {
  return database.raw('TRUNCATE secrets RESTART IDENTITY');  
}

function findSecretByMessage(message) {
  return database.raw("SELECT * FROM secrets WHERE message=?", [message]);
}

function findSecretById(id) {
  return database.raw("SELECT * FROM secrets WHERE id=?", [id]);
}

function findAllSecrets() {
  return database.raw("SELECT * FROM secrets")
}

function insertSecret(message, date) {
  return database.raw(
          `INSERT INTO secrets (message, created_at) VALUES (?, ?)
          RETURNING *`,
          [message, date]
        )
}

module.exports = {
  clearSecrets: clearSecrets,
  findSecretByMessage: findSecretByMessage,
  insertSecret: insertSecret,
  findAllSecrets: findAllSecrets,
  findSecretById: findSecretById
}