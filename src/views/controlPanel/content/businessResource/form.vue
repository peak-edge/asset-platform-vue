<template>
    <div class="form-container">
        <el-card class="card1">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" v-if="show">
                <el-form-item label="表单名称">
                    <el-input v-model="formInline.formName" placeholder="表单名称"></el-input>
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
                    <!-- <el-button @click="dialogAuthority()"><i class="el-icon-setting"></i> 权限设置</el-button> -->
                    <!-- <el-button type="warning" @click="exportExcel()"><i class="el-icon-download"></i> 导出excel</el-button> -->
                </el-form-item>
                <el-form-item style="float:right">
                    <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                        <el-button icon="el-icon-refresh" type="info" circle @click="clearAll();getFormList()"></el-button>
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
                    <el-table-column prop="id" label="表单模型ID" min-width="340"></el-table-column>
                    <el-table-column prop="formName" label="表单名称" min-width="150"></el-table-column>
                    <el-table-column prop="procModelId" label="绑定的流程模型ID" min-width="340"></el-table-column>
                    <el-table-column prop="createdTime" label="创建时间" min-width="200"></el-table-column>
                    <el-table-column prop="createdBy" label="创建人" min-width="150"></el-table-column>
                    <!-- <el-table-column prop="status" label="表单模型状态" min-width="150"></el-table-column> -->
                    <el-table-column 
                        prop="status" 
                        label="表单模型状态" 
                        width="180"
                        :filters="[{ text: '已绑定流程可被发起', value: '已绑定流程可被发起' }, { text: '未绑定流程', value: '未绑定流程' }, { text: '被删除', value: '被删除' }]"
                        :filter-method="filterTag"
                        filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <el-tag
                                :type="chooseType(scope)"
                                disable-transitions>{{scope.row.status}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sceneID" label="所属工作场景ID" min-width="330"></el-table-column>
                    <el-table-column prop="appName" label="所属应用" min-width="180"></el-table-column>
                    <el-table-column prop="groupName" label="所属分组" min-width="180"></el-table-column>
                    <el-table-column label="操作" fixed="right" align="center" min-width="160">
                        <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-view"
                            @click="handleSee(scope.$index, scope.row)">查看表单内容</el-button>
                        <!-- <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
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
        <!-- 表单展示框 -->
        <div class="addPage" :hidden="dialogVisible" style="z-index:999">
            <span style="float:left;line-height:3.2;font-size:16px;padding-left:20px;">使用说明</span>
            <div class="navbar-header">
                <el-button @click="dialogVisible = true"><i class="el-icon-close"></i><span>关闭</span></el-button>
            </div>
            <div class="main" style="padding:40px;">
                <fm-generate-form
                    :data="jsonData"
                    :remote="remoteFuncs"
                    :value="values"
                    ref="generateForm">
                </fm-generate-form>
            </div>
        </div>

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
    </div>
</template>

<script>
export default {
    name: 'from',
    data() {
        return {
            show: true,
            formInline: {
                formName: '',
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
            //表单展示框
            dialogVisible: true,
            jsonData: {
                "list": [
                {
                    "type": "input",
                    "name": "单行文本",
                    "icon": "icon-input",
                    "options": {
                    "width": "100%",
                    "defaultValue": "",
                    "required": false,
                    "dataType": "string",
                    "pattern": "",
                    "placeholder": "",
                    "remoteFunc": "func_1540908864000_94322"
                    },
                    "key": "1540908864000_94322",
                    "model": "input_1540908864000_94322",
                    "rules": [
                    {
                        "type": "string",
                        "message": "单行文本格式不正确"
                    }
                    ]
                }
                ],
                "config": {
                "labelWidth": 100,
                "labelPosition": "top",
                "size": "small"
                }
            },
            values: {},
            remoteFuncs: {},
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
        }
    },
    mounted() {
        this.$nextTick( function(){
			this.getFormList(1)
        })
    },
    methods: {
        //得到平台角色的列表
		getFormList() {
            var Params = {
                formName: this.formInline.formName,
                page: this.currentPage,
                size: this.pageSize
            }
            // var Params2 ={
            //     Authorization: this.$store.state.user.token
            // }
            console.log(Params)
            this.$ajax({
                url:'/my-api/admin/form_model/list',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                // headers: Params2
            }).then( res => {
                console.log(res)
                this.roleTotal = res.data.obj.total
                this.tableData = res.data.obj.list
                for(var i=0;i<this.tableData.length;i++) {
                   this.tableData[i].createdTime= this.timeFormal(this.tableData[i].createdTime)
                    if(this.tableData[i].status==0)
                        this.tableData[i].status="未绑定流程"
                    else if(this.tableData[i].status==1)
                        this.tableData[i].status="已绑定流程可被发起"
                    else if(this.tableData[i].status==2)
                        this.tableData[i].status="被删除"
                }
            }).catch( error => {
                console.log()
            })
        },
        //根据菜单名称和菜单编号模糊搜索
        onSearch() {
            this.getFormList()
        },
        //清空按钮
        clearAll() {
            this.formInline.formName = ''
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
            this.$message.warning("暂未实现")
            // this.dialogFormVisible = true
            // this.dialogTitle = "新增"
			// this.form = {
            //     roleNameZh: '',
            //     roleName: '',
            //     sort: 0,
            // }
            // this.rowinfo.id = 0
        },
        //删除按钮
        deleteAll() {
            this.$message.warning("暂未实现")
            // this.ids= ''
            // console.log(this.multipleSelection)
			// if(this.multipleSelection.length==0)
			// 	this.$message.error("请至少选择一行角色信息")
			// else{
			// 	for(var i=0;i<this.multipleSelection.length;i++) {
			// 		this.ids = this.ids+','+this.multipleSelection[i].id
			// 	}
			// 	this.ids=this.ids.substr(1);
			// 	console.log(this.ids)
			//     this.deleteAllMethods()
			// }
        },
        //table的标签
        filterTag(value, row) {
            return row.status === value;
        },
        //el-tag颜色分配
        chooseType(scope) {
            if(scope.row.status === '被删除')
                return 'error'
            else if(scope.row.status === '已绑定流程可被发起')
                return 'success'
            else 
                return 'warning'
        },
        //table的查看、编辑和删除
		handleSee(index, row) {
			console.log(index, row);
            this.rowinfo = row
            // console.log(row.modelSheet)
            this.dialogVisible = false
            this.jsonData = JSON.parse(row.modelSheet)
            // this.$message.warning(row.modelSheetStr)
            // this.dialogFormVisible = true
            // this.dialogTitle = "查看"
			// var obj = {}
			// obj.roleNameZh = row.roleNameZh
			// obj.roleName = row.roleName
			// obj.sort = row.sort
			// this.form = obj
			// this.disabled = true
        },
        handleEdit(index, row) {
			console.log(index, row);
            this.rowinfo = row
            this.$message.warning("暂未实现")
            // this.dialogFormVisible = true
            // this.dialogTitle = "编辑"
			// var obj = {}
			// obj.roleNameZh = row.roleNameZh
			// obj.roleName = row.roleName
			// obj.sort = row.sort
			// this.form = obj
        },
        handleDelete(index, row) {
            console.log(index, row);
            this.$message.warning("暂未实现")
			// this.ids = row.id
			// this.deleteAllMethods()
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
					this.getFormList()
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
            this.getFormList()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val
            this.getFormList()
        },
        //计算时间差方法
        timeFormal(date)
        {
            var year = new Date(date)
            var month = year.getMonth()+1
            return year.getFullYear()+'-'+month+'-'+year.getDate()+'  '+year.getHours()+':'+year.getMinutes()+':'+year.getSeconds();
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
                                this.getFormList()
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
                                this.getFormList()
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
    }
}
</script>

<style lang="scss" scoped>
.form-container {
    margin: 10px;
    .addPage {
        width: 65%;
        height: 100vh;
        background-color: white;
        box-shadow: -3px -3px 5px #E0E0E0;
        position: fixed;
        right: 0;
        top: 80px;
        animation: bounceInRight 3s cubic-bezier(0.215, 0.610, 0.355, 1.000);
        .navbar-header {
            height:52px;
            background:#f3f5f8;
            border-bottom: 1px solid #E0E0E0;
            .el-button {
                float: right;
                height: 51px;
                border: 0;
                border-left: 1px solid #E0E0E0;
                border-radius: 0px;
                margin-left:0px;
                .svg-icon {
                    vertical-align: middle;
                    font-size: 20px;
                    color: #8AAED1;
                }
                span {
                    font-size:15px;
                    font-family: 'icomoon';
                    color: #333333;
                    line-height: 2;
                }
            }
        }
    }
}
</style>
<style>
.form-container .el-card {
	min-height: 89vh;
}
.form-container .el-table .warning-row {
    background: oldlace;
}
.form-container .el-table .success-row {
    background: #f0f9eb;
}
  /* 更改element-UI按钮样式 */
.form-container .el-button--primary{
    color: #fff;
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);
}
.form-container .el-button--primary:hover{
    background-color: rgb(62,149,181);
    border-color: rgb(62,149,181);  
}
.form-container .el-button--primary:focus{
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);  
}
</style>
