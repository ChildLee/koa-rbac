const db = require('../config/db')
require('./rbac')

module.exports = {
  db,
  Op: db.Op,
  ...db.models
}
