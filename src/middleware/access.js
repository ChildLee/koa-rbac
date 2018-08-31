const db = require('../config/db')
const model = require('../model/index')

const {Permission} = model

/**
 * 权限集合
 */
const accesses = []

/**
 * 权限验证中间件
 * @param access.url  权限url
 * @param access.name 权限描述
 * @param access.menu 权限所属菜单名
 * @param access.type 权限类型,0为菜单
 * @returns {Function}
 */
const access = function (access) {
  const {url, name, menu, type} = access
  if (!url || !name || !menu) {
    throw new Error('错误的权限')
  } else {
    // app.js运行的时候将每个路由的权限添加到数组,最后统一在listen的回调里初始化
    accesses.push(access)
  }
  return async function (ctx, next) {
    if (access.url === '1') {
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
  console.error('**************************************************')
  console.error('初始化路由权限')
  console.error('**************************************************')
  // 判断权限数组是不是空的
  if (!accesses.length) return
  // 查询权限表数据库名称
  const tableName = Permission.tableName
  // 清空数据库权限表
  await db.query(`DELETE FROM ${tableName}`)
  // 初始化权限表自增ID为1
  await db.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1`)
  // 初始化统计重复的权限数组
  const repeat = []
  // 插入根权限,方便下面权限调用pid
  const Root = await Permission.findOrCreate({where: {name: '权限', type: -1}})
  // 根权限主键ID
  const rootID = Root[0].id
  // 遍历每个路由的权限添加到数据库
  for (let i = 0; i < accesses.length; i++) {
    if (accesses[i]) {
      // 获取路由填入的数据
      const {url, name, menu, type} = accesses[i]
      // 路由填入的菜单名称和菜单类型相同则属于同一菜单,不会生成新的数据,直接返回菜单ID
      // 检查菜单是否存在,不存在则插入,返回菜单id
      const Menu = await Permission.findOrCreate({where: {name: menu, type}, defaults: {pid: rootID}})
      // 菜单ID
      const pid = Menu[0].id
      // 路由填入的权限路径和权限类型相同则属于同一菜单,不会生成新的数据,直接返回权限ID
      // 检查权限是否存在,不存在则插入,菜单id为父id
      const access = await Permission.findOrCreate({where: {url, type}, defaults: {name, pid}})
      // 判断权限是否存在
      if (!access[1]) {
        // 将已存在的权限添加到数据
        repeat.push(accesses[i])
      }
    }
  }
  console.error('**************************************************')
  // 权限统计,控制台打印
  console.error(`路由权限总计：${accesses.length}`)
  // 循环遍历并打印出重复的权限,方便调试
  for (let i = 0; i < repeat.length; i++) {
    const {url, name, menu} = repeat[i]
    console.error(`重复的权限-url:'${url}',name:'${name}',menu:'${menu}'`)
  }
  console.error('**************************************************')
}

module.exports = {
  access,
  accessInit
}
