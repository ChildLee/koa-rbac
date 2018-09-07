const Koa = require('koa')
const joi = require('joi')
const cors = require('@koa/cors')
const router = require('./router')
const koaBody = require('koa-body')
const {log} = require('./utils/log')
const model = require('./model/index')
const wxPay = require('./utils/wxPay')
const result = require('./utils/result')
const trace = require('./middleware/trace')
const {accessInit} = require('./middleware/access')

const app = new Koa()

app.context.joi = joi
app.context.model = model
app.context.wxPay = wxPay
app.context.err = result.error
app.context.success = result.success

app.use(trace.error())
app.use(trace.ms())
app.use(cors())
app.use(koaBody({
  // multipart: true //解析from-data
}))

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, async () => {
  // 初始化权限
  await accessInit()
  log.trace('http://127.0.0.1:3000')
})
