<template>
    <div class="flowmonitor-container">
        <el-card class="card1">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" v-if="show">
                <el-form-item label="表单模型ID：">
                    <el-input v-model="formInline.formModelId" placeholder="表单模型ID"></el-input>
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
                        <el-button icon="el-icon-refresh" type="info" circle @click="clearAll();getFlowMonitorList()"></el-button>
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
                    <el-table-column prop="taskId" label="任务ID" min-width="330"></el-table-column>
                    <el-table-column prop="procInstId" label="所属实例ID" min-width="330"></el-table-column>
                    <el-table-column prop="executor" label="执行人" min-width="150"></el-table-column>
                    <el-table-column  prop="executorTime" label="执行时间" sortable min-width="220"></el-table-column>
                    <el-table-column 
                        prop="nodeType" 
                        label="节点类型" 
                        width="150"
                        :filters="[{ text: '经办', value: '经办' }, { text: '审批', value: '审批' }, { text: '待阅', value: '待阅' }]"
                        :filter-method="filterTag"
                        filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <el-tag
                                :type="chooseType(scope)"
                                disable-transitions>{{scope.row.nodeType}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="formModelId" label="绑定的表单模型ID" min-width="330"></el-table-column>
                    <el-table-column prop="formInstId" label="表单实例ID" min-width="330"></el-table-column>
                    <el-table-column prop="instName" label="实例名称" min-width="150"></el-table-column>
                    <!-- <el-table-column label="操作" fixed="right" align="center" min-width="230">
                        <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-view"
                            @click="handleSee(scope.$index, scope.row)">查看</el-button>
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
                    </el-table-column> -->
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
		<!-- <el-dialog :title="this.dialogTitle" :visible.sync="dialogFormVisible" width="740px" @close="closeDialog('form')">
			<el-form :model="form" ref="form" :inline="true" :rules="rules" :disabled="disabled" style="margin-left:10px;padding-bottom:50px">
                <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleNameZh">
                    <el-input v-model="form.roleNameZh" placeholder="请输入 角色名称" style="width:580px"></el-input>
                </el-form-item>
                <el-form-item label="角色别名" :label-width="formLabelWidth" prop="roleName">
                    <el-input v-model="form.roleName" placeholder="请输入 角色别名" style="width:580px"></el-input>
                </el-form-item>
                <el-form-item label="角色排序" :label-width="formLabelWidth" prop="sort">
					<el-input-number v-model="form.sort" controls-position="right" @change="handleChange" :min="0" style="width:580px"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="medium" @click="addDictionary('form')">保 存</el-button>
				<el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
			</div>
		</el-dialog> -->
    </div>
</template>

<script>
export default {
    name: 'flowmonitor',
    data() {
        return {
            show: true,
            formInline: {
                formModelId: '',
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
			// dialogFormVisible: false,
			// formLabelWidth: '90px',
			// disabled: false,
			// form: {},
			// rules: {
			// 	roleNameZh: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
			// 	roleName: [{ required: true, message: '请输入角色别名', trigger: 'blur' }],
			// 	sort: [{ required: true, message: '请输入角色排序', trigger: 'blur' }],
            // },
        }
    },
    mounted() {
        this.$nextTick( function(){
			this.getFlowMonitorList(1)
        })
    },
    methods: {
        //得到平台角色的列表
		getFlowMonitorList() {
            var Params = {
                formModelId: this.formInline.formModelId,
                page: this.currentPage,
                size: this.pageSize
            }
            // var Params2 ={
            //     Authorization: this.$store.state.user.token
            // }
            console.log(Params)
            this.$ajax({
                url:'/my-api/admin/task/list',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                // headers: Params2
            }).then( res => {
                console.log(res)
                this.roleTotal = res.data.obj.total
                this.tableData = res.data.obj.list
                for(var i=0;i<this.tableData.length;i++) {
                    if(this.tableData[i].executorTime)
                        this.tableData[i].executorTime= this.timeDifference(this.tableData[i].executorTime)
                    if(this.tableData[i].nodeType==1)
                        this.tableData[i].nodeType="经办"
                    else if(this.tableData[i].nodeType==2)
                        this.tableData[i].nodeType="审批"
                    else if(this.tableData[i].nodeType==3)
                        this.tableData[i].nodeType="待阅"
                }
                // console.log(this.tableData) 
            }).catch( error => {
                console.log()
            })
        },
        //根据菜单名称和菜单编号模糊搜索
        onSearch() {
            this.getFlowMonitorList()
        },
        //清空按钮
        clearAll() {
            this.formInline.formModelId = ''
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
            return row.nodeType === value;
        },
        //el-tag颜色分配
        chooseType(scope) {
            if(scope.row.nodeType === '经办')
                return 'error'
            else if(scope.row.nodeType === '审批')
                return 'success'
            else 
                return 'warning'
        },
        //table的查看、编辑和删除
		// handleSee(index, row) {
		// 	console.log(index, row);
		// 	this.rowinfo = row
        //     this.dialogFormVisible = true
        //     this.dialogTitle = "查看"
		// 	var obj = {}
		// 	obj.roleNameZh = row.roleNameZh
		// 	obj.roleName = row.roleName
		// 	obj.sort = row.sort
		// 	this.form = obj
		// 	this.disabled = true
        // },
        // handleEdit(index, row) {
		// 	console.log(index, row);
        //     this.rowinfo = row
        //     this.dialogFormVisible = true
        //     this.dialogTitle = "编辑"
		// 	var obj = {}
		// 	obj.roleNameZh = row.roleNameZh
		// 	obj.roleName = row.roleName
		// 	obj.sort = row.sort
		// 	this.form = obj
        // },
        // handleDelete(index, row) {
		// 	console.log(index, row);
		// 	this.ids = row.id
		// 	this.deleteAllMethods()
		// },
        // //删除方法
		// deleteAllMethods() {
		// 	var Params = {
		// 		ids: this.ids
		// 	}
        //     var Params2 ={
        //         Authorization: this.$store.state.user.token
        //     }
        //     console.log(Params)
        //     this.$ajax({
        //         url:'/dev-api/sys/role/remove',
        //         method: 'post',
        //         contentType: "application/json; charset=utf-8",
        //         params: Params,
        //         headers: Params2
        //     }).then( res => {
		// 		console.log(res)
		// 		if(res.data.status==200) {
		// 			this.$message.success("删除平台角色成功")
		// 			this.getFlowMonitorList()
		// 		}
		// 		else
		// 			this.$message.error(res.data.msg)
        //     }).catch( error => {
        //         console.log()
        //     })
        // },
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
            this.getFlowMonitorList()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val
            this.getFlowMonitorList()
        },
        //计算时间差方法
        timeDifference(date)
        {
            var year = new Date(date)
            var month = year.getMonth()+1
            return year.getFullYear()+'-'+month+'-'+year.getDate()+' '+year.getHours()+':'+year.getMinutes()+':'+year.getSeconds();
            // //计算出相差天数
            // var days=Math.floor(date/(24*3600*1000))
            // //计算出小时数
            // var leave1=date%(24*3600*1000)    //计算天数后剩余的毫秒数
            // var hours=Math.floor(leave1/(3600*1000))
            // //计算相差分钟数
            // var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
            // var minutes=Math.floor(leave2/(60*1000))
            // //计算相差秒数
            // var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
            // var seconds=Math.round(leave3/1000)
            // if(days==0)
            //     return hours+"h"+minutes+"m"+seconds+"s"
            // else if(days==1)
            //     return days+"day"+hours+"h"+minutes+"m"+seconds+"s"
            // else
            //     return days+"days"+hours+"h"+minutes+"m"+seconds+"s"
        },

        //第一个dialog对话框----------------------------------------------------------------------------------------------------
		// closeDialog(form) {
		// 	this.$refs[form].resetFields();
		// 	this.disabled = false
		// },
		// //InputNumber 计数器方法
		// handleChange(value) {
		// 	console.log(value);
		// },
		// //新增或编辑字典
		// addDictionary(form) {
        //     this.$refs[form].validate((valid) => {
        //         if (valid) {
        //             if(this.rowinfo.id==0) {
        //                 var Params = {
        //                     id: 0,
        //                     isDeleted: 0,
        //                     roleName: this.form.roleName,
        //                     roleNameZh: this.form.roleNameZh,
        //                     sort: this.form.sort
        //                 }
        //                 var Params2 ={
        //                     Authorization: this.$store.state.user.token
        //                 }
        //                 console.log(Params)
        //                 this.$ajax({
        //                     url:'/dev-api/sys/role/submit',
        //                     method: 'post',
        //                     contentType: "application/json; charset=utf-8",
        //                     data: Params,
        //                     headers: Params2
        //                 }).then( res => {
        //                     console.log(res)
        //                     if(res.data.status==200) {
        //                         this.$message.success("新增平台角色成功")
        //                         this.dialogFormVisible = false
        //                         this.getFlowMonitorList()
        //                     }
        //                     else
        //                         this.$message.error(res.data.msg)
        //                 }).catch( error => {
        //                     console.log()
        //                 })
        //             }
        //             else {
        //                 var Params = {
        //                     id: this.rowinfo.id,
        //                     isDeleted: 0,
        //                     roleName: this.form.roleName,
        //                     roleNameZh: this.form.roleNameZh,
        //                     sort: this.form.sort
        //                 }
        //                 var Params2 ={
        //                     Authorization: this.$store.state.user.token
        //                 }
        //                 console.log(Params)
        //                 this.$ajax({
        //                     url:'/dev-api/sys/role/edit',
        //                     method: 'put',
        //                     contentType: "application/json; charset=utf-8",
        //                     data: Params,
        //                     headers: Params2
        //                 }).then( res => {
        //                     console.log(res)
        //                     if(res.data.status==200) {
        //                         this.$message.success("编辑平台角色成功")
        //                         this.dialogFormVisible = false
        //                         this.getFlowMonitorList()
        //                     }
        //                     else
        //                         this.$message.error(res.data.msg)
        //                 }).catch( error => {
        //                     console.log()
        //                 })
        //             }
        //         } else {
        //             this.$message.error("请检查输入规范")
        //             return false;
        //         }
        //     });
        // },
    }
}
</script>

<style lang="scss" scoped>
.flowmonitor-container {
    margin: 10px;
}
</style>
<style>
.flowmonitor-container .el-card {
	min-height: 89vh;
}
.flowmonitor-container .el-table .warning-row {
    background: oldlace;
}
.flowmonitor-container .el-table .success-row {
    background: #f0f9eb;
}
  /* 更改element-UI按钮样式 */
.flowmonitor-container .el-button--primary{
    color: #fff;
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);
}
.flowmonitor-container .el-button--primary:hover{
    background-color: rgb(62,149,181);
    border-color: rgb(62,149,181);  
}
.flowmonitor-container .el-button--primary:focus{
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);  
}
</style>
