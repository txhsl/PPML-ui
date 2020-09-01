<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-qrcode"></i> 数据管理</el-breadcrumb-item>
                <el-breadcrumb-item>查询</el-breadcrumb-item>
                <el-breadcrumb-item>精确查询</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item v-for="(name,index) in form.names" :key="index" :label="getPropertyLabel(index+1)">
                        <el-select v-model="form.names[index]" placeholder="">
                            <el-option v-for="item in properties" :value="item" :key="item" name="form.names[index]">
                                {{item}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" circle @click="addProperty()"><i class="el-icon-lx-add"></i></el-button>
                        <el-button type="danger" circle @click="deleteProperty()"><i class="el-icon-lx-move"></i></el-button>
                    </el-form-item>
  
                    <el-form-item v-for="(id,index) in form.ids" :key="index" :label="getIdLabel(index+1)">
                        <el-input v-model="form.ids[index]"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" circle @click="addId()"><i class="el-icon-lx-add"></i></el-button>
                        <el-button type="danger" circle @click="deleteId()"><i class="el-icon-lx-move"></i></el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <el-button>Cancel</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" label-width="80px">
                    <el-form-item label="结果">
                        <el-table :data="result" border class="table" ref="multipleTable">
                            <el-table-column prop="id" label="数据ID" sortable>
                            </el-table-column>
                            <el-table-column prop="name" label="属性名">
                            </el-table-column>
                            <el-table-column prop="data" label="数据内容">
                            </el-table-column>
                            <el-table-column prop="status" label="数据状态">
                            </el-table-column>
                        </el-table>
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
                    names: [''],
                    ids: ['']
                },
                properties:[],
                result: []
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
                this.$axios.post("/service/data/readMultiple", {
                    ids: this.form.ids,
                    propertyNames: this.form.names
                }).then(res => {
                    this.$message.success('Success!');
                    var temp = [];
                    for(var property in res.data.data) {
                        var single = res.data.data[property];
                        for (var id in single) {
                            temp.push({
                                id: id,
                                name: property,
                                data: single[id].data,
                                status: single[id].status
                            });
                        }
                    }
                    this.result = temp;
                });
            },
            addProperty() {
                this.form.names.push('');
            },
            addId() {
                this.form.ids.push('');
            },
            deleteProperty() {
                this.form.names.pop();
            },
            deleteId() {
                this.form.ids.pop();
            },
            getPropertyLabel(index) {
                return "属性名"+index;
            },
            getIdLabel(index) {
                return "数据ID"+index;
            }
        }
    }
</script>