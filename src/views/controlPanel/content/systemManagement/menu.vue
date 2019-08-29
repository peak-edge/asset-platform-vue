<template>
    <div class="menu-container">
        <el-card class="card1">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" v-if="show">
                <el-form-item label="菜单名称">
                    <el-input v-model="formInline.menuName" placeholder="菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="菜单编号">
                    <el-input v-model="formInline.menuNumber" placeholder="菜单编号"></el-input>
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
                    <el-button type="warning" @click="exportExcel()"><i class="el-icon-download"></i> 导出excel</el-button>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                        <el-button icon="el-icon-refresh" type="info" circle @click="clearAll();getMenuList()"></el-button>
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
                    style="width: 100%" 
                    :row-class-name="tableRowClassName"
                    border
                    size="small"
                    @selection-change="handleSelectionChange"
                    row-key="id"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" width="50" align="center"></el-table-column>
                    <el-table-column prop="name" label="菜单名称" sortable min-width="160"></el-table-column>
                    <el-table-column prop="path" label="路由地址" min-width="200"></el-table-column>
                    <el-table-column label="菜单图标" min-width="80">
						<template slot-scope="scope">
							<i :class="scope.row.source"></i>
						</template>
					</el-table-column>
                    <el-table-column prop="code" label="菜单编号" min-width="120"></el-table-column>
					<el-table-column prop="category" label="菜单类型" min-width="100" v-if="false"></el-table-column>
                    <el-table-column prop="alias" label="菜单别名" min-width="120" ></el-table-column>
                    <el-table-column prop="sort" label="菜单排序" min-width="80" ></el-table-column>
                    <el-table-column label="操作" fixed="right" align="center" min-width="230">
                        <template slot-scope="scope">
                        <el-button
                            size="small"
                            icon="el-icon-view"
                            type="text"
                            @click="handleSee(scope.$index, scope.row)">查 看</el-button>
                        <el-button
                            size="small"
                            icon="el-icon-edit"
                            type="text"
                            @click="handleEdit(scope.$index, scope.row)">编 辑</el-button>
                        <el-button 
                            size="small"
                            icon="el-icon-delete"
                            type="text"
                            @click="handleDelete(scope.$index, scope.row)">删 除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

		<!-- 新增、查看、编辑按钮弹出的嵌套表单的dialog -->
		<el-dialog title="新增" :visible.sync="dialogFormVisible" width="60%" @close="closeDialog('form')">
			<el-form :model="form" ref="form" :inline="true" :rules="rules" :disabled="disabled" style="margin-left:18px">
				<el-form-item label="菜单名称" :label-width="formLabelWidth" prop="name">
					<el-input v-model="form.name" placeholder="请输入 菜单名称" style="width:290px"></el-input>
				</el-form-item>
				<el-form-item label="路由地址" :label-width="formLabelWidth" prop="path">
					<el-input v-model="form.path" placeholder="请输入 路由地址" style="width:290px"></el-input>
				</el-form-item>
				<el-form-item label="上级菜单" :label-width="formLabelWidth">
					<el-input v-model="form.parentId" placeholder="请选择 上级菜单" style="width:290px" @click.native="dialogFormVisible2=true;getTreeList()"></el-input>
				</el-form-item>
				<el-form-item label="菜单图标" :label-width="formLabelWidth" prop="source">
					<el-input v-model="form.source" placeholder="请输入 菜单图标" style="width:290px" @click.native="dialogFormVisible3=true;"></el-input>
				</el-form-item>
				<el-form-item label="菜单编号" :label-width="formLabelWidth" prop="code">
					<el-input v-model="form.code" placeholder="请输入 菜单编号" style="width:290px"></el-input>
				</el-form-item>
				<el-form-item label="菜单类型" :label-width="formLabelWidth" prop="category">
					<el-radio-group v-model="form.category">
						<el-radio label="1">菜单</el-radio>
						<el-radio label="2">按钮</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="菜单别名" :label-width="formLabelWidth" prop="alias">
					<el-input v-model="form.alias" placeholder="请输入 菜单别名" style="width:290px"></el-input>
				</el-form-item>
				<el-form-item label="菜单排序" :label-width="formLabelWidth" prop="sort">
					<el-input-number v-model="form.sort" controls-position="right" @change="handleChange" :min="0" style="width:290px"></el-input-number>
				</el-form-item>
				<el-form-item label="菜单备注" :label-width="formLabelWidth">
					<el-input v-model="form.remark" placeholder="请输入 菜单备注" style="width:685px" type="textarea" :rows="2"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="medium" @click="addMenu('form')">保 存</el-button>
				<el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
			</div>
		</el-dialog>

		<!-- 选择上级菜单弹出框 -->
		<el-dialog title="请选择上级菜单" class="upMenuDialog" :visible.sync="dialogFormVisible2" width="30%">
			<el-input placeholder="输入关键字进行过滤" v-model="filterText" size="medium" style="width:100%;margin-bottom:15px"></el-input>
			<el-tree
				class="filter-tree"
				:highlight-current="true"
				:check-on-click-node="true"
				:indent="22"
				:data="data"
				:props="defaultProps"
				:filter-node-method="filterNode"
				@node-click="nodeClick"
				default-expand-all
				ref="tree">
			</el-tree>
		</el-dialog>

		<!-- 请输入菜单图标弹出框 -->
		<el-dialog title="请输入 菜单图标" class="menuIconDialog" :visible.sync="dialogFormVisible3" width="30%">
			 <el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="通用图标" name="first">
					<div style="padding:20px" v-for="item in iconListCommon" :key="item.value">
						<i :class="item.value" style="font-size:25px;margin-right:20px;" @click="form.source=item.value;dialogFormVisible3=false"></i>
					</div>
				</el-tab-pane>
				<el-tab-pane label="系统图标" name="second">
					<div style="padding:20px" v-for="item2 in iconListSystem" :key="item2.value">
						<i :class="item2.value" style="font-size:25px;margin-right:20px;" @click="form.source=item2.value;dialogFormVisible3=false"></i>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-dialog>
    </div>
