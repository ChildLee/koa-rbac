const wx = require('./router/wx')
const Router = require('koa-router')
const admin = require('./router/admin')
const common = require('./router/common')

const router = new Router()

router.use(wx.routes())
router.use(admin.routes())
router.use(common.routes())

module.exports = router
