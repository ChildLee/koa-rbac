const Router = require('koa-router')
const {access} = require('./middleware/access')

const router = new Router()

router.get('/', access({url: 'admin', name: '管理', menu: '超级', type: 0}), (ctx, next) => {
  ctx.body = {a: 1}
})
router.get('/a', access({url: 'add', name: '添加', menu: '超级', type: 0}), (ctx, next) => {
  ctx.body = {a: 1}
})
router.get('/b', access({url: 'del', name: '删除', menu: '超级', type: 0}), (ctx, next) => {
  ctx.body = {a: 1}
})
router.get('/c', access({url: 'put', name: '修改', menu: '用户', type: 0}), (ctx, next) => {
  ctx.body = {a: 1}
})

module.exports = router
