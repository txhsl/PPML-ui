<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-file"></i> 数据集管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="数据集ID">
                        <el-input v-model="form.id"></el-input>
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
                                    <el-button type="danger" size="small" @click="onDecryptHash(scope.$index, scope.row)">解密</el-button>
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
                <el-form-item label="对方账户">
                    <el-input v-model="share.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="shareVisible=false">取消</el-button>
                <el-button type="primary" @click="onShare">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="解密分片Hash" :visible.sync="decryptVisible" width="30%">
            <el-form ref="share" :model="decrypt" label-width="140px">
                <el-form-item label="数据集分享密钥">
                    <el-input v-model="decrypt.reEncryptedKey"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="decryptVisible=false">取消</el-button>
                <el-button type="primary" @click="handleDecryptHash">确定</el-button>
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
                    id: ''
                },
                encryptedKey: '',
                owner: '',
                amount: 0,
                show: true,
                results: [{}],

                share:{
                    address: ''
                },
                shareVisible: false,

                upload:{
                    fileList: [],
                    hash: '',
                    fileName: ''
                },
                uploadVisible: false,

                decrypt: {
                    reEncryptedKey: '',
                    hash: ''
                },
                decryptVisible: false
            }
        },
        mounted(){
        },
        methods: {
            onQuery() {
                this.$axios.post('/service/dataset/get', {
                    encryptedKey: this.form.id
                }).then(res => {
                    this.amount = res.data.amount;
                    this.owner = res.data.owner;
                    this.results = res.data.volumes;

                    this.encryptedKey = res.data.encryptedKey;
                }).catch(err => {
                    this.$message.error('Error!');
                })

                this.show = true;
            },
            onCreate() {
                let randomKey = 'temp';
                this.$axios.post('/service/dataset/create', {
                    key: randomKey
                }).then(res => {
                    this.$alert('新的数据集ID为：' + res.data.encryptedKey, '创建成功', {
                        confirmButtonText: '确定',
                    });
                    this.form.id = res.data.encryptedKey;
                    this.encryptedKey = res.data.encryptedKey;
                }).catch(err => {
                    this.$message.error('Error!');
                })
            },
            onAdd() {
                this.$axios.post('/service/dataset/add', {
                    encryptedKey: this.encryptedKey,
                    hash: this.upload.hash,
                    name: this.upload.fileName
                }).then(res => {
                    this.$alert('新的数据分片Hash为：' + res.data.hash, '添加成功', {
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
                    hash: row.hash
                }).then(res => {
                    this.$alert('文件路径为：' + res.data.path, '下载成功', {
                        confirmButtonText: '确定',
                    });
                })
            },
            onDecryptHash(index, row) {
                this.decrypt.hash = row.hash;
                this.decryptVisible = true;
            },
            handleDecryptHash() {
                this.$axios.post('/service/dataset/decryptHash', {
                    encryptedKey: this.encryptedKey,
                    reEncryptedKey: this.decrypt.reEncryptedKey,
                    encryptedHash: this.decrypt.hash
                }).then(res => {
                    this.$alert('数据集分片明文Hash为：' + res.data.reEncryptedKey, '解密成功', {
                        confirmButtonText: '确定',
                    });
                })
            },
            onShare() {
                this.$axios.post('/service/dataset/share', {
                    encryptedKey: this.encryptedKey,
                    to: this.share.address
                }).then(res => {
                    this.$alert('数据集分享密钥为：' + res.data.reEncryptedKey, '分享成功', {
                        confirmButtonText: '确定',
                    });
                    this.shareVisible = false;
                })
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