# express-req-logger
HTTP request logger middleware for Express.
## usage

```
npm i -S express-req-logger
```
```javascript
const express = require('express');
const logger = require('express-req-logger');
var app = express();
app.use(logger());
// GET / HTTP/1.1 200 367ms
```
## API
**logger(format, option)**

The `format` argument is a string, either `'tiny'`,`'normal'`, `'long'`, or something like that `':method :url HTTP/:httpVersion :status :duration'`.
## `format`
**normal** 
Default style.
```http
GET / HTTP/1.1 200 218ms
```

**tiny** 
Short style.
```http
GET / 200
```

**long**
Long style.
```http
[2017-05-14 21:03:25 周日] ::ffff:192.168.0.100 /index.html HTTP/1.1 304 23ms Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36
```

#### :method
HTTP request method. `GET`
#### :url
Request path. `/index.html`
#### :httpVersion
HTTP version number. `1.1`
#### :status
Request status code. `200`
#### :duration
Request to respond to the duration of the unit, in milliseconds. `263ms`
#### :ip
Remote client IP address. `::ffff:192.168.0.100`
#### :date
Current date. `2017-05-14`
#### :time
Current time. `19:00:00`
#### :day
Current week. `周日`
#### :userAgent
Remote client user agent content.


```javascript
const logger = require('express-req-logger');
var app = require('express')();
app.use(logger(
  '[:date :time] :method :url HTTP/:httpVersion :status'
));
// [2017-05-14 19:23:33] GET /index.html HTTP/1.1 200
```

## `option`
Used to modify the output of a field, or to add a field.
```javascript
app.use(logger(
  '[:date :when :time] :method :url'
), {
  // Add the new when field and add it to the format parameter.
  when: function (req, res) { // Can receive request and response object.
  return (new Date().getHours() >= 12) ? 'PM' : 'AM';
  },
  // Rewrite the method function
  method: function (req, res) {
  return req.method.toLowerCase();
  }
});
// [2017-05-14 上午 10:22:29] get /index.html
```

# express-req-logger
Express的HTTP请求日志中间件
## 使用方法
```
npm i -S express-req-logger
```
```javascript
const express = require('express');
const logger = require('express-req-logger');
var app = express();
app.use(logger());
```
## 接口
**logger(format, option)**

`format`参数是一个字符串，可以是预设的配置`'tiny'`、`'normal'`、`'long'`或者是类似`':method :url HTTP/:httpVersion :status :duration'`。

## `format`
**normal** 
默认风格。如下所示
```http
GET / HTTP/1.1 200 218ms
```

**tiny** 
简短风格
```http
GET / 200
```

**long**
长风格
```http
[2017-05-14 21:03:25 周日] ::ffff:192.168.0.100 /index.html HTTP/1.1 304 23ms Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36
```

#### :method
HTTP请求方法。`GET`
#### :url
请求路径。`/index.html`
#### :httpVersion
HTTP版本。`1.1`
#### :status
请求状态码。`200`
#### :duration
请求到响应持续的时间，单位为毫秒。`263ms`
#### :ip
客户端IP地址。`::ffff:192.168.0.100`
#### :date
当前日期。`2017-05-14`,本项目首次提交时间。
#### :time
当前时间。`19:00:00`
#### :day
当前星期。`周日`
#### :userAgent
客户端用户代理内容。


```javascript
const logger = require('express-req-logger');
var app = require('express')();
app.use(logger(
  '[:date :time] :method :url HTTP/:httpVersion :status'
));
// [2017-05-14 19:23:33] GET /index.html HTTP/1.1 200
```

## `option`
用于修改字段的输出，或增加字段。
```javascript
app.use(logger(
  '[:date :when :time] :method :url'
), {
  // 自己增加新的when字段，并加入到format参数中。
  when: function (req, res) { // 可接收到request和response对象。
  return (new Date().getHours() >= 12) ? '下午' : '上午';
  },
  // 重写method方法
  method: function (req, res) {
  return req.method.toLowerCase();
  }
});
// [2017-05-14 上午 10:22:29] get /index.html
```