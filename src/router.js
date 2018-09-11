const Router = require('koa-router')
const admin = require('./router/admin')
const wxPay = require('./router/wx')

const router = new Router()

router.use(admin.routes())
router.use(wxPay.routes())

module.exports = router
