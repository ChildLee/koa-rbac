const joi = require('joi')
const timestamp = require('time-stamp')

it('should joi', function () {
  const schema = joi.object({
    name: joi.string().trim().required()
  })
  const res = schema.validate({name: '1', b: 1}, {allowUnknown: true})
  console.log(res)
})

it('should 1', function () {
  const schema = joi.object({
    page: joi.number().default(1),
    limit: joi.number().default(15)
  })
  const res = schema.validate({page: 1})
  console.log(res)
})

it('should arr', function () {
  const schema = joi.object({
    role_id: joi.number().required(),
    permission: joi.array().items(joi.number()).required()
  })
  const {value, error} = schema.validate({role_id: 1, permission: []})
  if (error) console.log(error.details[0].message)
})

//生成随机数字
function randomNumber(len = 18) {
  const data = '0123456789'
  const strLength = data.length
  let str = ''
  for (let i = 0; i < len; i++) {
    str += data.charAt(Math.floor(Math.random() * strLength))
  }
  return str
}

it('should 111', function () {
  console.log(parseInt(10.0012 * 100))
})
