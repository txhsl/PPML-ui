<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-unlock"></i> 隐私数据管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="数据集名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onQuery">提交</el-button>
                        <el-button>取消</el-button>
                        <el-button type="primary" @click="onCreate">创建新数据集</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="container">
            <div class="form-box">
                <el-form ref="form" label-width="100px" v-show="this.show">
                    <el-form-item label="数据集信息">所有者：{{this.owner}}，分片数量：{{this.amount}}</el-form-item>
                    <el-form-item label="数据分片">
                        <el-table :data="results" border class="table" ref="multipleTable">
                            <el-table-column prop="number" label="编号" width="80px" sortable>
                            </el-table-column>
                            <el-table-column prop="name" label="分片名" width="160px">
                            </el-table-column>
                            <el-table-column prop="time" label="上传时间" width="140px">
                            </el-table-column>
                            <el-table-column prop="hash" label="文件哈希">
                            </el-table-column>
                            <el-table-column label="操作" width="160px">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="small" @click="onDownload(scope.$index, scope.row)">下载</el-button>
                                    <el-button type="danger" size="small" @click="onDecrypt(scope.$index, scope.row)">解密</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                    <el-form-item label="数据集操作">
                        <el-button type="primary" @click="uploadVisible=true">上传数据分片</el-button>
                        <el-button type="warning" @click="shareVisible=true">分享数据集</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <el-dialog title="分享数据集" :visible.sync="shareVisible" width="30%">
            <el-form ref="share" :model="share" label-width="80px">
                <el-form-item label="对方角色">
                    <el-input v-model="share.role"></el-input>
                </el-form-item>
                <el-form-item label="授权类型">
                    <el-switch v-model="share.isRead" active-text="读权限" inactive-text="写权限"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="shareVisible=false">取消</el-button>
                <el-button type="primary" @click="onShare">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="上传数据分片" :visible.sync="uploadVisible" width="30%">
            <el-form ref="upload" :model="upload" label-width="80px">
                <el-form-item label="文件选择">
                    <el-upload
                        action="/service/dataset/upload"
                        :limit="1"
                        :file-list="upload.fileList"
                        :on-success="onUpload">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload> 
                </el-form-item>
                <el-form-item label="文件名">
                    <el-input v-model="upload.fileName" disabled></el-input>
                </el-form-item>
                <el-form-item label="文件哈希">
                    <el-input v-model="upload.hash" disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="uploadVisible=false">取消</el-button>
                <el-button type="primary" @click="onAdd">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'baseform',
        data: function(){
            return {
                form: {
                    name: ''
                },
                dataset: '',
                owner: '',
                amount: 0,
                show: true,
                results: [{}],

                share:{
                    role: '',
                    isRead: true
                },
                shareVisible: false,

                upload:{
                    fileList: [],
                    hash: '',
                    fileName: ''
                },
                uploadVisible: false,

                filePath: ''
            }
        },
        mounted(){
        },
        methods: {
            onQuery() {
                this.$axios.post('/service/dataset/getAll', {
                    data: this.form.name
                }).then(res => {
                    this.amount = res.data.amount;
                    this.owner = res.data.owner;
                    this.results = res.data.volumes;

                    this.dataset = res.data.data;
                }).catch(err => {
                    this.$message.error('Error!');
                })

                this.show = true;
            },
            onCreate() {
                this.$axios.post('/service/dataset/createData', {
                    data: this.form.name
                }).then(res => {
                    this.$alert('新的数据集密文密钥为：' + res.data.dcKey, '创建成功', {
                        confirmButtonText: '确定',
                    });
                    this.dataset = res.data.data;
                }).catch(err => {
                    this.$message.error('Error!');
                })
            },
            onAdd() {
                this.$axios.post('/service/dataset/addVolume', {
                    data: this.dataset,
                    hash: this.upload.hash,
                    name: this.upload.fileName
                }).then(res => {
                    this.$alert('交易Hash为：' + res.data.tx, '添加成功', {
                        confirmButtonText: '确定',
                    });
                    this.uploadVisible = false;
                }).catch(err => {
                    this.$message.error('Error!');
                })
            },
            onUpload(res, file, fileList) {
                this.upload.fileName = file.name;
                this.upload.hash = res.hash;
            },
            onDownload(index, row) {
                this.$axios.post('/service/dataset/download', {
                    hash: row.hash,
                }).then(res => {
                    this.$alert('文件路径为：' + res.data.path, '下载成功', {
                        confirmButtonText: '确定',
                    });
                    this.filePath = res.data.path;
                }).catch(err => {
                    this.$message.error('Error!');
                })
            },
            onDecrypt(index, row) {
                this.$axios.post('/service/dataset/decrypt', {
                    data: this.dataset,
                    path: this.filePath,
                    name: row.name
                }).then(res => {
                    this.$alert('文件路径为：' + res.data.path, '解密成功', {
                        confirmButtonText: '确定',
                    });
                }).catch(err => {
                    this.$message.error('Error!');
                })
            },
            onShare() {
                if(this.share.isRead) {
                    this.$axios.post('/service/dataset/assignReader', {
                        data: this.dataset,
                        role: this.share.role,
                    }).then(res => {
                        this.$alert('交易Hash为：' + res.data.tx, '分享成功', {
                            confirmButtonText: '确定',
                        });
                        this.shareVisible = false;
                    }).catch(err => {
                        this.$message.error('Error!');
                    })
                }
                else {
                    this.$axios.post('/service/dataset/assignWriter', {
                        data: this.dataset,
                        role: this.share.role,
                    }).then(res => {
                        this.$alert('交易Hash为：' + res.data.tx, '分享成功', {
                            confirmButtonText: '确定',
                        });
                        this.shareVisible = false;
                    }).catch(err => {
                        this.$message.error('Error!');
                    })
                }
            }
        }
    }
</script>

<style>
.el-upload--text {
    height: 35px;
    width: 80px;
}
</style>