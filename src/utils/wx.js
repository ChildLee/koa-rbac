const qs = require('qs')
const crypto = require('crypto')
const xml2js = require('xml2js')
const axios = require('axios').default

const parser = new xml2js.Parser({
  //不获取根节点
  explicitRoot: false,
  //true始终将子节点放入数组中; false则只有存在多个数组时才创建数组。
  explicitArray: false
})
const builder = new xml2js.Builder({
  //根节点名称
  rootName: 'xml',
  //省略XML标题
  headless: true
})

// 统一下单
const unifiedOrderUrl = 'https://api.mch.weixin.qq.com/pay/unifiedorder'
// 查询订单
const orderQueryUrl = 'https://api.mch.weixin.qq.com/pay/orderquery'

const config = {
  //小程序AppID
  appID: 'wx4166fb058064fcb6',
  //小程序AppSecret密钥
  appSecret: '',
  //商户号
  mch_id: '1513118641',
  //商户密钥
  mch_key: '',
  //测试用openid
  openid: 'od0Ar5I41b1OnE6s7XGlRVco0dWo'
}

// 微信工具
class Wx {
  // 小程序支付
  static appletPay(data) {
    // 交易类型
    data['trade_type'] = 'JSAPI'
    // 用户标识
    data['openid'] = config.openid

    // 请求统一下单接口
    return this.getPrepay(data).then(res => {
      // 判断请求是否成功
      if (res['result_code'] !== 'SUCCESS') return res

      // 发起微信小程序支付参数
      const args = {
        appId: res['appid'],
        timeStamp: Date.now().toString(),
        nonceStr: res['nonce_str'],
        package: `prepay_id=${res['prepay_id']}`,
        signType: 'MD5'
      }
      // 加密参数
      args['paySign'] = getSign(args, config.mch_key)

      return args
    })
  }

  // 统一下单
  static getPrepay(data) {
    // 提交一次订单后取消不支付,那么订单号,价格,body不能修改,不一致会导致prepay_id获取不到
    let param = {
      // 小程序ID
      appid: config.appID,
      // 商户号
      mch_id: config.mch_id,
      // 随机字符串
      nonce_str: randomStringing(),
      // 商品描述
      body: data.body,
      // 订单号
      out_trade_no: data.order_sn,
      // 标价金额
      total_fee: parseInt(data.total_fee * 100),
      // 终端IP
      spbill_create_ip: '123.12.12.123',
      // 通知地址
      notify_url: 'http://127.0.0.1',
      // 交易类型
      trade_type: data.trade_type,
      // 用户标识
      openid: data.openid
    }
    return logic(unifiedOrderUrl, param)
  }

  // 查询订单
  static orderQuery(data) {
    let param = {
      // 小程序ID
      appid: config.appID,
      // 商户号
      mch_id: config.mch_id,
      // 随机字符串
      nonce_str: randomStringing(),
      // 微信的订单号，优先使用
      transaction_id: data.transaction_id,
      // 商户订单号
      out_trade_no: data.out_trade_no
    }
    return logic(orderQueryUrl, param)
  }

  // 获取openid、session_key
  static getOpenId(code) {
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.appID}&secret=${config.appSecret}&js_code=${code}&grant_type=authorization_code`
    return axios.post(url).then(res => {
      return res.data
    })
  }

  // 解密手机号
  static decryptData(sessionKey, encryptedData, iv) {
    sessionKey = Buffer.from(sessionKey, 'base64')
    encryptedData = Buffer.from(encryptedData, 'base64')
    iv = Buffer.from(iv, 'base64')

    //创建aes-128-cbc解码对象
    let decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)

    //encryptedData是Buffer则忽略inputEncoding参数
    let decoded = decipher.update(encryptedData, 'base64', 'utf8')

    decoded += decipher.final('utf8')

    return JSON.parse(decoded)
  }
}

//微信支付通用方法
async function logic(url, param) {
  //参数签名
  param['sign'] = getSign(param, config.mch_key)
  //生成xml
  const xml = builder.buildObject(param)
  const result = await axios.post(url, xml)
  return new Promise((resolve, reject) => {
    parser.parseString(result.data, (err, res) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

//生成签名
function getSign(param, mch_key) {
  const data = {}
  for (const k of Object.keys(param).sort()) {
    if (param[k]) data[k] = param[k]
  }
  const str = decodeURIComponent(qs.stringify(data) + `&key=${mch_key}`)
  return crypto.createHash('md5').update(str, 'utf8').digest('hex').toUpperCase()
}

//生成随机字符串
function randomStringing(len = 32) {
  const data = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const strLength = data.length
  let str = ''
  for (let i = 0; i < len; i++) {
    str += data.charAt(Math.floor(Math.random() * strLength))
  }
  return str
}

module.exports = Wx
