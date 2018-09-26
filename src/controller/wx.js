class Wx {
  // 微信支付
  static async wxPay(ctx) {
    const {joi, wx} = ctx
    const schema = joi.object().keys({
      order_sn: joi.string().max(32).required(),
      total_fee: joi.number().min(0.01).required(),
      body: joi.string().trim().max(128).required(),
    })

    const {value, error} = schema.validate(ctx.request.body)
    if (error) return ctx.body = ctx.err(1001, error.details[0].message)

    let {order_sn, total_fee, body} = value
    let payment = await wx.appletPay({order_sn, total_fee, body})

    if (payment['return_code'] === 'FAIL') {
      return ctx.body = ctx.err(4001, payment['return_msg'])
    } else if (payment['result_code'] === 'FAIL') {
      return ctx.body = ctx.err(4001, payment['err_code_des'])
    }
    ctx.body = ctx.success(payment)
  }

  // 获取用户手机号
  static async getPhoneNumber(ctx) {
    const {joi, wx} = ctx
    const schema = joi.object().keys({
      code: joi.string().required(),
      encryptedData: joi.string().required(),
      iv: joi.string().required(),
    })
    const {value, error} = schema.validate(ctx.request.body)

    if (error) return ctx.body = ctx.err(1001, error.details[0].message)
    let {code, encryptedData, iv} = value

    const {session_key} = await wx.getOpenId(code)
    if (!session_key) {
      return ctx.body = ctx.err(4002)
    }
    let phoneNumber = await wx.decryptData(session_key, encryptedData, iv)
    ctx.body = ctx.success(phoneNumber)
  }

  // 生成小程序码
  static async QR_Code(ctx) {
    const {joi, wx} = ctx

    const {access_token} = await wx.access_token()
    const code = await wx.QR_Code(access_token)
    ctx.body = ctx.success(code)
  }
}

module.exports = Wx
