const Koa = require('koa')
const koaBody = require('koa-body')
const router = require('./router')
const {accessInit} = require('./middleware/access')
const app = new Koa()

app.use(koaBody())

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
  // 初始化权限
  accessInit()
  console.log('http://127.0.0.1:3000')
})
