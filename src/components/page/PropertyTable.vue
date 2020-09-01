<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-group"></i> 权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>属性一览</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="handleNew">新建属性</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="name" label="属性名" sortable>
                </el-table-column>
                <el-table-column prop="address" label="合约地址" :formatter="formatter">
                </el-table-column>
                <el-table-column label="操作" width="80" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleAssign(scope.$index, scope.row)" :disabled="checkDisabled()">授予权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="calculPage()">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="新建属性" :visible.sync="createVisible" width="30%">
            <el-form ref="form" :model="create" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="create.name"></el-input>
                </el-form-item>
                <el-form-item label="已有合约" v-if="false">
                    <el-switch v-model="create.useTemplate" disabled="false"></el-switch>
                    <el-tooltip class="item" effect="dark" placement="right">
                        <div slot="content">需满足以下ABI:
                            <br>[{
                            <br>&emsp;&emsp;"constant":true,
                            <br>&emsp;&emsp;"inputs":[{"name":"_id","type":"string"}],
                            <br>&emsp;&emsp;"name":"getFileNum",
                            <br>&emsp;&emsp;"outputs":[{"name":"","type":"string"}],
                            <br>&emsp;&emsp;"payable":false,"stateMutability":"pure","type":"function"
                            <br>},{
                            <br>&emsp;&emsp;"constant":false,
                            <br>&emsp;&emsp;"inputs":[{"name":"_FileId","type":"string"},{"name":"_hash","type":"string"}],
                            <br>&emsp;&emsp;"name":"writeDB",
                            <br>&emsp;&emsp;"outputs":[{"name":"","type":"string"}],
                            <br>&emsp;&emsp;"payable":false,"stateMutability":"nonpayable","type":"function"},
                            <br>{"constant":false,
                            <br>&emsp;&emsp;"inputs":[{"name":"_roleAddr","type":"address"}],
                            <br>&emsp;&emsp;"name":"setWriter",
                            <br>&emsp;&emsp;"outputs":[{"name":"","type":"address"}],
                            <br>&emsp;&emsp;"payable":false,"stateMutability":"nonpayable","type":"function"
                            <br>},{
                            <br>&emsp;&emsp;"constant":true,
                            <br>&emsp;&emsp;"inputs":[],
                            <br>&emsp;&emsp;"name":"getOwner",
                            <br>&emsp;&emsp;"outputs":[{"name":"","type":"address"}],
                            <br>&emsp;&emsp;"payable":false,"stateMutability":"view","type":"function"
                            <br>},{
                            <br>&emsp;&emsp;"constant":true,
                            <br>&emsp;&emsp;"inputs":[{"name":"_dataId","type":"string"}],
                            <br>&emsp;&emsp;"name":"readDB",
                            <br>&emsp;&emsp;"outputs":[{"name":"","type":"string"}],
                            <br>&emsp;&emsp;"payable":false,"stateMutability":"view","type":"function"
                            <br>},{
                            <br>&emsp;&emsp;"constant":true,
                            <br>&emsp;&emsp;"inputs":[{"name":"_roleAddr","type":"address"}],
                            <br>&emsp;&emsp;"name":"checkWriter",
                            <br>&emsp;&emsp;"outputs":[{"name":"","type":"bool"}],
                            <br>&emsp;&emsp;"payable":false,"stateMutability":"view","type":"function"
                            <br>},{
                            <br>&emsp;&emsp;"constant":false,
                            <br>&emsp;&emsp;"inputs":[{"name":"_roleAddr","type":"address"}],
                            <br>&emsp;&emsp;"name":"addReader",
                            <br>&emsp;&emsp;"outputs":[{"name":"","type":"bool"}],
                            <br>&emsp;&emsp;"payable":false,"stateMutability":"nonpayable","type":"function"
                            <br>},{
                            <br>&emsp;&emsp;"constant":true,
                            <br>&emsp;&emsp;"inputs":[{"name":"_roleAddr","type":"address"}],
                            <br>&emsp;&emsp;"name":"checkReader",
                            <br>&emsp;&emsp;"outputs":[{"name":"","type":"bool"}],
                            <br>&emsp;&emsp;"payable":false,"stateMutability":"view","type":"function"
                            <br>},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
                        </div>
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="合约地址" v-show="create.useTemplate">
                    <el-input v-model="create.address"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="createVisible = false">取消</el-button>
                <el-button type="primary" @click="applyNew">确定</el-button>
            </span>

        </el-dialog>

        <el-dialog title="授予权限" :visible.sync="assignVisible" width="30%">
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="目标角色">
                    <el-select v-model="form.name">
                        <el-option v-for="(address, name) in roles" :value="name" :key="name" name="form.name">
                                {{name}}
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限类型">
                    <el-select v-model="form.type">
                        <el-option key="1" label="读权限" value="Read"></el-option>
                        <el-option key="2" label="写权限" value="Write"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="assignVisible = false">取消</el-button>
                <el-button type="primary" @click="applyAssign">确定</el-button>
            </span>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: localStorage.getItem('ms_username'),
                tableData: [],
                sortedData: [],
                cur_page: 1,
                row_per_page: 10,
                multipleSelection: [],
                select_cate: '',
                select_status: '',
                select_word: '',
                del_list: [],
                createVisible: false,
                assignVisible: false,
                create: {
                    name: '',
                    useTemplate: false,
                    address: null
                },
                form: {
                    name: '',
                    type: ''
                },
                roles: [],
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                this.sortedData = this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.name.indexOf(this.select_word) > -1 ||
                                d.address.indexOf(this.select_word) > -1
                        ) {
                            return d;
                        }
                    }
                })

                return this.sortedData.slice(this.row_per_page*(this.cur_page-1), this.row_per_page*this.cur_page);
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            getData() {
                this.$axios.get('/service/user/getAdministrated')
                    .then((res) => {
                        for(var contract in res.data) {
                            this.tableData.push({
                                name: contract,
                                address: res.data[contract]
                            });
                        }
                    })

                this.$axios.get('/service/system/getRoles')
                    .then(res => {
                        this.roles = res.data;
                    })
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleNew(index, row) {
                this.idx = index;
                this.createVisible = true;
            },
            handleAssign(index, row) {
                this.idx = index;
                this.assignVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            applyNew(){
                this.$axios.post('/service/system/requestProperty', {
                    name: this.create.name,
                    admin: this.name,
                    address: this.create.address
                }).then(res => {
                    this.$message.success('Success!');
                }).catch(err => {
                    this.$message.error('Error!');
                })
                this.createVisible = false;
            },
            applyAssign(){
                var url = '';
                if (this.form.type == 'Read') {
                    url = '/service/user/permitReader';
                }
                else {
                    url = '/service/user/permitWriter';
                }
                this.$axios.post(url, {
                    propertyName: this.tableData[this.idx].name,
                    target: this.form.name
                }).then(res => {
                    this.$message.success('Success!');
                }).catch(err => {
                    this.$message.error('Error!');
                })

                this.assignVisible = false;
            },
            calculPage() {
                return this.sortedData.length;
            },
            checkDisabled() {
                return !(["0x6a2fb5e3bf37f0c3d90db4713f7ad4a3b2c24111", "0x38a5d4e63bbac1af0eba0d99ef927359ab8d7293", "0x40b00de2e7b694b494022eef90e874f5e553f996",
                            "0x49e2170e0b1188f2151ac35287c743ee60ea1f6a", "0x86dec6586bfa1dfe303eafbefee843919b543fd3", "0x135b8fb39d0f06ea1f2466f7e9f39d3136431480", "0x329b81e0a2af215c7e41b32251ae4d6ff1a83e3e",
                            "0x370287edd5a5e7c4b0f5e305b00fe95fc702ce47", "0x5386787c9ef76a235d27f000170abeede038a3db", "0xb41717679a04696a2aaac280d9d45ddd3760ff47", "0xcdfea5a11062fab4cf4c2fda88e32fc6f7753145"]
                            .includes(this.name));
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
