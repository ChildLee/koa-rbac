const Koa = require('koa')
const joi = require('joi')
const path = require('path')
const wx = require('./utils/wx')
const cors = require('@koa/cors')
const router = require('./router')
const koaBody = require('koa-body')
const {log} = require('./utils/log')
const model = require('./model/index')
const utils = require('./utils/utils')
const result = require('./utils/result')
const trace = require('./middleware/trace')
const {accessInit} = require('./middleware/access')

const app = new Koa()

app.context.wx = wx
app.context.joi = joi
app.context.model = model
app.context.err = result.error
app.context.success = result.success

app.use(trace.error())
app.use(trace.ms())
app.use(trace.response_time())
app.use(cors())
app.use(koaBody({
  multipart: true,
  formidable: {//文件上传临时目录
    uploadDir: path.join(__dirname, '..', 'temp'),
    keepExtensions: true
  }
}))

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, async () => {
  // 初始化权限
  await accessInit()
  utils.mkdirSync(path.join(__dirname, '..', 'temp'))
  log.trace('http://127.0.0.1:3000')
})
