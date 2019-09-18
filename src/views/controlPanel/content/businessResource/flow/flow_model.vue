<template>
    <div class="flowmodel-container">
        <el-card class="card1">
            <el-form :inline="true" :model="formInline2" class="demo-form-inline2" size="small">
                <el-form-item>
                    <el-button type="primary" @click="newAdd()"><i class="el-icon-plus"></i> 新增</el-button>
                    <el-button type="danger" @click="deleteAll()"><i class="el-icon-delete"></i> 删除</el-button>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                        <el-button icon="el-icon-refresh" type="info" circle @click="getFlowModelList()"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="显隐" placement="top">
                        <el-button icon="el-icon-menu" type="warning" circle></el-button>
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
                    style="width: 100%; min-height:520px" 
                    border
                    size="small"
                    @selection-change="handleSelectionChange"
                    row-key="id"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" width="50" align="center"></el-table-column>
                    <el-table-column prop="id" label="流程模型ID" min-width="340"></el-table-column>
                    <el-table-column prop="name" label="流程模型名称" sortable min-width="150"></el-table-column>
                    <el-table-column prop="modelKey" label="模型KEY" min-width="150"></el-table-column>
                    <el-table-column prop="description" label="模型描述" min-width="180"></el-table-column>
                    <el-table-column prop="createdBy" label="创建人" min-width="150"></el-table-column>
                    <el-table-column prop="created" label="创建时间" min-width="180"></el-table-column>
                    <el-table-column prop="version" label="版本" min-width="120"></el-table-column>
                    <el-table-column prop="modelType" label="模型类型" min-width="120"></el-table-column>
                    <el-table-column label="操作" fixed="right" align="center" min-width="180">
                        <template slot-scope="scope">
                        <!-- <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-download"
                            @click="handleDownload(scope.$index, scope.row)">下载</el-button> -->
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
                    :page-sizes="[10, 20, 30, 40]"
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
    name: 'flow_model',
    data() {
        return {
            show: true,
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
            pageSize: 10,
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
			this.getFlowModelList(1)
        })
    },
    methods: {
        //得到平台角色的列表
		getFlowModelList() {
            var Params = {
                page: this.currentPage,
                size: this.pageSize
            }
            // var Params2 ={
            //     Authorization: this.$store.state.user.token
            // }
            this.$ajax({
                url:'/my-api/admin/proc_model/list',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                // headers: Params2
            }).then( res => {
                console.log(res)
                this.roleTotal = res.data.obj.total
				this.tableData = res.data.obj.list
            }).catch( error => {
                console.log()
            })
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
        handleEdit(index, row) {
            console.log(index, row);
            this.rowinfo = row
            window.open('static/modler/index.html#/editor/'+row.id)
        },
        handleDelete(index, row) {
            console.log(index, row);
            this.rowinfo = row
            this.$ajax({
                url:'/app/rest/models/'+ row.id,
                method: 'delete',
                contentType: "application/json; charset=utf-8",
            }).then( res => {
                console.log(res)
                this.$message.success("删除成功")
                this.getFlowModelList()
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
            this.getFlowModelList()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val
            this.getFlowModelList()
        },
    }
}
</script>

<style lang="scss" scoped>
.flowmodel-container {
    margin: 10px;
}
</style>
<style>
.flowmodel-container .el-card {
	min-height: 89vh;
}
.flowmodel-container .el-table .warning-row {
    background: oldlace;
}
.flowmodel-container .el-table .success-row {
    background: #f0f9eb;
}
  /* 更改element-UI按钮样式 */
.flowmodel-container .el-button--primary{
    color: #fff;
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);
}
.flowmodel-container .el-button--primary:hover{
    background-color: rgb(62,149,181);
    border-color: rgb(62,149,181);  
}
.flowmodel-container .el-button--primary:focus{
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);  
}
</style>
