import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";

Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('ms_username');
    
    if (!role && to.path !== '/login' && to.path !== '/register') {
        next('/login');
    } else if (to.meta.adminPermission) {
        role === '0x6a2fb5e3bf37f0c3d90db4713f7ad4a3b2c24111' ? next() : next('/403');
    } else if (to.meta.leaderPPermission) {
        ["0xdb2bbab1d9eca60c937aa9c995664f86b3da2934", "0xcdfea5a11062fab4cf4c2fda88e32fc6f7753145",
            "0x329b81e0a2af215c7e41b32251ae4d6ff1a83e3e", "0x370287edd5a5e7c4b0f5e305b00fe95fc702ce47",
            "0x40b00de2e7b694b494022eef90e874f5e553f996", "0x49e2170e0b1188f2151ac35287c743ee60ea1f6a",
            "0x38a5d4e63bbac1af0eba0d99ef927359ab8d7293", "0xb41717679a04696a2aaac280d9d45ddd3760ff47",
            "0x5386787c9ef76a235d27f000170abeede038a3db", "0x135b8fb39d0f06ea1f2466f7e9f39d3136431480"].includes(role) ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
})


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')