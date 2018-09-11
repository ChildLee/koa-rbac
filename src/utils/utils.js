const fs = require('fs')
const path = require('path')

class Utils {

  /**
   * 递归创建目录
   * @param dirname
   * @returns {boolean}
   */
  static mkdirSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true
    } else {
      if (this.mkdirSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname)
        return true
      }
    }
  }
}

module.exports = Utils
