# http-logs

HTTP request log middleware

### Usage

```bash
npm i -S http-logs
```

```javascript
const app = require('express')()
const logger = require('http-logs')
app.use(logger())
app.listen(3000)

> GET / HTTP/1.1 200 1ms
```

### config

`logger([preset | token][,options])`

> 第一个参数是一个字符串，可以是[preset](#preset)，也可以是自定义的[token](#token)

#### preset

| preset | output | description |
| --- | --- | --- |
| normal | GET / HTTP/1.1 200 218ms | 默认 |
| tiny | GET / 200 | 简单 |
| long | [2017-05-14 21:03:25 周日] ::ffff:192.168.0.100 /index.html<br/>HTTP/1.1 304 23ms Mozilla/5.0 (Windows NT 6.1; Win64;<br/>x64) AppleWebkit/537.36 (KHTML, like Gecko)<br/> Chrome/58.0.3029.110 Safari/537.36 | 详细 |

#### token

| token | output | description |
| --- | --- | --- |
| method | GET | 请求方法 |
| url | /path/to/resource | 请求路径 |
| httpVersion | HTTP/1.1 | http版本 |
| status | 200 | 响应状态码 |
| duration | 28ms | 请求到输出完成的持续时间 |
| ip | ::ffff:192.168.0.100 | IP地址 |
| date | 2017-05-14 | 请求开始日期 |
| time | 19:00:00 | 请求开始时间 |
| day | 周日 | 请求开始星期 |
| userAgent | Mozilla/5.0 | 客户端用户代理内容 | 

```javascript
const token = '[:date :time] :method :url :httpVersion :status'
app.use(logger(token))

// [2017-05-14 19:23:33] GET /index.html HTTP/1.1 200
```

### options

重定义[token](#token)

```javascript
const token = '[:date :when :time] :method :url'
const options = {
  // 增加新的token类型when
  when: function (req, res) {
    return (new Date().getHours() >= 12) ? '下午' : '上午'
  },
  // 重写method
  method: function (req, res) {
    return req.method.toLowerCase()
  }
}
app.use(logger(token, options))
// [2017-05-14 上午 10:22:29] get /index.html
```