const db = require('../src/config/db')
const model = require('../src/model/index')

const {User, Role, Permission, UserRole, RolePermission} = model
const {Op} = db

it('init db', async () => {
  await db.sync({force: true})
})

it('init data', async () => {
  //菜单数据初始化
  await Permission.create({name: '权限', type: -1})
  //一级菜单
  const m1 = await Permission.create({name: '用户管理', pid: 1, type: 0, order: 97})//pid:2
  const m2 = await Permission.create({name: '角色管理', pid: 1, type: 0, order: 98})//pid:3
  const m3 = await Permission.create({name: '权限管理', pid: 1, type: 0, order: 99})//pid:4
  const m4 = await Permission.create({name: '商品管理', pid: 1, type: 0, order: 0})//pid:5
  //一级菜单按钮
  const b1 = await Permission.create({name: '文件管理', pid: 1, type: 1, order: 1})//pid:6
  //用户菜单
  const access4 = await Permission.create({name: '用户列表', pid: 2, url: '/user/list', type: 0})
  const access5 = await Permission.create({name: '添加用户', pid: 2, url: '/user/add', type: 0})
  const access6 = await Permission.create({name: '编辑用户', pid: 2, url: '/user/update', type: 0})
  const access7 = await Permission.create({name: '设置角色', pid: 2, url: '/user/role', type: 0})
  //角色菜单
  const access8 = await Permission.create({name: '角色列表', pid: 3, url: '/role/list', type: 0})
  const access9 = await Permission.create({name: '添加角色', pid: 3, url: '/role/add', type: 0})
  const access10 = await Permission.create({name: '编辑角色', pid: 3, url: '/role/update', type: 0})
  const access11 = await Permission.create({name: '设置权限', pid: 3, url: '/role/permission', type: 0})
  //权限菜单
  const access12 = await Permission.create({name: '权限列表', pid: 4, url: '/permission/list', type: 0})
  const access13 = await Permission.create({name: '添加权限', pid: 4, url: '/permission/add', type: 0})
  const access14 = await Permission.create({name: '编辑权限', pid: 4, url: '/permission/update', type: 0})
  //
  const access15 = await Permission.create({name: '商品列表', pid: 5, url: '/commodity/list', type: 0})
  //
  const btn1 = await Permission.create({name: 'logo上传', pid: 6, url: '/upload/logo', type: 1})
  //
  const user1 = await User.create({name: '用户一'})
  const user2 = await User.create({name: '用户二'})
  const user3 = await User.create({name: '用户三'})
  //
  const SuperRole = await Role.create({name: '超级管理员'})
  const role1 = await Role.create({name: 'Admin'})
  const role2 = await Role.create({name: 'SuperUser'})
  const role3 = await Role.create({name: 'User'})
  //
  await role1['addPermissions']([m1, m2, m3, access4, access5, access6, access7, access8, access9, access10, access11, access12, access13, access14])
  await role2['addPermissions']([m1, access4, access5, access6])
  await role3['addPermissions']([m4, b1, access15, btn1])
  //
  await user1['addRoles']([role1, role2])
  await user2['addRoles']([role2])
  await user3['addRoles']([role3])
})

//所有权限菜单
it('MenuAll', async () => {
  const menu = await Permission.findAll({
    attributes: ['id', 'name'],
    where: {pid: 1},
    order: ['order'],
    include: [{
      model: Permission,
      attributes: ['id', 'name', 'url']
    }]
  })
  console.log(JSON.parse(JSON.stringify(menu)))
})

//角色拥有的权限菜单
it('UserMenuAll', async () => {
  const menu = await Permission.findAll({
    include: [{
      model: Role,
      attributes: [],
      where: {id: 2}
    }, {
      model: Permission,
      attributes: ['id', 'name', 'url']
    }],
    attributes: ['id', 'name'],
    where: {pid: 1}
  })
  console.log(JSON.parse(JSON.stringify(menu)))
})

//用户菜单
it('Menus', async () => {
  //查询用户所有的角色
  const roles = await UserRole.findAll({
    raw: true,
    attributes: ['role_id'],
    where: {user_id: 1}
  })
  //没有角色返回空数组
  if (!roles.length) {
    return []
  }
  const role = []
  for (let i = 0; i < roles.length; i++) {
    role.push(roles[i]['role_id'])
  }
  //查询所有角色菜单
  const menus = await Permission.findAll({
    attributes: ['id', 'name'],
    where: {type: 0, pid: 1},
    order: ['order'],
    include: [{
      model: Role,
      attributes: [],
      where: {
        id: {[Op.in]: role}
      }
    }, {
      model: Permission,
      attributes: ['id', 'name', 'url']
    }]
  })
  console.log(JSON.parse(JSON.stringify(menus)))
})

//url访问权限查询
it('Access', async () => {
  const access = await Role.findOne({
    attributes: [],
    include: [{
      model: User,
      attributes: [],
      where: {id: 3}
    }, {
      model: Permission,
      attributes: ['url'],
      where: {url: '/upload/logo'}
    }]
  })
  console.log(JSON.stringify(access, null, 2))
})

//封号
it('Banned Account', async () => {
  const status = await User.update({status: 0}, {where: {id: 1}})
  console.log(status)
})
