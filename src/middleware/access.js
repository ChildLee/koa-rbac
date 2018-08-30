const Sequelize = require('sequelize')
const model = require('../model/index')

const {Op} = Sequelize
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
  // 将路由权限添加到数组
  accesses.push(access)
  return async function (ctx, next) {
    console.log(accesses)
    if (access === 1) {
      await next()
    } else {
      ctx.body = {code: 0, message: '没得权限'}
    }

  }
}

/**
 * 初始化路由权限
 */
async function accessInit() {
  // 新添加的权限
  const repeat = []
  // 检查根权限是否存在,不存在则插入,返回id
  const Root = await Permission.findOrCreate({where: {name: '权限', type: -1}})
  const rootId = Root[0].id
  // 遍历权限添加到数据库
  for (let i = 0; i < accesses.length; i++) {
    if (accesses[i]) {
      const {url, name, menu, type} = accesses[i]
      // 菜单名称和菜单类型相同则属于同一菜单
      // 检查菜单是否存在,不存在则插入,返回菜单id
      const Menu = await Permission.findOrCreate({where: {name: menu, type}, defaults: {pid: rootId}})
      const pid = Menu[0].id
      // 检查菜单是否存在,不存在则插入,菜单id为父id
      const access = await Permission.findOrCreate({where: {url, pid, type}, defaults: {name}})
      if (access[1]) {
        repeat.push(accesses[i])
      }
    }
  }
  for (let i = 0; i < repeat.length; i++) {
    const {url, name, menu} = repeat[i]
    console.error(`新添加的权限：${name},${url},${menu}`)
  }
  const count = await Permission.count({where: {pid: {[Op.not]: rootId}}})
  console.error(`路由权限总计：${accesses.length}`)
  console.error(`数据库权限总计(除去根权限和菜单)：${count}`)
  console.error(`可能有${accesses.length - count}个权限重复`)
}

module.exports = {
  access,
  accessInit
}
