const db = require('../src/utils/db')
const model = require('../src/model/index')

const {user, role, access, user_role, role_access} = model
const {Op} = db

it('should models', function () {
  console.log(model)
})

it('init db', async () => {
  await db.sync({force: true})
})

it('init data', async () => {
  //菜单数据初始化
  await access.create({name: '权限', type: -1})
  //一级菜单
  const m1 = await access.create({name: '用户管理', pid: 1, type: 0, order: 97})//pid:2
  const m2 = await access.create({name: '角色管理', pid: 1, type: 0, order: 98})//pid:3
  const m3 = await access.create({name: '权限管理', pid: 1, type: 0, order: 99})//pid:4
  const m4 = await access.create({name: '商品管理', pid: 1, type: 0, order: 0})//pid:5
  //一级菜单按钮
  const b1 = await access.create({name: '文件管理', pid: 1, type: 1, order: 1})//pid:6
  //用户菜单
  const access4 = await access.create({name: '用户列表', pid: 2, url: '/user/list', type: 0})
  const access5 = await access.create({name: '添加用户', pid: 2, url: '/user/add', type: 0})
  const access6 = await access.create({name: '编辑用户', pid: 2, url: '/user/update', type: 0})
  const access7 = await access.create({name: '设置角色', pid: 2, url: '/user/role', type: 0})
  //角色菜单
  const access8 = await access.create({name: '角色列表', pid: 3, url: '/role/list', type: 0})
  const access9 = await access.create({name: '添加角色', pid: 3, url: '/role/add', type: 0})
  const access10 = await access.create({name: '编辑角色', pid: 3, url: '/role/update', type: 0})
  const access11 = await access.create({name: '设置权限', pid: 3, url: '/role/Access', type: 0})
  //权限菜单
  const access12 = await access.create({name: '权限列表', pid: 4, url: '/Access/list', type: 0})
  const access13 = await access.create({name: '添加权限', pid: 4, url: '/Access/add', type: 0})
  const access14 = await access.create({name: '编辑权限', pid: 4, url: '/Access/update', type: 0})
  //
  const access15 = await access.create({name: '商品列表', pid: 5, url: '/home', type: 0})
  //
  const btn1 = await access.create({name: 'logo上传', pid: 6, url: '/upload/logo', type: 1})
  //
  const user1 = await user.create({name: '用户一'})
  const user2 = await user.create({name: '用户二'})
  const user3 = await user.create({name: '用户三'})
  //
  const SuperRole = await role.create({name: '超级管理员'})
  const role1 = await role.create({name: 'Admin'})
  const role2 = await role.create({name: 'SuperUser'})
  const role3 = await role.create({name: 'User'})
  //
  await role1['addAccesses']([m1, m2, m3, access4, access5, access6, access7, access8, access9, access10, access11, access12, access13, access14])
  await role2['addAccesses']([m1, access4, access5, access6])
  await role3['addAccesses']([m4, b1, access15, btn1])
  //
  await user1['addRoles']([role1, role2])
  await user2['addRoles']([role2])
  await user3['addRoles']([role3])
})

//所有权限菜单
it('MenuAll', async () => {
  const menu = await access.findAll({
    attributes: ['id', 'name'],
    where: {pid: 1},
    order: ['order'],
    include: [{
      model: access,
      attributes: ['id', 'name', 'url']
    }]
  })
  console.log(JSON.stringify(menu, null, 2))
})

//角色拥有的权限菜单
it('UserMenuAll', async () => {
  const menu = await access.findAll({
    include: [{
      model: role,
      attributes: [],
      where: {id: 2}
    }, {
      model: access,
      attributes: ['id', 'name', 'url']
    }],
    attributes: ['id', 'name'],
    where: {pid: 1}
  })
  console.log(JSON.stringify(menu, null, 2))
})

//用户菜单
it('Menus', async () => {
  //查询用户所有的角色
  const roleList = await user_role.findAll({
    raw: true,
    attributes: ['role_id'],
    where: {user_id: 1}
  })
  //没有角色返回空数组
  if (!roleList.length) {
    return []
  }
  const roles = []
  for (let i = 0; i < roles.length; i++) {
    roles.push(roleList[i]['role_id'])
  }
  //查询所有角色菜单
  const menus = await access.findAll({
    attributes: ['id', 'name'],
    where: {type: 0, pid: 1},
    order: ['order'],
    include: [{
      model: role,
      attributes: [],
      where: {
        id: {[Op.in]: roles}
      }
    }, {
      model: access,
      attributes: ['id', 'name', 'url']
    }]
  })
  console.log(JSON.stringify(menus, null, 2))
})

//url访问权限查询
it('Access', async () => {
  const go = await role.findOne({
    attributes: [],
    include: [{
      model: user,
      attributes: [],
      where: {id: 3}
    }, {
      model: access,
      attributes: ['url'],
      where: {url: '/upload/logo'}
    }]
  })
  console.log(JSON.stringify(go, null, 2))
})

//封号
it('Banned Account', async () => {
  const status = await user.update({status: 0}, {where: {id: 1}})
  console.log(status)
})

// 获取所有角色
it('getRole', async () => {
  const roleList = await role.findAll()
  console.log(JSON.stringify(roleList, null, 2))
})

it('should fenye', async () => {
  const list = await role.findAndCount({limit: 10})
  console.log(JSON.stringify(list, null, 2))
})

it('should ddd', async () => {
  const res = await role_access.bulkCreate([
    {roleId: 1, accessId: 3},
    {roleId: 1, accessId: 4},
    {roleId: 1, accessId: 5},
    {roleId: 1, accessId: 6},
    {roleId: 1, accessId: 7},
    {roleId: 1, accessId: 9}], {
    ignoreDuplicates: true
  })
  console.log(JSON.stringify(res, null, 2))
})

it('should roleAccess', async () => {
  const accesses = await role_access.findAll({
    attributes: ['accessId'],
    where: {role_id: 1}
  })
  let list = []
  for (let i = 0; i < accesses.length; i++) {
    list.push(accesses[i].accessId)
  }
  console.log(JSON.stringify(list, null, 2))
})

it('should replace', async () => {
  await access.bulkCreate([
    {id: 1, order: 1},
    {id: 2, order: 4},
    {id: 3, order: 5},
    {id: 4, order: 6},
    {id: 5, order: 7},
    {id: 6, order: 9}], {
    updateOnDuplicate: ['id', 'order']
  })
})
