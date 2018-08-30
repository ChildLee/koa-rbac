const rbac = require('./rbac')

module.exports = {
  User: rbac.User,
  Role: rbac.Role,
  Permission: rbac.Permission,
  UserRole: rbac.UserRole,
  RolePermission: rbac.RolePermission
}
