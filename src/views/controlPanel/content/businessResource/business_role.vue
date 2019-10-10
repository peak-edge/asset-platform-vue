<template>
    <div class="businessrole-container">
        <el-card class="card1">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" v-if="show">
                <el-form-item label="角色名称">
                    <el-input v-model="formInline.roleNameZh" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色别名">
                    <el-input v-model="formInline.roleName" placeholder="角色别名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSearch()">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="clearAll()">清空</el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="true" :model="formInline2" class="demo-form-inline2" size="small">
                <el-form-item>
                    <el-button type="primary" @click="newAdd()"><i class="el-icon-plus"></i> 新增</el-button>
                    <el-button type="danger" @click="deleteAll()"><i class="el-icon-delete"></i> 删除</el-button>
                    <el-button @click="dialogAuthority()"><i class="el-icon-setting"></i> 权限设置</el-button>
                    <el-button type="warning" @click="exportExcel()"><i class="el-icon-download"></i> 导出excel</el-button>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                        <el-button icon="el-icon-refresh" type="info" circle @click="clearAll();getBusinessRoleList()"></el-button>
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
                    id="tableData"
                    :data="tableData" 
                    :header-cell-style="tableHeaderColor"
                    ref="multipleTable"
                    style="width: 100%; min-height:450px" 
                    border
                    size="small"
                    @selection-change="handleSelectionChange"
                    row-key="id"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" width="50" align="center"></el-table-column>
                    <el-table-column prop="roleNameZh" label="角色名称" min-width="140"></el-table-column>
                    <el-table-column prop="roleName" label="角色别名" sortable min-width="160"></el-table-column>
                    <el-table-column prop="id" label="角色ID" width="120"></el-table-column>
                    <el-table-column prop="sort" label="角色类型" min-width="120"></el-table-column>
                    <el-table-column prop="sceneName" label="场景名称" min-width="120"></el-table-column>
                    <el-table-column prop="roleDescription" label="描述" min-width="120"></el-table-column>
                    <el-table-column label="操作" fixed="right" align="center" min-width="230">
                        <template slot-scope="scope">
                        <!-- <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-view"
                            @click="handleSee(scope.$index, scope.row)">查看</el-button> -->
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-view"
                            @click="handleMember(scope.$index, scope.row)">角色成员</el-button>
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
                    :total="roleTotal"
                    style="text-align:right;margin-top:10px;">
                </el-pagination>
            </div>
        </el-card>

        <!-- 新增、查看、编辑按钮弹出的嵌套表单的dialog -->
		<el-dialog :title="this.dialogTitle" :visible.sync="dialogFormVisible" width="740px" @close="closeDialog('form')">
			<el-form :model="form" ref="form" :inline="true" :rules="rules" :disabled="disabled" style="margin-left:10px;padding-bottom:50px">
                <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleNameZh">
                    <el-input v-model="form.roleNameZh" placeholder="请输入 角色名称" style="width:580px"></el-input>
                </el-form-item>
                <el-form-item label="角色别名" :label-width="formLabelWidth" prop="roleName">
                    <el-input v-model="form.roleName" placeholder="请输入 角色别名" style="width:580px"></el-input>
                </el-form-item>
                <!-- <el-form-item label="上级角色" :label-width="formLabelWidth">
                    <el-input v-model="form.parentId" placeholder="请选择 上级角色" style="width:580px" @click.native="dialogFormVisible2=true;getTreeList()"></el-input>
                </el-form-item> -->
                <el-form-item label="角色排序" :label-width="formLabelWidth" prop="sort">
					<el-input-number v-model="form.sort" controls-position="right" @change="handleChange" :min="0" style="width:580px"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="medium" @click="addDictionary('form')">保 存</el-button>
				<el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
			</div>
		</el-dialog>

        <!-- 权限设置弹出框 -->
		<el-dialog title="角色权限配置" class="authorityDialog" :visible.sync="dialogFormVisible2" width="380px">
			<el-tabs type="border-card">
                <el-tab-pane label="菜单权限">
                    <el-tree
                        class="filter-tree"
                        :data="data"
                        show-checkbox
                        node-key="id"
                        ref="tree"
                        highlight-current
                        :default-expanded-keys="defaultObj"
                        :default-checked-keys="defaultObj"
                        :props="defaultProps">
                    </el-tree>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
				<el-button type="primary" size="medium" @click="getCheckedNodes">保 存</el-button>
				<el-button size="medium" @click="dialogFormVisible2 = false">取 消</el-button>
			</div>
		</el-dialog>

        <!-- 查看角色成员弹出框 -->
        <el-dialog title="角色成员" :visible.sync="dialogFormVisible3" width="1000px">
			<el-table 
                :data="tableData2" 
                :header-cell-style="tableHeaderColor"
                ref="multipleTable"
                style="width: 100%; min-height:450px" 
                border
                size="small">
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column prop="accountName" label="账号名称" min-width="90"></el-table-column>
                <el-table-column prop="realName" label="真实名称" min-width="100"></el-table-column>
                <el-table-column prop="id" label="成员ID" min-width="280"></el-table-column>
                <!-- <el-table-column prop="staffId" label="职业ID" min-width="200"></el-table-column>
                <el-table-column prop="roleId" label="角色ID" width="200"></el-table-column> -->
                <el-table-column prop="createdTime" label="创建时间" sortable min-width="160"></el-table-column>
                <!-- <el-table-column prop="other" label="描述(性别、生日、邮箱、地址等)" min-width="160"></el-table-column> -->
                <el-table-column label="操作" fixed="right" align="center" min-width="120">
                    <template slot-scope="scope">
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
            <div slot="footer" class="dialog-footer">
				<el-button type="primary" size="medium" @click="getCheckedNodes">添加成员</el-button>
				<el-button size="medium" @click="dialogFormVisible3 = false">取 消</el-button>
			</div>
		</el-dialog>
    </div>
