const mosca = require('mosca')
const MqttServer = new mosca.Server({
  port: 1883
})

MqttServer.on('clientConnected', function (client) {

})

/**
 * 监听MQTT主题消息
 **/
MqttServer.on('published', function (packet, client) {
  const topic = packet.topic
  if (topic === 'client') {
    console.log(topic, packet.payload.toString())
    MqttServer.publish({topic: 'server', payload: '这是服务端返回的数据！'})
  }
})

MqttServer.on('ready', function () {
  console.log('mqtt is running...')
})
