/**
 * Created by Administrator on 2016/1/13.
 */

const mqtt = require('mqtt')

const client = mqtt.connect('mqtt://localhost', {
  username: 'username',
  password: 'password',
  clientId: 'clientId1'
})

client.on('connect', function () {
  // client.subscribe('server')
  client.publish('client', '客户端发送的数据')
})

client.on('message', function (topic, message) {
  console.log(message.toString())
  // if (topic === 'server') {
  //   console.log(topic, message.toString())
  // }
})
