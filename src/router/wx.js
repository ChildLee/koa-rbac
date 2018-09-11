const Router = require('koa-router')
const wx = require('../controller/wx')

const router = new Router()

// 微信支付
router.post('/wx/wxPay', wx.wxPay)
// 小程序获取手机号
router.post('/wx/getPhoneNumber', wx.getPhoneNumber)
// 生成小程序码
router.post('/wx/QR_Code', wx.QR_Code)

module.exports = router
