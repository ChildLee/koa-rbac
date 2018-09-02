const Koa = require('koa')
const joi = require('joi')
const cors = require('@koa/cors')
const router = require('./router')
const koaBody = require('koa-body')
const logger = require('koa-logger')
const model = require('./model/index')
const result = require('./utils/result')
const {accessInit} = require('./middleware/access')

const app = new Koa()

app.context.joi = joi
app.context.model = model
app.context.err = result.error
app.context.success = result.success

app.use(cors())
app.use(logger())
app.use(koaBody())

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, async () => {
  // 初始化权限
  await accessInit()
  console.log('http://127.0.0.1:3000')
})
