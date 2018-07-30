const Koa = require('koa')
const serve = require('koa-static')
const views = require('koa-views')

const app = new Koa()

app.use(views('./app/view', {extension: 'ejs'}))
app.use(serve('./app/static'))

app.use(async (ctx) => {
  await ctx.render('index', {koa: 'koa'})
})

app.listen(3000, () => {
  console.log('http://127.0.0.1:3000')
})
