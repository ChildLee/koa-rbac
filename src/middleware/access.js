const db = require('../utils/db')
const {log} = require('../utils/log')

/**
 * 权限集合
 */
const accesses = []

/**
 * 权限验证中间件
 * @param access.menu 权限所属菜单名
 * @param access.name 权限描述
 * @param access.url  权限url
 * @param access.type 权限类型(0,1为菜单权限,2为其他权限),
 *                    0:菜单项点击后访问页面,
 *                    1:菜单列表,点击后出现子菜单项,子菜单项点击访问页面
 * @returns {Function}
 */
const access = function (access) {
  const {url, name, menu} = access
  // 必填
  if (!url || !name || !menu) {
    throw new Error('错误的权限')
  } else {
    // app.js运行的时候将每个路由的权限添加到数组,最后统一在listen的回调里初始化
    accesses.push(access)
  }
  return async function (ctx, next) {
    if (access.url) {
      await next()
    } else {
      ctx.body = {code: 2001, message: '您没有权限'}
    }
  }
}

/**
 * 初始化路由权限
 */
const accessInit = async function () {
  const Access = db.models['access']
  log.trace('**************************************************')
  log.trace('初始化路由权限')
  log.trace('**************************************************')
  // 同步数据库
  await db.sync()
  // 判断权限数组是不是空的
  if (!accesses.length) return
  // 查询权限表数据库名称
  // const tableName = Access.tableName
  // 清空数据库权限表
  // await db.query(`DELETE FROM ${tableName}`)
  // 初始化权限表自增ID为1
  // await db.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1`)
  // 初始化新增统计权限数组
  const newAdd = []
  // 初始化修改统计权限数组
  const newUpdate = []
  // 插入根权限,方便下面权限调用pid
  const root = await Access.findCreateFind({where: {name: '权限', type: -1}})
  // 根权限主键ID
  const rootID = root[0].id
  // 遍历每个路由的权限添加到数据库
  for (let i = 0; i < accesses.length; i++) {
    if (accesses[i]) {
      // 获取路由填入的数据
      const {url, name, menu, type} = accesses[i]
      let pid = rootID
      // 路由填入的菜单名称相同则属于同一菜单,不会生成新的数据,直接返回菜单ID
      // 检查菜单是否存在,不存在则插入,返回菜单id
      const menus = await Access.findCreateFind({where: {name: menu, url: ''}, defaults: {type, pid}})
      // 如果存在的菜单type不和填入的不一致,且填入的菜单type为1,则将查出来的菜单type改为1
      if (menus[0].type !== type && type === 1) {
        menus[0].type = type
        menus[0].save()
      }
      // 菜单ID
      pid = menus[0].id
      // 检查权限是否存在,不存在则插入,菜单id为父id
      const submenu = await Access.findCreateFind({where: {name, pid}, defaults: {url, type}})
      // 已存在的权限判断url是否一致,不一致则更新
      if (!submenu[1] && (submenu[0].url !== url || submenu[0].type !== type)) {
        submenu[0].type = type
        submenu[0].url = url
        submenu[0].save()
        newUpdate.push(accesses[i])
      }
      // 判断权限是否存在
      if (submenu[1]) {
        // 将已存在的权限添加到数据
        newAdd.push(accesses[i])
      }
    }
  }
  log.trace('**************************************************')
  // 权限统计,控制台打印
  log.trace(`路由权限总计：${accesses.length}`)
  // 循环遍历并打印出新增的权限,方便调试
  for (let i = 0; i < newAdd.length; i++) {
    const {url, name, menu, type} = newAdd[i]
    log.trace(`新增的权限-url:'${url}',name:'${name}',menu:'${menu}',type:${type}`)
  }
  // 循环遍历并打印出修改的权限,方便调试
  for (let i = 0; i < newUpdate.length; i++) {
    const {url, name, menu, type} = newUpdate[i]
    log.trace(`修改的权限-url:'${url}',name:'${name}',menu:'${menu}',type:${type}`)
  }
  log.trace('**************************************************')
}

module.exports = {
  access,
  accessInit
}
