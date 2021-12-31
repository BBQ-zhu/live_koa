const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')


// 直播服务
const NodeMediaServer = require('node-media-server');

// ffmpeg -re -i C:\Users\zWX990233\Desktop\video.mp4 -c copy -f flv rtmp://192.168.1.103:1935/live/home

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8001,
    mediaroot: './media',
    allow_origin: '*'
  },
  trans: {
    ffmpeg: './ffmpeg-gitHub/bin/ffmpeg.exe', // ffmpeg 播放器所在的路径
    tasks: [
      {
        app: "live",
        mp4: true,
        mp4Flags: '[movflags=frag_keyframe+empty_moov]',//必须这样设置 
        //'[movflags=frag_keyframe+empty_moov]'可以录制,//'[movflags=faststart]'不可以录制,
        // hls: true,
        // hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        // dash: true,
        // dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  }
};

var nms = new NodeMediaServer(config)
nms.run();


nms.on('preConnect', (id, args) => {

  console.log(1, '[直播服务中]', `id=${id} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postConnect', (id, args) => {
  console.log(2, '[直播服务中]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('doneConnect', (id, args) => {
  console.log(3, '[直播服务中]', `id=${id} args=${JSON.stringify(args)}`);
});












// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
