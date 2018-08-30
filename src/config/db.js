const Sequelize = require('sequelize')

module.exports = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'sa',
  database: 'rbac',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  timezone: '+08:00',
  // operatorsAliases: false,
  define: {
    // 禁止修改表名
    freezeTableName: true,
    // 下划线命名
    underscored: true
  },

  logging: (sql) => {
    console.log(sql)
  }
})
