<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="10">
                <el-card shadow="hover" class="mgb20" style="height:300px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">账户: <span>{{name}}</span></div>
                    <div class="user-info-list">余额: <span>{{balance.toFixed(2)}} Ether</span></div>
                    <div class="user-info-list">信用评分: <span>{{level}}</span></div>
                </el-card>
                <el-card shadow="hover" style="height:520px;">
                    <div slot="header" class="clearfix">
                        <span>后台任务统计</span>
                    </div>
                    <div v-for="name in this.roleNames" :key="name">{{name}}
                        <el-progress :percentage="calculatePercentage(roleTxCounts[roleNames.indexOf(name)])" :color="colors[roleNames.indexOf(name)]"></el-progress>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="14">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{roleNames.length}}</div>
                                    <div>角色数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-apps grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{propertyCount}}</div>
                                    <div>属性数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{txCount}}</div>
                                    <div>任务数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:473px;">
                    <schart ref="line" class="schart" canvasId="line" :data="data" type="line" :options="options"></schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../common/bus';
    export default {
        name: 'dashboard',
        data() {
            return {
                name: localStorage.getItem('ms_username'),
                balance: 0,
                level:0,
                rcAddr: '',
                roles: {},
                roleNames: [],
                roleTxCounts: [],
                height: 0,
                heightTxCount: 0,
                leaders: ["0x6a2fb5e3bf37f0c3d90db4713f7ad4a3b2c24111", "0x38a5d4e63bbac1af0eba0d99ef927359ab8d7293", "0x40b00de2e7b694b494022eef90e874f5e553f996",
                            "0x49e2170e0b1188f2151ac35287c743ee60ea1f6a", "0x86dec6586bfa1dfe303eafbefee843919b543fd3", "0x135b8fb39d0f06ea1f2466f7e9f39d3136431480", "0x329b81e0a2af215c7e41b32251ae4d6ff1a83e3e",
                            "0x370287edd5a5e7c4b0f5e305b00fe95fc702ce47", "0x5386787c9ef76a235d27f000170abeede038a3db", "0xb41717679a04696a2aaac280d9d45ddd3760ff47", "0xcdfea5a11062fab4cf4c2fda88e32fc6f7753145"],
                propertyCount: 0,
                txCount: 0,
                data: [{
                    name: '',
                    value: 0,
                }],
                options: {
                    title: '后台任务处理状况',
                    showValue: false,
                    fillColor: 'rgb(45, 140, 240)',
                    bottomPadding: 30,
                    topPadding: 30
                },
                colors: ["#42b983", "#f1e05a", "#f56c6c", "#409eff", "#909399", "#982bbf"]
            }
        },
        components: {
            Schart
        },
        computed: {
            role() {
                if (this.name === '0x6a2fb5e3bf37f0c3d90db4713f7ad4a3b2c24111') {
                    return '系统管理员';
                }
                else if (this.leaders.includes(this.name)) {
                    return this.roleNames[this.leaders.indexOf(this.name)] + '管理员';
                }
                else {
                    for(var name in this.roles) {
                        if (this.roles[name] === this.rcAddr) {
                            return name + '普通用户';
                        }
                    }
                    return "游客";
                }
            }
        },
        created(){
            this.handleListener();
        },
        mounted(){
            this.$axios.get("/service/system/getRoleNames")
                .then(res => {
                    this.roleNames = ["系统管理员"];
                    res.data.forEach(name => {
                        this.roleNames.push(name);
                    })
                });
            this.$axios.get("/service/system/getRoles")
                .then(res => {
                    this.roles = res.data;
                });
            this.$axios.get("/service/system/getPropertyNames")
                .then(res => {
                    this.propertyCount = res.data.length;
                });
            this.$axios.get("/service/transaction/completed")
                .then(res => {
                    this.txCount = res.data.length;
                });
            this.$axios.get("/service/system/getRole/" + this.name)
                .then(res => {
                    this.rcAddr = res.data;
                });
            this.$axios.get("/service/transaction/balance")
                .then(res => {
                    this.balance = res.data;
                });
            this.$axios.get("/service/arbitration/level/" + this.name)
                .then(res => {
                    this.level = res.data;
                });
            this.$axios.get("/service/transaction/completed/address")
                .then(res => {
                    this.roleTxCounts = res.data;
                });
            this.$axios.get("/service/transaction/completed/height")
                .then(res => {
                    this.height = res.data.height;
                    this.heightTxCount = res.data.recent;
                    this.data = [];
                    var start = this.height - this.heightTxCount.length;
                    this.heightTxCount.forEach(element => {
                        this.data.push({
                            name: ++start,
                            value: element
                        })
                    });
                });
        },
        activated(){
            this.handleListener();
        },
        deactivated(){
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },
        methods: {
            handleListener(){
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
            },
            handleBus(msg){
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart(){
                this.$refs.bar.renderChart();
                this.$refs.line.renderChart();
            },
            calculatePercentage(count){
                return this.txCount == 0 ? 0 : (100*count/this.txCount).toFixed(1);
            }
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

</style>
