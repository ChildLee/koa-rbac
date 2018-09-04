const Sequelize = require('sequelize')
const db = require('../config/db')

const {INTEGER, STRING, BOOLEAN, BIGINT, TINYINT} = Sequelize

//用户表
const User = db.define('user', {
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


//角色表
const Role = db.define('role', {
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


//权限表
const Access = db.define('access', {
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
  tableName: 'sys_access',
  comment: '权限表'
})

//权限表-父菜单与主键关联
Access.hasMany(Access, {foreignKey: 'pid'})

//用户-角色表
const UserRole = db.define('user_role', {}, {
  tableName: 'sys_user_role',
  //不添加时间戳属性
  timestamps: false,
  comment: '用户-角色关联表'
})
User.belongsToMany(Role, {through: UserRole})
Role.belongsToMany(User, {through: UserRole})

//角色-权限表
const RoleAccess = db.define('role_access', {}, {
  tableName: 'sys_role_access',
  //不添加时间戳属性
  timestamps: false,
  comment: '角色-权限关联表'
})
Role.belongsToMany(Access, {through: RoleAccess})
Access.belongsToMany(Role, {through: RoleAccess})
