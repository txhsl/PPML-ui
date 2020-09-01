<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-qrcode"></i> 数据管理</el-breadcrumb-item>
                <el-breadcrumb-item>写入</el-breadcrumb-item>
                <el-breadcrumb-item>简单写入</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="属性名">
                        <el-select v-model="form.name" placeholder="">
                            <el-option v-for="item in properties" :value="item" :key="item" name="form.name">
                                {{item}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据ID">
                        <el-input v-model="form.id"></el-input>
                    </el-form-item>
                    <el-form-item label="数据内容">
                        <el-input type="textarea" rows="5" v-model="form.desc"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'baseform',
        data: function(){
            return {
                form: {
                    name: '',
                    id: '',
                    desc: '',
                },
                properties:[]
            }
        },
        mounted(){
            this.$axios.get("/service/system/getPropertyNames")
                .then(res => {
                    this.properties = res.data;
                });
        },
        methods: {
            onSubmit() {
                this.$axios.post("/service/data/write", {
                    id: this.form.id,
                    propertyName: this.form.name,
                    data: this.form.desc
                }).then(res => {
                    this.$message.success('Success! Snapshot ID: ' + res.data);
                }).catch(err => {
                    this.$message.error('Error!');
                })
            }
        }
    }
</script>