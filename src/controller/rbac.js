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

  // 菜单排序
  static async menuSort(ctx) {
    const {joi} = ctx
    const schema = joi.object({
      sort: joi.array().items(joi.object()).required()
    })
    const {value, error} = schema.validate(ctx.request.body)
    if (error) return ctx.body = ctx.err(1001, error.details[0].message)
    const {sort} = value
    const {access} = ctx.model
    await access.bulkCreate(sort, {
      updateOnDuplicate: ['id', 'order']
    })
    ctx.body = ctx.success()
  }

  // 添加角色
  static async addRole(ctx) {
    const {joi} = ctx
    const schema = joi.object({
      name: joi.string().trim().required()
    })
    const {value, error} = schema.validate(ctx.request.body)
    if (error) return ctx.body = ctx.err(1001, error.details[0].message)
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
    if (error) return ctx.body = ctx.err(1001, error.details[0].message)
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
    if (error) return ctx.body = ctx.err(1001, error.details[0].message)
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
    if (error) return ctx.body = ctx.err(1001, error.details[0].message)
    const {page, limit} = value
    const {role} = ctx.model
    const result = await role.findAndCount({offset: (page - 1) * limit, limit})
    ctx.body = ctx.success({list: result.rows, page, limit, total: result.count})
  }

  // 角色添加权限
  static async roleAddAccess(ctx) {
    const {joi} = ctx
    const schema = joi.object({
      role_id: joi.number().required(),
      permission: joi.array().items(joi.number()).required()
    })
    const {value, error} = schema.validate(ctx.request.body)
    if (error) return ctx.body = ctx.err(1001, error.details[0].message)
    const {role_id, permission} = value
    let arr = []
    for (let i = 0; i < permission.length; i++) {
      arr.push({roleId: role_id, accessId: permission[i]})
    }
    const {db, role_access} = ctx.model
    await db.transaction(async t => {
      await role_access.destroy({where: {role_id}}, {transaction: t})
      await role_access.bulkCreate(arr, {ignoreDuplicates: true, transaction: t})
    })
    ctx.body = ctx.success()
  }

  // 查询角色权限
  static async getRoleAccess(ctx) {
    const {joi} = ctx
    const schema = joi.object({
      role_id: joi.number().required()
    })
    const {value, error} = schema.validate(ctx.request.body)
    if (error) return ctx.body = ctx.err(1001, error.details[0].message)
    const {role_id} = value
    const {role_access} = ctx.model
    const accesses = await role_access.findAll({
      attributes: ['accessId'],
      where: {role_id}
    })
    let list = []
    for (let i = 0; i < accesses.length; i++) {
      list.push(accesses[i].accessId)
    }
    ctx.body = ctx.success(list)
  }

  // 查询权限
  static async getAccess(ctx) {
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

  // 查询用户
  static async getUser(ctx) {
    console.log(ctx.model)
  }

}

module.exports = RBAC
