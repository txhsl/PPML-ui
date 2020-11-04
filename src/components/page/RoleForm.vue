<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-people"></i> 角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="当前身份">
                        {{this.current}}
                    </el-form-item>
                    <el-form-item label="角色名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="checkVisible=true">验证权限</el-button>
                        <el-button type="primary" @click="registerVisible=true">添加用户</el-button>
                        <el-button type="primary" @click="onCreate()">创建新角色</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <el-dialog title="权限验证" :visible.sync="checkVisible" width="30%">
            <el-form ref="check" :model="check" label-width="100px">
                <el-form-item label="数据集名称">
                    <el-input v-model="check.data"></el-input>
                </el-form-item>
                <el-form-item label="权限类型">
                    <el-switch v-model="check.isRead" active-text="访问" inactive-text="维护"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="checkVisible=false">取消</el-button>
                <el-button type="primary" @click="onCheck">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="添加用户" :visible.sync="registerVisible" width="30%">
            <el-form ref="register" :model="register" label-width="100px">
                <el-form-item label="用户地址">
                    <el-input v-model="register.user"></el-input>
                </el-form-item>
                <el-form-item label="对方公钥">
                    <el-input v-model="register.pubkey"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="registerVisible=false">取消</el-button>
                <el-button type="primary" @click="onRegister">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'baseform',
        data: function(){
            return {
                current: '',
                form: {
                    name: ''
                },

                check: {
                    data: '',
                    isRead: ''
                },
                checkVisible: false,

                register: {
                    user: '',
                    pubkey: ''
                },
                registerVisible: false
            }
        },
        mounted(){
            this.getCurrent();
        },
        methods: {
            getCurrent() {
                this.$axios.post('/service/dataset/getRole', {
                    user: localStorage.getItem('ms_username')
                }).then(res => {
                    this.current = res.data.role;
                }).catch(err => {
                    this.$message.error('Error!');
                })
            },
            onCheck() {
                if (this.check.isRead) {
                    this.$axios.post('/service/dataset/checkReader', {
                        role: this.form.name,
                        data: this.check.data
                    }).then(res => {
                        this.$alert('权限验证结果为：' + res.data.isPermitted, '查询成功', {
                            confirmButtonText: '确定',
                        });
                    }).catch(err => {
                        this.$message.error('Error!');
                    })
                }
                else {
                    this.$axios.post('/service/dataset/checkWriter', {
                        role: this.form.name,
                        data: this.check.data
                    }).then(res => {
                        this.$alert('权限验证结果为：' + res.data.isPermitted, '查询成功', {
                            confirmButtonText: '确定',
                        });
                    }).catch(err => {
                        this.$message.error('Error!');
                    })
                }

                this.checkVisible = false;
            },
            onRegister() {
                this.$axios.post('/service/dataset/registerUser', {
                    role: this.form.name,
                    user: this.register.user,
                    userPubKey: this.register.pubkey
                }).then(res => {
                    this.$alert('新的用户为：' + res.data.user, '添加成功', {
                        confirmButtonText: '确定',
                    });
                }).catch(err => {
                    this.$message.error('Error!');
                })

                this.registerVisible = false;
            },
            onCreate() {
                this.$axios.post('/service/dataset/createRole', {
                    role: this.form.name
                }).then(res => {
                    this.$alert('新的角色为：' + res.data.role, '创建成功', {
                        confirmButtonText: '确定',
                    });
                }).catch(err => {
                    this.$message.error('Error!');
                })

                this.createVisible = false;
            },
        }
    }
</script>