</template>

<script>
export default {
    name: 'platform_role',
    data() {
        return {
            show: true,
            formInline: {
                roleNameZh: '',
                roleName: ''
            },
            formInline2: {},
            tableData: [],
            multipleSelection: [],
            number: 0,
            rowinfo: {
				id: 0
            },
            ids: "",
            dialogTitle: '',
            //分页信息
            currentPage:1,
            roleTotal: 0,
            pageSize: 8,
            //增删改弹出框信息
			dialogFormVisible: false,
			formLabelWidth: '90px',
			disabled: false,
			form: {},
			rules: {
				roleNameZh: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
				roleName: [{ required: true, message: '请输入角色别名', trigger: 'blur' }],
				sort: [{ required: true, message: '请输入角色排序', trigger: 'blur' }],
            },
            //权限设置弹出框
            dialogFormVisible2: false,
            data: [],
			defaultProps: {
				children: 'children',
				label: 'name'
            },
            defaultObj: [],
            //查看角色成员弹出框
            dialogFormVisible3: false,
            tableData2: [],
        }
    },
    mounted() {
        this.$nextTick( function(){
            this.getBusinessRoleList(1)
            this.getRoleMember(1)
        })
    },
    methods: {
        //得到业务角色管理的列表
		getBusinessRoleList() {
            var Params = {
                // roleNameZh: this.formInline.roleNameZh,
                // roleName: this.formInline.roleName,
                page: this.currentPage,
                size: this.pageSize
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/scene/role/list/all',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                this.roleTotal = res.data.data.total
				this.tableData = res.data.data.list
            }).catch( error => {
                console.log()
            })
        },
        //通过角色获取角色成员
        getRoleMember() {
            var Params = {
                roleId: '54'
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/scene/role/users/54',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
            }).catch( error => {
                console.log()
            })
        },
        //根据菜单名称和菜单编号模糊搜索
        onSearch() {
            this.getBusinessRoleList()
        },
        //清空按钮
        clearAll() {
            this.formInline.roleNameZh = '',
            this.formInline.roleName = ''
        },
        //隐藏搜索按钮
        hideSearchItem() {
            this.show = !this.show
        },
        //table的全选按钮
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.number = this.multipleSelection.length
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
                roleNameZh: '',
                roleName: '',
                sort: 0,
            }
            this.rowinfo.id = 0
        },
        //删除按钮
        deleteAll() {
            this.ids= ''
            console.log(this.multipleSelection)
			if(this.multipleSelection.length==0)
				this.$message.error("请至少选择一行角色信息")
			else{
				for(var i=0;i<this.multipleSelection.length;i++) {
					this.ids = this.ids+','+this.multipleSelection[i].id
				}
				this.ids=this.ids.substr(1);
				console.log(this.ids)
			    this.deleteAllMethods()
			}
        },
        //导出excel按钮
        exportExcel() {
            var fix = document.querySelector('.el-table__fixed');
            var workbook = XLSX.utils.book_new();
            if(fix){
                let table = document.querySelector("#tableData").cloneNode(true);
                var ws1 = XLSX.utils.table_to_sheet(table.removeChild(table.querySelector(".el-table__fixed")));
                XLSX.utils.book_append_sheet(workbook, ws1, "Sheet1");
            }
            else{
                var ws1 = XLSX.utils.table_to_sheet(document.querySelector("#tableData"));
                XLSX.utils.book_append_sheet(workbook, ws1, "Sheet1");
            }
            var wbout = XLSX.write(workbook, {
                bookType: "xlsx",
                bookSST: true,
                type: "array"
            });
            try {
                FileSaver.saveAs(
                    new Blob([wbout], { type: "application/octet-stream" }),
                    "Dictionary.xlsx"
                );
            } catch (e) {
                if (typeof console !== "undefined") console.log(e, wbout);
            }
            return wbout;
        },
        //table的查看、编辑和删除
		handleSee(index, row) {
			console.log(index, row);
			this.rowinfo = row
            this.dialogFormVisible = true
            this.dialogTitle = "查看"
			var obj = {}
			obj.roleNameZh = row.roleNameZh
			obj.roleName = row.roleName
			obj.sort = row.sort
			this.form = obj
			this.disabled = true
        },
        handleMember(index, row) {
            console.log(index, row)
            // this.rowinfo = row
            this.dialogFormVisible3 = true
            var Params = {
                roleId: row.id
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/scene/role/users/'+row.id,
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                this.tableData2 = res.data.data
            }).catch( error => {
                console.log()
            })

        },
        handleEdit(index, row) {
			console.log(index, row);
            this.rowinfo = row
            this.dialogFormVisible = true
            this.dialogTitle = "编辑"
			var obj = {}
			obj.roleNameZh = row.roleNameZh
			obj.roleName = row.roleName
			obj.sort = row.sort
			this.form = obj
        },
        handleDelete(index, row) {
			console.log(index, row);
			this.ids = row.id
			this.deleteAllMethods()
		},
        //删除方法
		deleteAllMethods() {
			var Params = {
				ids: this.ids
			}
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            console.log(Params)
            this.$ajax({
                url:'/dev-api/sys/role/remove',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
				console.log(res)
				if(res.data.code==200) {
					this.$message.success("删除平台角色成功")
					this.getBusinessRoleList()
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
            this.getBusinessRoleList()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val
            this.getBusinessRoleList()
        },

        //第一个dialog对话框----------------------------------------------------------------------------------------------------
		closeDialog(form) {
			this.$refs[form].resetFields();
			this.disabled = false
		},
		//InputNumber 计数器方法
		handleChange(value) {
			console.log(value);
		},
		//新增或编辑字典
		addDictionary(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    if(this.rowinfo.id==0) {
                        var Params = {
                            id: 0,
                            isDeleted: 0,
                            roleName: this.form.roleName,
                            roleNameZh: this.form.roleNameZh,
                            sort: this.form.sort
                        }
                        var Params2 ={
                            Authorization: this.$store.state.user.token
                        }
                        console.log(Params)
                        this.$ajax({
                            url:'/dev-api/sys/role/submit',
                            method: 'post',
                            contentType: "application/json; charset=utf-8",
                            data: Params,
                            headers: Params2
                        }).then( res => {
                            console.log(res)
                            if(res.data.code==200) {
                                this.$message.success("新增平台角色成功")
                                this.dialogFormVisible = false
                                this.getBusinessRoleList()
                            }
                            else
                                this.$message.error(res.data.msg)
                        }).catch( error => {
                            console.log()
                        })
                    }
                    else {
                        var Params = {
                            id: this.rowinfo.id,
                            isDeleted: 0,
                            roleName: this.form.roleName,
                            roleNameZh: this.form.roleNameZh,
                            sort: this.form.sort
                        }
                        var Params2 ={
                            Authorization: this.$store.state.user.token
                        }
                        console.log(Params)
                        this.$ajax({
                            url:'/dev-api/sys/role/edit',
                            method: 'put',
                            contentType: "application/json; charset=utf-8",
                            data: Params,
                            headers: Params2
                        }).then( res => {
                            console.log(res)
                            if(res.data.code==200) {
                                this.$message.success("编辑平台角色成功")
                                this.dialogFormVisible = false
                                this.getBusinessRoleList()
                            }
                            else
                                this.$message.error(res.data.msg)
                        }).catch( error => {
                            console.log()
                        })
                    }
                } else {
                    this.$message.error("请检查输入规范")
                    return false;
                }
            });
        },

        //第二个dialog对话框----------------------------------------------------------------------------------------------------
        dialogAuthority() {
            if(this.number==1) {
                this.dialogFormVisible2=true;
                this.dialogtAuthorityTree()
            }
            else
                this.$message.warning("只能选择一条数据")
        },
        dialogtAuthorityTree() {
            var Params = {
				name: '',
				code: ''
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/menu/list',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
				console.log(res)
                this.data = res.data.data
            }).catch( error => {
                console.log()
            })
        },
        getCheckedNodes() {
            // console.log(this.$refs.tree.getCheckedKeys());
            // this.$refs.tree.setCheckedKeys([10,78,79]);

            const menuLIst = this.$refs.tree.getCheckedKeys().join(",");
            console.log(menuLIst)
            // grant(this.ids[0], menuLIst).then(() => {
            // // this.box = false;
            //     this.$message({
            //         type: "success",
            //         message: "操作成功!"
            //     });
            //     // this.onLoad(this.page);
            // });
        },
    }
}
</script>

<style lang="scss" scoped>
.businessrole-container {
    margin: 10px;
    .authorityDialog .filter-tree{
		height: 330px; 
		overflow: auto;
	}
}
</style>
<style>
.businessrole-container .el-card {
	min-height: 89vh;
}
.businessrole-container .el-table .warning-row {
    background: oldlace;
}
.businessrole-container .el-table .success-row {
    background: #f0f9eb;
}
  /* 更改element-UI按钮样式 */
.businessrole-container .el-button--primary{
    color: #fff;
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);
}
.businessrole-container .el-button--primary:hover{
    background-color: rgb(62,149,181);
    border-color: rgb(62,149,181);  
}
.businessrole-container .el-button--primary:focus{
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);  
}
</style>
