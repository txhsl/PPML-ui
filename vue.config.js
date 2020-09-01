module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api': {
                target:'http://jsonplaceholder.typicode.com',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            },
            '/service': {
                target:'http://localhost:8090',
                changeOrigin:true,
                pathRewrite:{
                    '/service':''
                }
            }
        }
    }
}