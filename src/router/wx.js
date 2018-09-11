const Router = require('koa-router')
const wx = require('../controller/wx')

const router = new Router()

// 微信支付
router.post('/wx/wxPay', wx.wxPay)
// 小程序获取手机号
router.post('/wx/getPhoneNumber', wx.getPhoneNumber)

module.exports = router
