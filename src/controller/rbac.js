class RBAC {

  // 查询菜单
  static async menu(ctx) {
    const {Access, Op} = ctx.model
    const menu = await Access.findAll({
      attributes: ['id', 'name', 'url', 'type'],
      where: {pid: 1, type: {[Op.or]: [0, 1]}},
      order: ['order'],
      include: [{
        model: Access,
        attributes: ['id', 'name', 'url', 'type'],
        where: {type: {[Op.or]: [0, 1]}}
      }]
    })
    ctx.body = ctx.success(menu)
  }

  // 查询角色
  static async role(ctx) {
    const {Role} = ctx.model
    const role = await Role.findAll()
    ctx.body = ctx.success(role)
  }

  // 添加角色
  static async addRole(ctx) {
    const schema = ctx.joi.object({
      name: ctx.joi.string().trim().required()
    })
    const {value, error} = schema.validate(ctx.request.body)
    if (error) return ctx.body = ctx.err(1001)
    const {Role} = ctx.model
    const role = await Role.create(value)
    console.log(JSON.stringify(role, null, 2))
    ctx.body = ctx.success(role)
  }

  // 删除角色
  static async delRole(ctx) {
    const schema = ctx.joi.object({
      id: ctx.joi.number().required()
    })
    const {value, error} = schema.validate(ctx.request.body)
    if (error) return ctx.body = ctx.err(1001)
    const {Role} = ctx.model
    const role = await Role.destroy({where: value})
    console.log(JSON.stringify(role, null, 2))
    ctx.body = ctx.success(role)
  }

  // 查询权限
  static async access(ctx) {
    const {Access} = ctx.model
    const access = await Access.findAll({
      attributes: ['id', 'name'],
      where: {pid: 1},
      order: ['order'],
      include: [{
        model: Access,
        attributes: ['id', 'name']
      }]
    })
    ctx.body = ctx.success(access)
  }
}

module.exports = RBAC
