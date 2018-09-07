class WxPay {
  // 微信支付
  static async wxPay(ctx) {
    const {joi, wxPay} = ctx
    const schema = joi.object().keys({
      order_sn: joi.string().max(32).required(),
      total_fee: joi.number().min(0.01).required(),
      body: joi.string().trim().max(128).required()
    })

    const {value, error} = schema.validate(ctx.request.body)
    if (error) return ctx.body = ctx.err(1001, error.details[0].message)

    let {order_sn, total_fee, body} = value
    let payment = await wxPay.appletPay({order_sn, total_fee, body})

    if (payment['return_code'] === 'FAIL') {
      return ctx.body = ctx.err(1002, payment['return_msg'])
    } else if (payment['result_code'] === 'FAIL') {
      return ctx.body = ctx.err(1002, payment['err_code_des'])
    }
    ctx.body = ctx.success(payment)
  }
}

module.exports = WxPay
