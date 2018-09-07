const Router = require('koa-router')
const wx = require('../controller/wxPay')

const router = new Router()

// 微信支付
router.post('/wx/wxPay', wx.wxPay)

module.exports = router
