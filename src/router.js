const Router = require('koa-router')
const rbac = require('./controller/rbac')
const {access} = require('./middleware/access')

const router = new Router()

router.post('/admin/getMenu', rbac.menu)

// 角色列表
router.post('/admin/getRole', access({
  menu: '角色管理',
  name: '角色列表',
  url: 'role',
  type: 0
}), rbac.role)

// 添加角色
router.post('/admin/addRole', access({
  menu: '角色管理',
  name: '添加角色',
  url: 'addRole',
  type: 2
}), rbac.addRole)

// 权限列表
router.post('/admin/getAccess', access({
  menu: '权限管理',
  name: '权限列表',
  url: 'access',
  type: 0
}), rbac.access)

module.exports = router
