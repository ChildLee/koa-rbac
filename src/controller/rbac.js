class RBAC {

  // 查询菜单
  static async menu(ctx) {
    const {access, Op} = ctx.model
    const menu = await access.findAll({
      attributes: ['id', 'name', 'type'],
      where: {pid: 1, type: {[Op.or]: [0, 1]}},
      order: ['order'],
      include: [{
        model: access,
        attributes: ['id', 'name', 'url', 'type'],
        where: {type: {[Op.or]: [0, 1]}}
      }]
    })
    ctx.body = ctx.success(menu)
  }

  // 添加角色
  static async addRole(ctx) {
    const {joi} = ctx
    const schema = joi.object({
      name: joi.string().trim().required()
    })
    const {value, error} = schema.validate(ctx.request.body)
    if (error) return ctx.body = ctx.err(1001)
    const {role} = ctx.model
    const result = await role.create(value)
    ctx.body = ctx.success(result)
  }

  // 删除角色
  static async delRole(ctx) {
    const {joi} = ctx
    const schema = joi.object({
      id: joi.number().required()
    })
    const {value, error} = schema.validate(ctx.request.body)
    if (error) return ctx.body = ctx.err(1001)
    const {role} = ctx.model
    const result = await role.destroy({where: value})
    ctx.body = ctx.success(result)
  }

  // 修改角色
  static async updateRole(ctx) {
    const {joi} = ctx
    const schema = joi.object({
      id: joi.number().required(),
      name: joi.string().trim().required()
    })
    const {value, error} = schema.validate(ctx.request.body)
    if (error) return ctx.body = ctx.err(1001)
    const {id, name} = value
    const {role} = ctx.model
    const result = await role.update({name}, {where: {id}})
    ctx.body = ctx.success(result)
  }

  // 查询角色
  static async getRole(ctx) {
    const {joi} = ctx
    const schema = joi.object({
      page: joi.number().default(1),
      limit: joi.number().default(15)
    })
    const {value, error} = schema.validate(ctx.request.body)
    if (error) return ctx.body = ctx.err(1001)
    const {page, limit} = value
    const {role} = ctx.model
    const total = await role.count()
    const list = await role.findAll({offset: (page - 1) * limit, limit})
    ctx.body = ctx.success({list, page, limit, total})
  }

  // 查询权限
  static async access(ctx) {
    const {access} = ctx.model
    const result = await access.findAll({
      attributes: ['id', 'name'],
      where: {pid: 1},
      order: ['order'],
      include: [{
        model: access,
        attributes: ['id', 'name']
      }]
    })
    ctx.body = ctx.success(result)
  }

}

module.exports = RBAC
