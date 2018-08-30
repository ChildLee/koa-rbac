const Koa = require('koa')
const router = require('./router')
const {accessInit} = require('./middleware/access')
const app = new Koa()

app.use(router.routes())

app.listen(3000, () => {
  console.log('http://127.0.0.1:3000')
  // 初始化权限
  accessInit()
})
