const dtime = require('time-formater')

function Logger(token, options) {
  this.tokens = {
    tiny: ':method :url :status',
    normal: ':method :url :httpVersion :status :duration',
    long: '[:date :time :day] :ip :url :httpVersion :status :duration :userAgent'
  }
  if (typeof token === 'string') {
    this.token = this.tokens[token] || token
  } else {
    this.token = this.tokens.normal
  }
  this.options = options || {}
}

Logger.prototype = {
  strategy: {
    ip: function (req) {
      if (typeof req.headers !== 'object') {
        return
      }
      var ip = this.getHeader(req.headers, 'x-forwarded-for')
      if (typeof ip === 'string') {
        return ip.split(',')[0]
      } else {
        return req.connection.remoteAddress || req.socket.remoteAddress
      }
    },
    date: function () {
      return dtime().format('YYYY-MM-DD')
    },
    time: function () {
      return dtime().format('HH:mm:ss')
    },
    day: function () {
      return dtime().format('ddd')
    },
    method: function (req) {
      return req.method
    },
    url: function (req) {
      return req.url
    },
    httpVersion: function (req) {
      return 'HTTP/' + req.httpVersion
    },
    status: function (req, res) {
      var code = res.statusCode
      if (code >= 400) {
        return '\x1b[31m' + code + '\x1b[0m'
      } else if (code >= 200) {
        return '\x1b[32m' + code + '\x1b[0m'
      }
    },
    userAgent: function (req) {
      if (typeof req.headers !== 'object') {
        return
      }
      return this.getHeader(req.headers, 'user-agent')
    },
    duration: function (req) {
      return Date.now() - req._start + 'ms'
    },
    getHeader: function (header, name) {
      var reg = new RegExp(name, 'i')
      for (var key in header) {
        if (reg.test(key)) {
          return header[key]
        }
      }
    }
  },
  format: function (token, req, res) {
    var replaceFunc = function (match, key) {
      if (typeof this.options[key] === 'function') {
        return this.options[key].call(this.strategy, req, res)
      } else if (typeof this.strategy[key] === 'function') {
        return this.strategy[key](req, res)
      } else {
        return match
      }
    }
    return token.replace(/:(\w+)/g, replaceFunc.bind(this))
  },
  middlewarify: function () {
    var middleware = function (req, res, next) {
      var that = this
      req._start = Date.now()
      res.on('finish', function () {
        var str = that.format(that.token, req, res)
        console.log(str)
      })
      if (typeof next === 'function') {
        next()
      }
    }
    return middleware.bind(this)
  }
}

module.exports = Logger