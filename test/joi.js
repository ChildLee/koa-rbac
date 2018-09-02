const joi = require('joi')

it('should joi', function () {
  const schema = joi.object({
    name: joi.string().trim().required()
  })
  const res = schema.validate({name: '1', b: 1}, {allowUnknown: true})
  console.log(res)
})
