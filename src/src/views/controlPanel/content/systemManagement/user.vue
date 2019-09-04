<template>
    <div class="user-container">
        <el-card class="card1">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" v-if="show">
                <el-form-item label="用户状态">
                    <el-select v-model="formInline.type" placeholder="所属类型">
                        <el-option label="不可用" value="0"></el-option>
                        <el-option label="可用" value="1"></el-option>
                        <el-option label="所有" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="登录账号">
                    <el-input v-model="formInline.accountName" placeholder="登录账号"></el-input>
                </el-form-item>
                <el-form-item label="用户姓名">
                    <el-input v-model="formInline.realName" placeholder="用户姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSearch()">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="clearAll()">清空</el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="true" :model="formInline2" class="demo-form-inline2" size="small">
                <el-form-item>
                    <el-button type="primary" @click="newAdd()"><i class="el-icon-plus" @click="newAdd()"></i> 新增</el-button>
                    <el-button type="danger" @click="deleteAll()"><i class="el-icon-delete" @click="deleteAll()"></i> 删除</el-button>
                    <el-button @click="pwdRefresh()"><i class="el-icon-refresh" @click="pwdRefresh()"></i>密码重置</el-button>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                        <el-button icon="el-icon-refresh" type="info" circle @click="clearAll();getAllMemberList()"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="显隐" placement="top">
                        <el-button icon="el-icon-menu" type="warning" circle></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="搜索" placement="top">
                        <el-button icon="el-icon-search" type="success" circle @click="hideSearchItem()"></el-button>
                    </el-tooltip>
                </el-form-item>
            </el-form>
            <div class="table-section">
                <span>当前表格已选择 {{number}} 项  </span>
                <el-button type="text" style="color:rgb(14,122,162)" @click="toggleSelection()">清空</el-button>
                <el-table 
                    :data="tableData" 
                    :header-cell-style="tableHeaderColor"
                    ref="multipleTable"
                    style="width: 100%;" 
                    border
                    size="small"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" width="50" align="center"></el-table-column>
                    <el-table-column prop="accountName" label="账号" width="150" align="center"></el-table-column>
                    <el-table-column
                        prop="admin"
                        label="所属角色"
                        width="150"
                        :filters="[{ text: '组织管理员', value: '组织管理员' }, { text: '组织普通用户', value: '组织普通用户' }]"
                        :filter-method="filterTag"
                        filter-placement="bottom-end"
                        align="center">
                        <template slot-scope="scope">
                            <el-tag
                                :type="scope.row.admin === '组织管理员' ? 'primary' : 'success'"
                                disable-transitions>{{scope.row.admin}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" label="成员ID" width="350" align="center"></el-table-column>
                    <el-table-column prop="realName" label="姓名" width="140" align="center"></el-table-column>
                    <el-table-column
                        prop="stage"
                        label="用户状态"
                        width="120"
                        :filters="[{ text: '无效', value: '无效' }, { text: '正常', value: '正常' }, { text: '审核中', value: '审核中' }]"
                        :filter-method="filterTag"
                        filter-placement="bottom-end"
                        align="center">
                        <template slot-scope="scope">
                            <el-tag
                                :type="chooseType(scope)"
                                disable-transitions>{{scope.row.stage}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createdTime" label="创建时间" width="240" sortable align="center"></el-table-column>
                    <el-table-column prop="tel" label="手机" width="180" align="center"></el-table-column>
                    <el-table-column prop="email" label="邮箱" width="200" align="center"></el-table-column>
                    <el-table-column prop="other" label="其它" min-width="200" align="center"></el-table-column>
                    <el-table-column label="操作" fixed="right" align="center" min-width="230">
                        <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-view"
                            @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[8, 15, 20, 30]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="userTotal"
                    style="text-align:right;margin-top:10px;">
                </el-pagination>
            </div>
        </el-card>

        <!-- 新增、查看、编辑按钮弹出的嵌套表单的dialog -->
		<el-dialog :title="this.dialogTitle" :visible.sync="dialogFormVisible" width="840px" @close="closeDialog('form')">
			<el-form :model="form" ref="form" :inline="true" :rules="rules" :disabled="disabled" style="margin-left:10px;padding-bottom:50px">
                <el-form-item label="登录账号" :label-width="formLabelWidth" prop="accountName">
                    <el-input v-model="form.accountName" placeholder="请输入 登录账号" style="width:285px"></el-input>
                </el-form-item>
                <el-form-item label="用户姓名" :label-width="formLabelWidth" prop="realName">
                    <el-input v-model="form.realName" placeholder="请输入 用户姓名" style="width:285px"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth" prop="pwd">
                    <el-input v-model="form.pwd" placeholder="请输入 密码" style="width:285px"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" :label-width="formLabelWidth" prop="pwdagain">
                    <el-input v-model="form.pwdagain" placeholder="请确认 密码" style="width:285px"></el-input>
                </el-form-item>
                <el-form-item label="用户性别" :label-width="formLabelWidth" prop="sex">
                    <el-select v-model="form.sex" placeholder="请选择 用户性别" style="width:285px">
                        <el-option label="男" value="men"></el-option>
                        <el-option label="女" value="women"></el-option>
                        <el-option label="未知" value="null"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属角色" :label-width="formLabelWidth" prop="roleId">
                    <el-input v-model="form.roleId" placeholder="请确认 所属角色" style="width:285px"></el-input>
                </el-form-item>
                <el-form-item label="手机号" :label-width="formLabelWidth" prop="phoneNumber">
                    <el-input v-model="form.phoneNumber" placeholder="请输入 手机号" style="width:285px"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱" :label-width="formLabelWidth" prop="userEmail">
                    <el-input v-model="form.userEmail" placeholder="请输入 用户邮箱" style="width:285px"></el-input>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="medium" @click="addDictionary('form')">保 存</el-button>
				<el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
			</div>
		</el-dialog>
    </div>
</template>

<script>
export default {
    name: 'topbar',
    data() {
        var checkPass = (rule, value, callback) => {
            if(!value){
                return callback(new Error('请确认密码'));
			}
			if(value!=this.form.pwd){
				return callback(new Error('两次输入密码不一致'));
			}
            callback();
        };
        return {
            show: true,
            formInline: {
                type: '1',
                accountName: '',
                realName: ''
            },
            formInline2: {},
            tableData: [],
            multipleSelection: [],
            number: 0,
            rowinfo: {
				id: 0
            },
            ids: '',
            dialogTitle: '',
            //分页信息
            currentPage: 1,
            userTotal: 0,
            pageSize: 8,
            //增删改弹出框信息
			dialogFormVisible: false,
			formLabelWidth: '90px',
			disabled: false,
			form: {},
			rules: {
				accountName: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
				realName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
                pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				pwdagain: [{ required: true, validator: checkPass, trigger: 'blur' }],
                roleId: [{ required: true, message: '请输入所属角色', trigger: 'blur' }],
                phoneNumber: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
                userEmail: [{ required: true, message: '请输入用户邮箱', trigger: 'blur' }],
            },
        };
    },
    mounted() {
        this.$nextTick( function(){
            this.getAllMemberList(1)
        })
    },
    methods: {
        //得到所有用户
        getAllMemberList() {
            var Params = {
                page: this.currentPage,
                size: this.pageSize,
            }
            var Params2 = {
                accountName: this.formInline.accountName,
                realName: this.formInline.realName,
                // userEmail: '',
                // phoneNumber: '',
                status: this.formInline.type
            }
            if(this.formInline.type==2)
                Params2.status = null
            var Params3 = {
                Authorization: this.$store.state.user.token
            }
            console.log(Params2)
            this.$ajax({
                url:'/dev-api/sys/user/list',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                params: Params,
                data: Params2,
                headers: Params3
            }).then( res => {
                console.log(res.data)
                if(res.data.status=="200") {
                    this.tableData = res.data.obj.list
                    this.userTotal = res.data.obj.total
                    for(var i=0;i<this.tableData.length;i++) {
                        if(this.tableData[i].admin==1)
                            this.tableData[i].admin="组织管理员"
                        else if(this.tableData[i].admin==0)
                            this.tableData[i].admin="组织普通用户"
                        if(this.tableData[i].stage==0)
                            this.tableData[i].stage="无效"
                        else if(this.tableData[i].stage==1)
                            this.tableData[i].stage="正常"
                        else if(this.tableData[i].stage==2)
                            this.tableData[i].stage="审核中"
                    }
                }
                else {
                    this.$message.error(res.data.msg);
                }
            }).catch( error => {
                console.log()
            })
        },
        //table的标签
        filterTag(value, row) {
            return row.tag === value;
        },
        //el-tag颜色分配
        chooseType(scope) {
            if(scope.row.stage === '无效')
                return 'error'
            else if(scope.row.stage === '正常')
                return 'success'
            else 
                return 'warning'
        },
        //根据菜单名称和菜单编号模糊搜索
        onSearch() {
            this.getAllMemberList()
        },
        //清空按钮
        clearAll() {
            this.formInline.accountName = '',
            this.formInline.realName = ''
        },
        //隐藏搜索按钮
        hideSearchItem() {
            this.show = !this.show
        },
        //table的全选按钮
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //table的取消选择
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
            });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        //+新增按钮
		newAdd() {
            this.dialogFormVisible = true
            this.dialogTitle = "新增"
			this.form = {
                accountName: '',
                realName: '',
                pwd: '',
                roleId: 0,
                sex: '',
                phoneNumber: '',
                userEmail: '',
            }
            this.rowinfo.id = 0
        },
        //删除按钮
        deleteAll() {
            this.$message.warining("该功能暂不可用")
            // this.ids= ''
            // console.log(this.multipleSelection)
			// if(this.multipleSelection.length==0)
			// 	this.$message.error("请至少选择一行用户信息")
			// else{
			// 	for(var i=0;i<this.multipleSelection.length;i++) {
			// 		this.ids = this.ids+','+this.multipleSelection[i].id
			// 	}
			// 	this.ids=this.ids.substr(1);
			// 	console.log(this.ids)
			//     this.deleteAllMethods()
			// }
        },
        //密码重置按钮
        pwdRefresh() {
            console.log(this.multipleSelection)
			if(this.multipleSelection.length==0)
				this.$message.error("请至少选择一行用户信息")
			else{
                this.$confirm('确定将选择账号密码重置为123456?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //
                    // this.$message({
                    //     type: 'success',
                    //     message: '重置密码成功!'
                    // });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消密码重置'
                    });          
                });
            }
        },
        //table的查看、编辑和删除
        handleSee(index, row) {
            console.log(index, row);
            this.rowinfo = row
            this.dialogFormVisible = true
            this.dialogTitle = "查看"
            
            this.disabled = true
        },
        handleEdit(index, row) {
            console.log(index, row);
            this.rowinfo = row
            this.dialogFormVisible = true
            this.dialogTitle = "编辑"
            //
        },
        handleDelete(index, row) {
            console.log(index, row);
			this.ids = row.id
			this.deleteAllMethods()
        },
        //删除方法
		deleteAllMethods() {
            var Params = {
				userId: this.ids
			}
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            console.log(Params)
            this.$ajax({
                url:'/dev-api/sys/user/delete',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
				console.log(res)
				if(res.data.status==200) {
					this.$message.success("删除用户成功")
					this.getAllMemberList()
				}
				else
					this.$message.error(res.data.msg)
            }).catch( error => {
                console.log()
            })
        },
        //table的双色条纹
        tableRowClassName({row, rowIndex}) {
            if (rowIndex === 1) {
                return 'warning-row';
            } else if (rowIndex === 3) {
                return 'success-row';
            }
            return '';
        },
        //修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color:rgb(250,250,250);color:black'
            }
        },
        //table的分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize = val
            this.getAllMemberList()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val
            this.getAllMemberList()
        },

        //第一个dialog对话框----------------------------------------------------------------------------------------------------
		closeDialog(form) {
			this.$refs[form].resetFields();
			this.disabled = false
		},
    }
}
</script>

<style lang="scss" scoped>
.user-container {
    margin: 10px;
}
</style>
<style>
.user-container .el-card {
	min-height: 89vh;
}
.user-container .el-table .warning-row {
    background: oldlace;
}
.user-container .el-table .success-row {
    background: #f0f9eb;
}
  /* 更改element-UI按钮样式 */
.user-container .el-button--primary{
    color: #fff;
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);
}
.user-container .el-button--primary:hover{
    background-color: rgb(62,149,181);
    border-color: rgb(62,149,181);  
}
.user-container .el-button--primary:focus{
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);  
}
</style>
