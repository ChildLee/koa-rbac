const Koa = require('koa')
const Router = require('koa-router')
const {access, accessInit} = require('./middleware/access')
const app = new Koa()

const router = new Router()


router.get('/', access({url: 'url1', name: 'name1', menu: 'menu1', type: 0}), (ctx, next) => {
  ctx.body = {a: 1}
})
router.get('/a', access({url: 'url1', name: 'name1', menu: 'menu1', type: 0}), (ctx, next) => {
  ctx.body = {a: 1}
})
router.get('/b', access({url: 'url1', name: 'name1', menu: 'menu1', type: 0}), (ctx, next) => {
  ctx.body = {a: 1}
})
router.get('/c', access({url: 'url1', name: 'name1', menu: 'menu1', type: 0}), (ctx, next) => {
  ctx.body = {a: 1}
})

app.use(router.routes())

app.listen(3000, () => {
  console.log('http://127.0.0.1:3000')
  // 初始化权限
  accessInit()
})
