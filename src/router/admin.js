const Router = require('koa-router')
const rbac = require('../controller/rbac')
const {access} = require('../middleware/access')

const router = new Router()

// 菜单列表
router.post('/admin/getMenu', rbac.menu)

// 菜单排序
router.post('/admin/menuSort', access({
  menu: '权限管理', name: '菜单排序', url: '/menuSort', type: 2
}), rbac.menuSort)

// 添加角色
router.post('/admin/addRole', access({
  menu: '角色管理', name: '添加角色', url: '/addRole', type: 2
}), rbac.addRole)

// 删除角色
router.post('/admin/delRole', access({
  menu: '角色管理', name: '删除角色', url: '/delRole', type: 2
}), rbac.delRole)

// 修改角色
router.post('/admin/updateRole', access({
  menu: '角色管理', name: '修改角色', url: '/updateRole', type: 2
}), rbac.updateRole)

// 查询角色
router.post('/admin/getRole', access({
  menu: '角色管理', name: '角色列表', url: '/role', type: 1
}), rbac.getRole)

// 角色添加权限
router.post('/admin/roleAddAccess', access({
  menu: '角色管理', name: '添加权限', url: '/roleAddAccess', type: 2
}), rbac.roleAddAccess)

// 角色查询权限
router.post('/admin/getRoleAccess', access({
  menu: '角色管理', name: '查询权限', url: '/getRoleAccess', type: 2
}), rbac.getRoleAccess)

// 权限列表
router.post('/admin/getAccess', access({
  menu: '权限管理', name: '权限列表', url: '/access', type: 1
}), rbac.getAccess)

// 用户列表
router.post('/admin/getUser', access({
  menu: '用户管理', name: '用户列表', url: '/user', type: 1
}), rbac.getUser)

module.exports = router
