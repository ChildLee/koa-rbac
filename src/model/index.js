const db = require('../utils/db')
require('./rbac')

module.exports = {
  db,
  Op: db.Op,
  ...db.models
}
