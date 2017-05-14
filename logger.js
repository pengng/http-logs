const moment = require('./moment');

function Logger(str, option) {

  var type = {
    tiny: ':method :url :status',
    normal: ':method :url HTTP/:httpVersion :status :duration',
    long: '[:date :time :day] :ip :url HTTP/:httpVersion :status :duration :userAgent'
  };

  str = type[str] || str || type.normal;

  var strategy = {
    ip: function (req) {
      var address = '';
      if (req.headers && typeof req.headers['x-forwarded-for'] == 'string') {
        address = req.headers['x-forwarded-for'].split(',')[0];
      }
      return address ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress;
    },

    date: function () {
      return moment().format('YYYY-MM-DD');
    },

    time: function () {
      return moment().format('HH:mm:ss');
    },

    day: function () {
      var str = '日一二三四五六';
      return '周' + str[new Date().getDay()];
    },

    method: function (req) {
      return req.method;
    },

    url: function (req) {
      return req.url;
    },

    httpVersion: function (req) {
      return req.httpVersion;
    },

    status: function (req, res) {
      var code = res.statusCode;
      if (code >= 400) {
        return '\x1b[31m' + code + '\x1b[0m';
      } else if (code >= 200) {
        return '\x1b[32m' + code + '\x1b[0m';
      }
    },

    userAgent: function (req) {
      return req.headers['user-agent'];
    },

    duration: function (req) {
      return Date.now() - req._start + 'ms';
    }
  }

  var formatString = function (req, res, str) {
    return str.replace(/:(\w+)/g, function (match, key) {
      return strategy[key] ? strategy[key](req, res) : match;
    });
  };

  if (typeof option == 'object' && option) {
    for (var i in option) {
      if (typeof option[i] == 'function') {
        strategy[i] = option[i];
      }
    }
  }

  return function (req, res, next) {
    req._start = Date.now();
    res.on('finish', function () {
      console.log(formatString(req, res, str));
    });
    next();
  };

}

module.exports = Logger;