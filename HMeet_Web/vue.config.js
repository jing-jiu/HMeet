module.exports = {
    devServer: {
        https: true,
        proxy: {  //配置跨域
          '/socket': {
            target: 'https://localhost:3000', 
            changOrigin: true,  //允许跨域
            ws: true,
            pathRewrite: {
              '^/socket': '' 
            }
          },
        }
      },
}