const Sequelize = require('sequelize')
const config = require('../../config/config.default')

const sequelize = new Sequelize(config.sequelize)

//用户表
const User = sequelize.import('user', require('./rbac').User)
//角色表
const Role = sequelize.import('role', require('./rbac').Role)
//权限表
const Permission = sequelize.import('permission', require('./rbac').Permission)
//菜单表-父菜单与主键关联
Permission.hasMany(Permission, {foreignKey: 'pid'})
//用户-角色表
const UserRole = sequelize.import('user_role', require('./rbac').UserRole)
User.belongsToMany(Role, {through: UserRole})
Role.belongsToMany(User, {through: UserRole})
//角色-权限表
const RolePermission = sequelize.import('role_permission', require('./rbac').RolePermission)
Role.belongsToMany(Permission, {through: RolePermission})
Permission.belongsToMany(Role, {through: RolePermission})

module.exports = {
  sequelize,
  User, Role, Permission, UserRole, RolePermission
}
