const path = require('path')
module.exports = {
    devServer: {
        open: true,
        host: 'localhost',
        https: false,
        hotOnly: false,
        port: 8000, // 自定义修改8080端口
        // 代理跨域
        proxy: {
         '/v1': {
          target: 'http://cangdu.org:8001',
          changeOrigin: true
         },
         '/img': {
            target: 'http://cangdu.org:8001',
            changeOrigin: true
           }
        }
       }
}
