const {err, log} = require('../utils/log')

class Middleware {
  //响应时间中间件
  static ms() {
    return async (ctx, next) => {
      const start = Date.now()
      await next()
      const ms = Date.now() - start
      log.info(`${ctx.method} ${ctx.status} ${ctx.url} - ${ms}ms`)
    }
  }

  //错误处理中间件
  static error() {
    return async (ctx, next) => {
      try {
        await next()
      } catch (e) {
        let status = e.status || 500
        let message = e.message
        err.error(message)
        ctx.body = {
          status, message
        }
      }
    }
  }
}

module.exports = Middleware
