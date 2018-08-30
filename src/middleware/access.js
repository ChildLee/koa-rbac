const model = require('../model/index')
/**
 * 权限验证中间件
 * @param access
 * @returns {Function}
 */
module.exports = (access) => {
  return async function (ctx, next) {
    const url = await model.Permission.find({where: {url: access}})
    console.log(JSON.stringify(url, null, 2))
    let a = 1
    if (a === access) {
      await next()
    } else {
      ctx.body = {code: 0, message: '没得权限'}
    }
  }
}