</template>

<script>
import FileSaver from "file-saver"
import XLSX from "xlsx"
export default {
    name: 'topbar',
    data() {
        return {
            show: true,
            formInline: {
                menuName: '',
                menuNumber: '',
            },
			formInline2: {},
			tableData: [],
			multipleSelection: [],
			number: 0,
			rowinfo: {
				id: 0
			},
			ids: "",
			//增删改弹出框信息
			dialogFormVisible: false,
			formLabelWidth: '90px',
			disabled: false,
			form: {},
			rules: {
				name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
				path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
				code: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
				category: [{ required: true, message: '请输入菜单编号', trigger: 'blur' }],
				alias: [{ required: true, message: '请输入菜单别名', trigger: 'blur' }],
				sort: [{ required: true, message: '请输入菜单排序', trigger: 'blur' }]
			},
			//选择上级菜单弹出框 
			dialogFormVisible2: false,
			filterText: '',
			data: [],
			defaultProps: {
				children: 'children',
				label: 'title'
			},
			//请输入菜单图标弹出框 
			dialogFormVisible3: false,
			activeName: 'first',
			iconListCommon: [{
					label: '编辑',
					value: 'el-icon-edit'
				}, {
					label: '链接',
					value: 'el-icon-share'
			}],
			iconListSystem: [{
					label: '工作台',
					value: 'el-icon-data-board'
				}, {
					label: '事务管理',
					value: 'el-icon-menu'
				}, {
					label: '系统监控',
					value: 'el-icon-view'
				}, {
					label: '业务资源管理',
					value: 'el-icon-connection'
				}, {
					label: '菜单管理',
					value: 'el-icon-setting'
			}],
        };
	},
	watch: {
		//el-tree的过滤功能
		filterText(val) {
			this.$refs.tree.filter(val);
		}
	},
	mounted() {
        this.$nextTick( function(){
			this.getMenuList(1)
        })
    },
    methods: {
		//得到菜单管理的列表
		getMenuList() {
			var Params = {
				name: this.formInline.menuName,
				code: this.formInline.menuNumber
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
				this.tableData = res.data.data
            }).catch( error => {
                console.log()
            })
		},
		//根据菜单名称和菜单编号模糊搜索
        onSearch() {
			this.getMenuList()
		},
		//清空按钮
        clearAll() {
            this.formInline.menuName = '',
            this.formInline.menuNumber = ''
        },
        //隐藏搜索按钮
        hideSearchItem() {
            this.show = !this.show
        },
        //table的全选按钮
        handleSelectionChange(val) {
			this.multipleSelection = val;
			this.number = this.multipleSelection.length
			if (val.children) {
				this.setchildtobeselect(val.children, val.checks);
			}

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
			this.form = {
				name: '',
				path: '',
				parentId: 0,
				source: '',
				code: '',
				category: '1',
				alias: '',
				sort: 0,
				remark: ''
			}
			this.rowinfo.id = 0
		},
		//删除按钮
		deleteAll() {
			this.ids= ''
			console.log(this.multipleSelection)
			if(this.multipleSelection.length==0)
				this.$message.error("请至少选择一行菜单")
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
                    "Menu.xlsx"
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
			var obj = {}
			obj.name = row.name
			obj.path = row.path
			obj.parentId = row.parentId
			obj.source = row.source
			obj.code = row.code
			obj.category = row.category.toString()
			obj.alias = row.alias
			obj.sort = row.sort
			this.form = obj
			this.disabled = true
        },
        handleEdit(index, row) {
			console.log(index, row);
			this.rowinfo = row
			this.dialogFormVisible = true
			var obj = {}
			obj.name = row.name
			obj.path = row.path
			obj.parentId = row.parentId
			obj.source = row.source
			obj.code = row.code
			obj.category = row.category.toString()
			obj.alias = row.alias
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
            this.$ajax({
                url:'/dev-api/menu/remove',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
				console.log(res)
				if(res.data.code==200) {
					this.$message.success("删除菜单成功")
					this.getMenuList()
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
		
		//第一个dialog对话框----------------------------------------------------------------------------------------------------
		closeDialog(form) {
			this.$refs[form].resetFields();
			this.disabled = false
		},
		//InputNumber 计数器方法
		handleChange(value) {
			console.log(value);
		},
		//新增或编辑菜单
		addMenu(form) {
			this.$refs[form].validate((valid) => {
                if (valid) {
					var Params = {
						action: 0,
						alias: this.form.alias,
						category: parseInt(this.form.category),
						code: this.form.code,
						id: this.rowinfo.id,
						isDeleted: 0,
						isOpen: 0,
						name: this.form.name,
						parentId: this.form.parentId,
						path: this.form.path,
						remark: this.form.remark,
						sort: this.form.sort,
						source: this.form.source
					}
					var Params2 ={
						Authorization: this.$store.state.user.token
					}
					if(Params.parentId=="0")
						Params.parentId = 0
					console.log(Params)
					this.$ajax({
						url:'/dev-api/menu/submit',
						method: 'post',
						contentType: "application/json; charset=utf-8",
						data: Params,
						headers: Params2
					}).then( res => {
						console.log(res)
						if(res.data.code==200) {
							if(this.rowinfo.id==0)
								this.$message.success("新增菜单成功")
							else
								this.$message.success("编辑菜单成功")
							this.dialogFormVisible = false
							this.getMenuList()
						}
						else
							this.$message.error(res.data.msg)
					}).catch( error => {
						console.log()
					})
				} else {
                    this.$message.error("请检查输入规范")
                    return false;
                }
            });
		},

		//第二个dialog对话框-------------------------------------------------------------------------------------------------------
		filterNode(value, data) {
			if (!value) 
				return true;
			return data.title.indexOf(value) !== -1;
		},
		nodeClick(...arg) {
			console.log(arg[0].title)
			console.log(arg[0].id)
			this.form.parentId = arg[0].id
			this.dialogFormVisible2 = false
		},
		//得到菜单管理弹出框里的上级菜单
		getTreeList() {
			var Params = {}
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/menu/tree',
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

		//第三个dialog对话框-------------------------------------------------------------------------------------------------------
		handleClick(tab, event) {
			console.log(tab, event);
		},
    }
}
</script>

<style lang="scss" scoped>
.menu-container {
    margin: 10px;
	.upMenuDialog .filter-tree{
		height: 390px; 
		overflow: auto;
	}
	.menuIconDialog {
		i:hover{
			color: rgb(14,122,162);
		}
	}
}
</style>
<style>
.menu-container .el-card {
	min-height: 89vh;
}
.menu-container .el-table .warning-row {
    background: oldlace;
}
.menu-container .el-table .success-row {
    background: #f0f9eb;
}
.menu-container .el-table .uniquecolumn .cell {
	padding-left: 15px;
}
  /* 更改element-UI按钮样式 */
.menu-container .el-button--primary {
    color: #fff;
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);
}
.menu-container .el-button--primary:hover {
    background-color: rgb(62,149,181);
    border-color: rgb(62,149,181);  
}
.menu-container .el-button--primary:focus {
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);  
}
</style>
