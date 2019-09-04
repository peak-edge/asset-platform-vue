<template>
    <div class="dictionary-container">
        <el-card class="card1">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" v-if="show">
                <el-form-item label="字典编号">
                    <el-input v-model="formInline.code" placeholder="字典编号"></el-input>
                </el-form-item>
                <el-form-item label="字典名称">
                    <el-input v-model="formInline.dictValue" placeholder="字典名称"></el-input>
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
                        <el-button icon="el-icon-refresh" type="info" circle @click="clearAll();getDictionaryList()"></el-button>
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
                    <el-table-column prop="code" label="字典编号" width="180"></el-table-column>
                    <el-table-column prop="dictValue" label="字典名称" sortable min-width="180"></el-table-column>
                    <el-table-column prop="dictKey" label="字典键值" min-width="180"></el-table-column>
                    <el-table-column prop="sort" label="字典排序" min-width="180"></el-table-column>
                    <el-table-column label="操作" fixed="right" align="center" min-width="230">
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
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

        <!-- 新增、查看、编辑按钮弹出的嵌套表单的dialog -->
		<el-dialog :title="this.dialogTitle" :visible.sync="dialogFormVisible" width="860px" @close="closeDialog('form')">
			<el-form :model="form" ref="form" :inline="true" :rules="rules" :disabled="disabled" style="margin-left:10px;padding-bottom:50px">
                <el-form-item label="字典编号" :label-width="formLabelWidth" prop="code">
                    <el-input v-model="form.code" placeholder="请输入 字典编号" style="width:685px"></el-input>
                </el-form-item>
                <el-form-item label="字典名称" :label-width="formLabelWidth" prop="dictValue">
                    <el-input v-model="form.dictValue" placeholder="请输入 字典名称" style="width:290px"></el-input>
                </el-form-item>
                <el-form-item label="上级字典" :label-width="formLabelWidth">
                    <el-input v-model="form.parentId" placeholder="请选择 上级字典" style="width:290px" @click.native="dialogFormVisible2=true;getTreeList()"></el-input>
                </el-form-item>
                <el-form-item label="字典键值" :label-width="formLabelWidth" prop="dictKey">
					<el-input-number v-model="form.dictKey" controls-position="right" @change="handleChange" :min="-1" style="width:290px"></el-input-number>
				</el-form-item>
                <el-form-item label="字典排序" :label-width="formLabelWidth" prop="sort">
					<el-input-number v-model="form.sort" controls-position="right" @change="handleChange" :min="0" style="width:290px"></el-input-number>
				</el-form-item>
				<el-form-item label="字典备注" :label-width="formLabelWidth">
					<el-input v-model="form.remark" placeholder="请输入 字典备注" style="width:685px" type="textarea" :rows="2"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="medium" @click="addDictionary('form')">保 存</el-button>
				<el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
			</div>
		</el-dialog>

        <!-- 选择上级字典弹出框 -->
		<el-dialog title="请选择上级字典" class="upDictionaryDialog" :visible.sync="dialogFormVisible2" width="30%">
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
                code: '',
                dictValue: ''
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
            //增删改弹出框信息
			dialogFormVisible: false,
			formLabelWidth: '90px',
			disabled: false,
			form: {},
			rules: {
				code: [{ required: true, message: '请输入字典编号', trigger: 'blur' }],
				dictValue: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
				dictKey: [{ required: true, message: '请输入字典键值', trigger: 'blur' }],
				sort: [{ required: true, message: '请输入字典排序', trigger: 'blur' }],
			},
            //选择上级字典弹出框 
			dialogFormVisible2: false,
			filterText: '',
			data: [],
			defaultProps: {
				children: 'children',
				label: 'title'
			},
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
			this.getDictionaryList(1)
        })
    },
    methods: {
        //得到字典管理的列表
		getDictionaryList() {
            var Params = {
                code: this.formInline.code,
                dictValue: this.formInline.dictValue
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/dict/list',
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
            this.getDictionaryList()
        },
        //清空按钮
        clearAll() {
            this.formInline.code = '',
            this.formInline.dictValue = ''
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
                code: '',
				dictValue: '',
                parentId: 0,
                dictKey: -1,
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
				this.$message.error("请至少选择一行字典信息")
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
			obj.code = row.code
			obj.dictValue = row.dictValue
			obj.parentId = row.parentId
			obj.dictKey = row.dictKey
			obj.sort = row.sort
			this.form = obj
			this.disabled = true
        },
        handleEdit(index, row) {
			console.log(index, row);
            this.rowinfo = row
            this.dialogFormVisible = true
            this.dialogTitle = "编辑"
			var obj = {}
			obj.code = row.code
			obj.dictValue = row.dictValue
			obj.parentId = row.parentId
			obj.dictKey = row.dictKey
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
                url:'/dev-api/dict/remove',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
				console.log(res)
				if(res.data.code==200) {
					this.$message.success("删除字典成功")
					this.getDictionaryList()
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
		//新增或编辑字典
		addDictionary(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    var Params = {
                        code: this.form.code,
                        dictKey: this.form.dictKey,
                        dictValue: this.form.dictValue,
                        id: this.rowinfo.id,
                        isDeleted: 0,
                        parentId: this.form.parentId,
                        remark: this.form.remark,
                        sort: this.form.sort,
                    }
                    var Params2 ={
                        Authorization: this.$store.state.user.token
                    }
                    if(Params.parentId=="0")
                        Params.parentId = 0
                    console.log(Params)
                    this.$ajax({
                        url:'/dev-api/dict/submit',
                        method: 'post',
                        contentType: "application/json; charset=utf-8",
                        data: Params,
                        headers: Params2
                    }).then( res => {
                        console.log(res)
                        if(res.data.code==200) {
                            if(this.rowinfo.id==0)
                                this.$message.success("新增字典成功")
                            else
                                this.$message.success("编辑字典成功")
                            this.dialogFormVisible = false
                            this.getDictionaryList()
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
                url:'/dev-api/dict/tree',
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
    }
}
</script>

<style lang="scss" scoped>
.dictionary-container {
    margin: 10px;
    .upDictionaryDialog .filter-tree{
		height: 390px; 
		overflow: auto;
	}
}
</style>
<style>
.dictionary-container .el-card {
	min-height: 89vh;
}
.dictionary-container .el-table .warning-row {
    background: oldlace;
}
.dictionary-container .el-table .success-row {
    background: #f0f9eb;
}
  /* 更改element-UI按钮样式 */
.dictionary-container .el-button--primary{
    color: #fff;
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);
}
.dictionary-container .el-button--primary:hover{
    background-color: rgb(62,149,181);
    border-color: rgb(62,149,181);  
}
.dictionary-container .el-button--primary:focus{
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);  
}
</style>
