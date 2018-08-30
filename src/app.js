const Koa = require('koa')
const app = new Koa()

app.use(async ctx => {
  ctx.body = {a: 1}
})

app.listen(3000, () => {
  console.log('http://127.0.0.1:3000')
})
