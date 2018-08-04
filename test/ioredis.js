const Redis = require('ioredis')

const redis = new Redis(6379, '120.79.10.251')

it('ioRedis', async () => {
  redis.set('a', '666')
  const a = await redis.get('a')
  console.log(a)
  await redis.del('a')
  const keys = await redis.keys('*')
  console.log(keys)
})
