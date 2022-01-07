const config = {
    mongoUrl: 'mongodb://localhost:27017/fuxin-koa2', //数据库连接地址（zhuli-koa2为数据库名称）
    api: '/api', //统一接口的前缀
    port: 3033, //监听端口号
    SECRET: 'zhulijinrong-koa2', //jwt密钥
    tokenTime: 3600 * 24 * 3 //token过期时间
}

module.exports = config
