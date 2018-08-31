const Router = require('koa-router')
const {access} = require('./middleware/access')

const router = new Router()

router.get('/', access({
  url: '1',
  name: '管理',
  menu: '超级',
  type: 0
}), (ctx, next) => {
  ctx.body = {a: 1}
})

module.exports = router
