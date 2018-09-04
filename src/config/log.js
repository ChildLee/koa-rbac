const log4js = require('log4js')

log4js.configure({
  appenders: {
    stdout: {type: 'stdout'},
    err: {type: 'file', filename: '../log/err.log', maxLogSize: 10 * 1024 * 1024},
    log: {type: 'file', filename: '../log/log.log', maxLogSize: 10 * 1024 * 1024}
  },
  categories: {
    default: {appenders: ['stdout'], level: 'trace'},
    err: {appenders: ['err'], level: 'error'},
    log: {appenders: ['log'], level: 'info'}
  }
})

// const logger = log4js.getLogger('err')
// logger.trace('Entering cheese testing')
// logger.debug('Got cheese.')
// logger.info('Cheese is Comté.')
// logger.warn('Cheese is quite smelly.')
// logger.error('Cheese is too ripe!')
// logger.fatal('Cheese was breeding ground for listeria.')

let log = process.env.NODE_ENV === 'dev' ? '' : 'log'

exports.err = log4js.getLogger('err')
exports.log = log4js.getLogger(log)
