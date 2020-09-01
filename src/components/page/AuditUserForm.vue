<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-search"></i> 数据审计</el-breadcrumb-item>
                <el-breadcrumb-item>审计</el-breadcrumb-item>
                <el-breadcrumb-item>用户审计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="150px">
                    <el-form-item label="账户地址">
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="container">
            <label class="el-form-item__label">信用评分: {{level}}</label>
            <el-table :data="result" style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="search-table-expand">
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
                            <el-form-item label="交易目标">
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
                <el-table-column prop="to" label='交易目标'></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'baseform',
        data: function(){
            return {
                form: {
                    address: ''
                },
                result: [],
                level: ''
            }
        },
        methods: {
            onSubmit() {
                var url1 = "/service/arbitration/level/";
                var url2 = "/service/transaction/userHistory/";
                this.$axios.get(url1 + this.form.address).then(res => {
                    this.level = res.data;
                    this.$axios.get(url2 + this.form.address).then(res => {
                        this.$message.success('Success!');
                        this.result = res.data;
                    }).catch(err => {
                        this.$message.error('Error!');
                    });
                });
            }
        }
    }
</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
.search-table-expand {
    font-size: 0;
}
.search-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.search-table-expand .script {
    display: block;
    word-wrap:break-word;
    width: 800px;
}
.search-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
}
</style>