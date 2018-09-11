const Router = require('koa-router')
const common = require('../controller/common')

const router = new Router()

// 图片上传
router.post('/common/uploadImage', common.uploadImage)

module.exports = router
