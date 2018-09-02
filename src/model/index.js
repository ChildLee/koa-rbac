const rbac = require('./rbac')
const db = require('../config/db')

module.exports = {
  Op: db.Op,
  User: rbac.User,
  Role: rbac.Role,
  Access: rbac.Access,
  UserRole: rbac.UserRole,
  RoleAccess: rbac.RoleAccess
}
