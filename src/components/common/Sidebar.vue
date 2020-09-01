<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '系统状态'
                    },{
                        icon: 'el-icon-lx-group',
                        index: '1',
                        title: '权限管理',
                        subs: [
                            {
                                index: 'permission',
                                title: '权限一览'
                            },
                            {
                                index: 'role',
                                title: '角色一览'
                            },
                            {
                                index: 'property',
                                title: '属性一览'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-qrcode',
                        index: '2',
                        title: '数据管理',
                        subs: [
                            {
                                index: '2-1',
                                title: '写入',
                                subs: [
                                    {
                                        index: 'write',
                                        title: '简单写入'
                                    },
                                    {
                                        index: 'writeMultiple',
                                        title: '批量写入'
                                    }
                                ]
                            },
                            {
                                index: '2-2',
                                title: '查询',
                                subs: [
                                    {
                                        index: 'read',
                                        title: '简单查询'
                                    },
                                    {
                                        index: 'readMultiple',
                                        title: '精确查询'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-attention',
                        index: '3',
                        title: '后台管理',
                        subs: [
                            {
                                icon: 'el-icon-lx-sort',
                                index: 'transaction',
                                title: '后台任务'
                            },
                            {
                                icon: 'el-icon-lx-attention',
                                index: 'subscribe',
                                title: '后台监听'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-search',
                        index: '4',
                        title: '数据审计',
                        subs: [
                            {
                                index: '4-1',
                                title: '审计',
                                subs: [
                                    {
                                        index: 'auditProperty',
                                        title: '合约审计'
                                    },
                                    {
                                        index: 'auditUser',
                                        title: '用户审计'
                                    }
                                ]
                            },
                            {
                                index: '4-2',
                                title: '举报',
                                subs: [
                                    {
                                        index: 'report',
                                        title: '发送举报'
                                    },
                                    {
                                        index: 'arbitrate',
                                        title: '处理举报'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-message',
                        index: 'message',
                        title: '消息中心'
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
