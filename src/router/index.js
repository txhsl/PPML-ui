import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '主页' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统状态' }
                },
                {
                    path: '/icon',
                    component: resolve => require(['../components/page/Icon.vue'], resolve),
                    meta: { title: '图标' }
                },
                {
                    path: '/pre',
                    component: resolve => require(['../components/page/PREForm.vue'], resolve),
                    meta: { title: '隐私数据管理' }
                },
                {
                    path: '/rbac',
                    component: resolve => require(['../components/page/RBACForm.vue'], resolve),
                    meta: { title: '公开数据管理' }
                },
                {
                    path: '/role',
                    component: resolve => require(['../components/page/RoleForm.vue'], resolve),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/message',
                    component: resolve => require(['../components/page/MessageTabs.vue'], resolve),
                    meta: { title: '消息中心' }
                },
                {
                    path: '/transaction',
                    component: resolve => require(['../components/page/TransactionTabs.vue'], resolve),
                    meta: { title: '后台任务' }
                },
                {
                    path: '/subscribe',
                    component: resolve => require(['../components/page/SubscribeList.vue'], resolve),
                    meta: { title: '后台监听' }
                },

                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: '基本图表' }
                }, 
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
