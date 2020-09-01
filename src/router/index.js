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
                    path: '/permission',
                    component: resolve => require(['../components/page/PermissionTable.vue'], resolve),
                    meta: { title: '权限一览' }
                },
                {
                    path: '/role',
                    component: resolve => require(['../components/page/RoleTable.vue'], resolve),
                    meta: { title: '角色一览'}
                },
                {
                    path: '/property',
                    component: resolve => require(['../components/page/PropertyTable.vue'], resolve),
                    meta: { title: '属性一览', leaderPermission: true }
                },
                {
                    path: '/read',
                    component: resolve => require(['../components/page/ReadForm.vue'], resolve),
                    meta: { title: '简单查询' }
                },
                {
                    path: '/readMultiple',
                    component: resolve => require(['../components/page/ReadMulForm.vue'], resolve),
                    meta: { title: '精确查询' }
                },
                {
                    path: '/write',
                    component: resolve => require(['../components/page/WriteForm.vue'], resolve),
                    meta: { title: '简单写入' }
                },
                {
                    path: '/writeMultiple',
                    component: resolve => require(['../components/page/WriteMulForm.vue'], resolve),
                    meta: { title: '批量写入' }
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
                    path: '/auditUser',
                    component: resolve => require(['../components/page/AuditUserForm.vue'], resolve),
                    meta: { title: '用户审计' }
                },
                {
                    path: '/auditProperty',
                    component: resolve => require(['../components/page/AuditPropertyForm.vue'], resolve),
                    meta: { title: '属性审计' }
                },
                {
                    path: '/report',
                    component: resolve => require(['../components/page/ReportForm.vue'], resolve),
                    meta: { title: '发送举报' }
                },
                {
                    path: '/arbitrate',
                    component: resolve => require(['../components/page/ArbitrateForm.vue'], resolve),
                    meta: { title: '处理举报' }
                },

                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '图片上传' }   
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
            path: '/register',
            component: resolve => require(['../components/page/Register.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
