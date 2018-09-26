class Result {

  /**
   *
   * @param data 结果
   */
  static success(data) {
    return Result.result(0, 'success', data)
  }

  /**
   * 请求错误
   * @param {number} status 状态码
   * @param {string} message 状态信息
   */
  static error(status, message) {
    const err = Result.result
    if (status && !message) {
      switch (status) {
        // 参数相关
        case 1001:
          return err(1001, '参数错误')
        // 授权相关
        case 2001:
          return err(2001, '无访问权限')
        case 2002:
          return err(2002, 'token已过期')
        // 用户相关
        case 3001:
          return err(3001, '未登录')
        case 3002:
          return err(3002, '用户信息错误')
        case 3003:
          return err(3003, '用户不存在')
        // 微信相关
        case 4001:
          return err(4001, '微信统一下单失败')
        case 4002:
          return err(4002, 'openId获取失败')
        default:
          return err(-1, '服务器内部错误')
      }
    }
    // 自定义错误
    if (status && message) return err(status, message)
  }

  static result(code, message, data) {
    return {
      code,
      message,
      data,
    }
  }
}

module.exports = Result
