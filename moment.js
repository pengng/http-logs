
function moment() {
  var d = new Date(...arguments);
  var format = function (str) {
    if (typeof str === 'string') {
      return str.replace(/(YYYY|YY|MM|DD|M|D|HH|H|mm|m|ss|s)/g, (match, pos, originalText) => {
        switch(match) {
          case 'YYYY':
            return this.getFullYear();
            break;
          case 'YY':
            return this.getYear();
            break;
          case 'MM':
            return this.toDouble(this.getMonth() + 1);
            break;
          case 'DD':
            return this.toDouble(this.getDate());
            break;
          case 'M':
            return this.getMonth() + 1;
            break;
          case 'D':
            return this.getDate();
            break;
          case 'HH':
            return this.toDouble(this.getHours());
            break;
          case 'H':
            return this.getHours();
            break;
          case 'mm':
            return this.toDouble(this.getMinutes());
            break;
          case 'm':
            return this.getMinutes();
            break;
          case 'ss':
            return this.toDouble(this.getSeconds());
            break;
          case 's':
            return this.getSeconds();
        }
      });
    } else {
      return this.toLocaleString();
    }
  }

  var fromNow = function () {
    var oldTime = this.getTime();
    var newTime = Date.now();
    var diff = parseInt(newTime - oldTime);
    switch(true) {
      case diff < 1000 * 60:
        return '刚刚';
        break;
      case diff >= 1000 * 60 && diff < 1000 * 60 * 60:
        return parseInt(diff / (1000 * 60)) + '分钟前';
        break;
      case diff >= 1000 * 60 * 60 && diff < 1000 * 60 * 60 * 24:
        return parseInt(diff / (1000 * 60 * 60)) + '小时前';
        break;
      case diff >= 1000 * 60 * 60 * 24 && diff < 1000 * 60 * 60 * 24 * 30:
        return parseInt(diff / (1000 * 60 * 60 * 24)) + '天前';
        break;
      case diff >= 1000 * 60 * 60 * 24 * 30 && diff < 1000 * 60 * 60 * 24 * 30 * 12:
        return parseInt(diff / (1000 * 60 * 60 * 24 * 30)) + '个月前';
        break;
      case diff >= 1000 * 60 * 60 * 24 * 30 * 12:
        return parseInt(diff / (1000 * 60 * 60 * 24 * 30 * 12)) + '年前';
    }
  }

  var toDouble = function (num) {
    return num < 10 ? '0' + num : num;
  }

  d.format = format;
  d.toDouble = toDouble;
  d.fromNow = fromNow;
  return d;
}

var Moment = function (timezone) {
  this.timezone = timezone;
  var that = this;

  return function () {
    var args = Array.prototype.slice.call(arguments);
    var d = moment.apply(null, args);
    return that.setTimezone(d);
  };

};

Moment.prototype.setTimezone = function (d) {
  var hours = parseInt(this.timezone.slice(1, 3));
  var minutes = parseInt(this.timezone.slice(3, 5));
  var offset = 0;
  if (this.timezone.slice(0, 1) == '-') {
    offset = d.getTimezoneOffset() - (hours * 60 + minutes);
  } else {
    offset = d.getTimezoneOffset() + (hours * 60 + minutes);
  }
  d.setHours(
    d.getHours() + parseInt(offset / 60),
    d.getMinutes() + (offset % 60)
  );
  return d;
}

moment.Moment = Moment;

module.exports = moment;