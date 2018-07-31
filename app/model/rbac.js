//用户表
exports.User = (sequelize, DataTypes) => {
  const {BIGINT, STRING, BOOLEAN} = DataTypes
  return sequelize.define('user', {
    id: {
      type: BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: STRING,
      allowNull: false,
      defaultValue: '',
      comment: '姓名'
    },
    status: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '封禁状态 1.有效 0:无效'
    }
  }, {
    tableName: 'sys_user',
    comment: '用户表'
  })
}

//角色表
exports.Role = (sequelize, DataTypes) => {
  const {INTEGER, STRING} = DataTypes
  return sequelize.define('role', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: STRING,
      allowNull: true,
      defaultValue: '',
      comment: '角色名'
    }
  }, {
    tableName: 'sys_role',
    comment: '角色表'
  })
}

//权限表
exports.Permission = (sequelize, DataTypes) => {
  const {TINYINT, INTEGER, STRING} = DataTypes
  return sequelize.define('permission', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '资源类型：-1=root,0=menu,1=operations'
    },
    name: {
      type: STRING,
      allowNull: false,
      defaultValue: '',
      comment: '权限名称'
    },
    url: {
      type: STRING,
      allowNull: false,
      defaultValue: '',
      comment: '权限URL'
    },
    pid: {
      type: INTEGER,
      comment: '父权限ID'
    },
    order: {
      type: STRING(5),
      allowNull: false,
      defaultValue: '',
      comment: '排序'
    }
  }, {
    tableName: 'sys_permission',
    comment: '权限表'
  })
}

//用户-角色表
exports.UserRole = (sequelize) => {
  return sequelize.define('user_role', {}, {
    tableName: 'sys_user_role',
    //不添加时间戳属性
    timestamps: false,
    comment: '用户-角色关联表'
  })
}

//角色-权限表
exports.RolePermission = (sequelize) => {
  return sequelize.define('role_permission', {}, {
    tableName: 'sys_role_permission',
    //不添加时间戳属性
    timestamps: false,
    comment: '角色-权限关联表'
  })
}
