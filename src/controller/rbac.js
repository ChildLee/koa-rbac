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
    const schema = ctx.joi.object({
      name: ctx.joi.string().trim().required()
    })
    const {value, error} = schema.validate(ctx.request.body)
    if (error) return ctx.body = ctx.err(1001)
    const {role} = ctx.model
    const result = await role.create(value)
    ctx.body = ctx.success(result)
  }

  // 删除角色
  static async delRole(ctx) {
    const schema = ctx.joi.object({
      id: ctx.joi.number().required()
    })
    const {value, error} = schema.validate(ctx.request.body)
    if (error) return ctx.body = ctx.err(1001)
    const {role} = ctx.model
    const result = await role.destroy({where: value})
    ctx.body = ctx.success(result)
  }

  // 修改角色
  static async updateRole(ctx) {
    const schema = ctx.joi.object({
      id: ctx.joi.number().required(),
      name: ctx.joi.string().trim().required()
    })
    const {value, error} = schema.validate(ctx.request.body)
    if (error) return ctx.body = ctx.err(1001)
    const {id, name} = value
    const {role} = ctx.model
    const result = await role.update(name, {where: {id}})
    ctx.body = ctx.success(result)
  }

  // 查询角色
  static async getRole(ctx) {
    const {role} = ctx.model
    const result = await role.findAll()
    ctx.body = ctx.success(result)
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
