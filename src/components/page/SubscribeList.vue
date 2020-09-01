<template>
    <section class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-attention"></i> 后台管理</el-breadcrumb-item>
                <el-breadcrumb-item>后台监听</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="drag-box">
                <div class="drag-box-item">
                    <div class="item-title">已监听</div>
                    <draggable v-model="subscribed" @remove="removeHandle" :options="dragOptions">
                        <transition-group tag="div" id="subscribed" class="item-ul">
                            <div v-for="item in subscribed" class="drag-list" :key="item.id">
                                {{item.content}}
                            </div>
                        </transition-group>
                    </draggable>
                </div>
                <div class="drag-box-item">
                    <div class="item-title">未监听</div>
                    <draggable v-model="unsubscribed" @remove="removeHandle" :options="dragOptions">
                        <transition-group tag="div" id="unsubscribed" class="item-ul">
                            <div v-for="item in unsubscribed" class="drag-list" :key="item.id">
                                {{item.content}}
                            </div>
                        </transition-group>
                    </draggable>
                </div>
                <div class="drag-box-table">
                    <el-table :data="result" style="width: 100%">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="subscribe-table-expand">
                                    <el-form-item label="区块哈希">
                                        <span>{{ props.row.blockHash }}</span>
                                    </el-form-item>
                                    <el-form-item label="区块编号">
                                        <span>{{ props.row.blockNumber }}</span>
                                    </el-form-item>
                                    <el-form-item label="交易哈希">
                                        <span>{{ props.row.hash }}</span>
                                    </el-form-item>
                                    <el-form-item label="发送者">
                                        <span>{{ props.row.from }}</span>
                                    </el-form-item>
                                    <el-form-item label="交易对象">
                                        <span>{{ props.row.to }}</span>
                                    </el-form-item>
                                    <el-form-item label="Gas消耗">
                                        <span>{{ props.row.gas}}</span>
                                    </el-form-item>
                                    <el-form-item label="Nonce">
                                        <span>{{ props.row.nonce }}</span>
                                    </el-form-item>
                                    <el-form-item label="输入">
                                        <span class="script">{{ props.row.input }}</span>
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column label='交易哈希'>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.hash}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="from" label='发送者'></el-table-column>
                        <el-table-column prop="to" label='交易对象'></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import draggable from 'vuedraggable'
    export default {
        name: 'draglist',
        data() {
            return {
                result: [],
                dragOptions:{
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },
                subscribed: [],
                unsubscribed: []
            }
        },
        components:{
            draggable
        },
        methods: {
            removeHandle(event){
                if (event.from.id === 'unsubscribed' && event.to.id === 'subscribed') {
                    this.$axios.post("/service/transaction/subscribe", {
                        address: this.subscribed[event.newIndex].id
                    }).then(res => {
                        this.$message.success('Subscribed!');
                    });
                }
                else if (event.from.id === 'subscribed' && event.to.id === 'unsubscribed') {
                    this.$axios.post("/service/transaction/unsubscribe", {
                        address: this.unsubscribed[event.newIndex].id
                    }).then(res => {
                        this.$message.success('Unsubscribed!');
                    });
                }
            }
        },
        mounted() {
            this.subscribed = [];
            this.unsubscribed = [];
            this.result = [];
            this.$axios.get("/service/system/getRoles")
                .then(res => {
                    var part = [];
                    for (var name in res.data) {
                        part.push({content: name, id: res.data[name]});
                    }
                    return part;
                })
                .then(part => {
                    this.$axios.get("/service/system/getProperties")
                        .then(res => {
                            for (var name in res.data) {
                                part.push({content: name, id: res.data[name]});
                            }
                            return part;
                        })
                        .then(all => {
                            this.$axios.get("/service/transaction/subscribe")
                                .then(res => {
                                    all.forEach(element => {
                                        if (res.data[element.id]) {
                                            this.subscribed.push(element);
                                        }
                                        else {
                                            this.unsubscribed.push(element);
                                        }
                                    });

                                    for (var address in res.data) {
                                        res.data[address].forEach(tx => {
                                            this.result.push(tx);
                                        });
                                    }
                                });
                        });
                });
        },
    }

</script>

<style scoped>
    .drag-box{
        display: flex;
        user-select: none;
    }
    .drag-box-item {
        flex: 1;
        max-width: 210px;
        min-width: 180px;
        background-color: #eff1f5;
        margin-right: 16px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }
    .drag-box-table {
        flex: 1;
        min-width: 300px;
        height: 560px;
        overflow-y: scroll;
    }
    .item-title{
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }
    .item-ul{
        padding: 0 8px 8px;
        height: 500px;
        overflow-y: scroll;
    }
    .item-ul::-webkit-scrollbar{
        width: 0;
    }
    .drag-list {
        border: 1px #e1e4e8 solid;
        padding: 10px;
        margin: 5px 0 10px;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
    }
    .drag-list:hover {
        border: 1px solid #20a0ff;
    }
    .drag-title {
        font-weight: 400;
        line-height: 25px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .ghost-style{
        display: block;
        color: transparent;
        border-style: dashed
    }

    .message-title{
        cursor: pointer;
    }
    .handle-row{
        margin-top: 30px;
    }
    .subscribe-table-expand {
        font-size: 0;
    }
    .subscribe-table-expand span {
        width: 90px;
        color: #99a9bf;
    }
    .subscribe-table-expand .script {
        display: block;
        word-wrap:break-word;
        width: 500px;
    }
    .subscribe-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }
</style>
