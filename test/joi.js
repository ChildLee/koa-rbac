const Joi = require('joi')

it('should joi', function () {
  const schema = Joi.object().keys({
    role: Joi.string().required()
  }).keys({
    role1: Joi.string().required()
  }).keys({
    role2: Joi.string().required()
  })
  const param = {
    role: '2',
    role1: '1',
    role2: 1
  }

  const res = Joi.validate(param, schema, {allowUnknown: true}).error
  console.log(res)
})

it('直接验证', function () {
  const res = Joi.validate('123', Joi.string().required(), {allowUnknown: true}).error
  console.log(res)
})
