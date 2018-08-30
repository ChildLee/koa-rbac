const Koa = require('koa')
const Router = require('koa-router')
const access = require('./middleware/access')
const app = new Koa()

const router = new Router()

router.get('/', access('/user/list'), (ctx, next) => {
  ctx.body = {a: 1}
})

app.use(router.routes())

app.listen(3000, () => {
  console.log('http://127.0.0.1:3000')
})
