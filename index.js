const Logger = require('./lib/log')

module.exports = function (token, options) {
  var logger = new Logger(token, options)
  return logger.middlewarify()
}