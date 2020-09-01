<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-qrcode"></i> 数据管理</el-breadcrumb-item>
                <el-breadcrumb-item>写入</el-breadcrumb-item>
                <el-breadcrumb-item>批量写入</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-row v-for="(item,index) in form" :key="index">
                    <el-form ref="form" :model="item" label-width="120px">
                        <el-form-item label="属性名">
                            <el-select v-model="item.name" placeholder="">
                                <el-option v-for="property in properties" :value="property" :key="property" name="form.name">
                                    {{property}}
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-for="(single,dindex) in item.data" :key="dindex">
                            <el-card>
                                <el-form-item label="数据ID">
                                    <el-input v-model="single.id"></el-input>
                                </el-form-item>
                                <el-form-item label="数据内容">
                                    <el-input type="textarea" rows="5" v-model="single.desc"></el-input>
                                </el-form-item>
                            </el-card>
                        </el-form-item>
                        <el-form-item label=" ">
                            <el-button type="success" circle @click="addId(index)"><i class="el-icon-lx-add"></i></el-button>
                            <el-button type="danger" circle @click="deleteId(index)"><i class="el-icon-lx-move"></i></el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
                <el-row>
                    <el-form ref="form" label-width="80px">
                        <el-form-item>
                            <el-button-group>
                                <el-button type="success" @click="addProperty()"><i class="el-icon-lx-add"></i>增加表单</el-button>
                                <el-button type="danger" @click="deleteProperty()">减少表单<i class="el-icon-lx-move"></i></el-button>
                            </el-button-group>
                        </el-form-item>
                    </el-form>
                </el-row>
                <el-form label-width="80px">
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
                form: [{
                    name: '',
                    data: [{
                        id: '',
                        desc: ''
                    }]
                }],
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
                var swapper = function(content) {
                    this.data = content
                }
                var req = {};
                this.form.forEach(property => {
                    var part = {};
                    property.data.forEach(single => {
                        part[single.id] = { data: single.desc };
                    });
                    req[property.name] = part;
                });

                this.$axios.post("/service/data/writeMultiple", {
                    data: req,
                }).then(res => {
                    this.$message.success('Success! Snapshot ID: ' + res.data);
                }).catch(err => {
                    this.$message.error('Error!');
                })
            },
            addProperty() {
                this.form.push({
                    name: '',
                    data: [{
                        id: '',
                        desc: ''
                    }]
                });
            },
            addId(index) {
                this.form[index].data.push({
                        id: '',
                        desc: ''
                    });
            },
            deleteProperty() {
                this.form.pop();
            },
            deleteId(index) {
                this.form[index].data.pop();
            }
        }
    }
</script>