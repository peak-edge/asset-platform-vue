<template>
    <div class="scene-container">
        <el-card class="card1">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" v-if="show">
                <el-form-item label="场景名称">
                    <el-input v-model="formInline.scenename" placeholder="场景名称"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-select v-model="formInline.des" placeholder="关键词">
                    <el-option label="杭州电子科技大学" value="1"></el-option>
                    <el-option label="云技术实验室" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSearch()">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="clearAll()">清空</el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="true" :model="formInline2" class="demo-form-inline2" size="small">
                <el-form-item>
                    <el-button type="primary" @click="dialogFormVisible2 = true"><i class="el-icon-plus"></i>新增</el-button>
                    <el-button type="danger">删除</el-button>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                        <el-button icon="el-icon-refresh" type="info" circle @click="clearAll();getsceneList()"></el-button>
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
                <span>当前表格已选择 0 项  </span>
                <el-button type="text" style="color:rgb(14,122,162)" @click="toggleSelection()">清空</el-button>
                <!-- <el-table 
                    :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" -->
                <el-table
                    :data="tableData"
                    :header-cell-style="tableHeaderColor"
                    ref="multipleTable"
                    style="width: 100%" 
                    border
                    size="mini"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" width="50" align="center" :index="table_index"></el-table-column>
                    <el-table-column prop="name" label="场景名称" width="150" sortable align="center"></el-table-column>
                    <el-table-column prop="sceneid" label="场景ID" width="350" align="center"></el-table-column>
                    <el-table-column prop="date" label="创建时间" width="280" sortable align="center"></el-table-column>
                    <el-table-column prop="desc" label="描述" min-width="300" align="center"></el-table-column>
                    <el-table-column
                        prop="tag"
                        label="标签"
                        width="100"
                        :filters="[{ text: '学校', value: '学校' }, { text: '公司', value: '公司' }]"
                        :filter-method="filterTag"
                        filter-placement="bottom-end"
                        align="center">
                        <template slot-scope="scope">
                            <el-tag
                                :type="scope.row.tag === '学校' ? 'primary' : 'success'"
                                disable-transitions>{{scope.row.tag}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" min-width="230" align="center">
                        <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-view"
                            @click="handleCheck(scope.$index, scope.row)">查看</el-button>
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
                    :current-page="1"
                    :page-sizes="[5, 10, 20, 30]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="sceneTotal"
                    style="text-align:right;margin-top:10px;">
                </el-pagination>
            </div>
        </el-card>
        <el-card class="card2">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" style="padding-left:30%"> 
                <el-menu-item index="0" @click="placestucture()">场景结构设置</el-menu-item>
                <el-menu-item index="1" @click="placemember()" style="margin-left:10%">场景成员设置</el-menu-item>
                <div id="buttongroup1" style="display:block">
                    <el-button type="warning" size="mini" style="float:right;margin-top:12px" @click="showTransfer=false;toSave()">保存</el-button>
                    <el-button size="mini" style="float:right;margin-top:12px;margin-right:8px;" @click="showTransfer=false">取消</el-button>
                    <el-button type="primary" size="mini" style="float:right;margin-top:12px" @click="initialTree()">新增组织部门</el-button>
                </div>
                <div id="buttongroup2" style="display:none">
                    <el-button type="primary" size="mini" style="float:right;margin-top:12px" @click="batchAdd()">添加</el-button>
                    <el-button type="danger" size="mini" style="float:right;margin-right:8px;margin-top:12px" @click="batchRemove()">批量移除</el-button>
                </div>
            </el-menu>
            <el-card id="card1">
                <span style="line-height:3;display:inline-block">{{title}}</span><br>
                <tree-transfer 
                    class="treeTransfer"
                    v-if="hardReset&&showTransfer"
                    :title="transferTitle" 
                    :from_data='fromData' 
                    :to_data='toData' 
                    :defaultProps="{label:'label'}" 
                    @addBtn='add' 
                    @removeBtn='remove' 
                    :mode='mode' 
                    height='540px' 
                    filter 
                    openAll>
                </tree-transfer>
                <!-- <el-tree 
                    class="elTree"
                    :props="props"
                    :data="treeData" 
                    @node-click="handleNodeClick"
                    show-checkbox
                    default-expand-all
                    highlight-current>
                </el-tree> -->
                <vue2-org-tree 
                    v-if="!showTransfer"
                    :data="data"
                    :horizontal="true"
                    :collapsable="true"
                    :render-content="renderContent"
                    @on-expand="onExpand"
                    @on-node-click="onNodeClick"
                />
            </el-card>
            <el-card id="card2" style="display:none">
                <span style="display:inline-block">{{title}}</span>
                <el-input placeholder="搜索" style="float:right;width:165px;margin:0px 0px 15px;" size="mini">
                    <el-button slot="append" icon="el-icon-search" style="width:50px"></el-button>
                </el-input>
                <el-table 
                    border
                    size="mini"
                    style="width:100%;" 
                    ref="multipleTable2"
                    :row-class-name="tableRowClassName"
                    :data="tableData2"
                    :header-cell-style="tableHeaderColor"
                    @selection-change="handleSelectionChange2">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" width="50" align="center"></el-table-column>
                    <el-table-column prop="accountName" label="账号" width="150" align="center"></el-table-column>
                    <el-table-column prop="id" label="成员ID" width="350" align="center"></el-table-column>
                    <!-- <el-table-column prop="password" label="密码" width="330" align="center"></el-table-column> -->
                    <el-table-column prop="realName" label="姓名" width="150" align="center"></el-table-column>
                    <el-table-column prop="admin" label="是否为管理员" width="120" align="center"></el-table-column>
                    <el-table-column prop="createdTime" label="创建时间" width="300" sortable align="center"></el-table-column>
                    <el-table-column prop="tel" label="手机" width="180" align="center"></el-table-column>
                    <el-table-column prop="email" label="邮箱" width="200" align="center"></el-table-column>
                    <el-table-column prop="other" label="其它" min-width="200" align="center"></el-table-column>
                    <el-table-column prop="methods" label="操作" align="center" width="200" fixed="right">
                        <el-button size="mini">设置主部门</el-button>
                        <el-button size="mini" type="primary">授权</el-button>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="1"
                    :page-sizes="[5, 10, 20, 30]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="sceneTotal"
                    style="text-align:right;margin-top:10px;">
                </el-pagination>
                <!-- <el-pagination
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="100"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="400">
                </el-pagination> -->
            </el-card>
        </el-card>

        <!-- 编辑对话框 -->
        <el-dialog title="编辑场景" :visible.sync="dialogFormVisible1">
            <span>修改场景名称：</span>
            <el-input placeholder="请输入修改后场景名称" size="small" style="width:350px" v-model="editInput"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false" size="small">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible1 = false;handleEditSubmit()" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!-- +新增对话框 -->
        <el-dialog title="新增场景" :visible.sync="dialogFormVisible2">
            <span>新场景名称：</span>
            <el-input placeholder="请输入新的场景名称" size="small" style="width:350px" v-model="newInput"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible2 = false" size="small">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible2 = false;handleNewSubmit()" size="small">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 添加场景成员对话框 -->
        <el-dialog title="新增场景成员" :visible.sync="dialogFormVisible3">
            <span>请选择所要加入的新的场景成员：</span>
            <el-select placeholder="支持多选" size="small" style="width:450px" v-model="newSelect" filterable multiple clearable>
                <el-option 
                    v-for="item in newMemberOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px;margin-right:22px">{{ item.realname }}</span>
                </el-option>
            </el-select>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible3 = false" size="small">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible3 = false;handleNewMember()" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import treeTransfer from 'el-tree-transfer' // 引入
export default {
    name: 'topbar',
    components: {
        treeTransfer
    },
    data() {
        return {
            show: true,
            formInline: {
                scenename: '',
                des: ''
            },
            formInline2: {},
            tableData: [],
            multipleSelection: [],
            currentPage:1,
            sceneTotal: 0,
            pageSize: 5,
            //card2中信息
            activeIndex: '0',
            id: '',
            title: '',
            props: {
                label: 'unitName',
                children: 'children'
            },
            // treeData: [{
            //     unitName: '',
            //     sort: '',
            //     children: []
            // }],
            data: {},
            // treeData: {
            //     label: '单位 1',
            //     children: [{
            //         label: '单位 1-1',
            //         children: [{
            //              label: '单位 1-1-1'
            //         }]
            //     }],
            // },
            expandAll: false,
            tableData2: [],
            // tableData2: [{
            //     name: 'cx',
            //     tel: '19858190000',
            //     email: '19858190000@163.com',
            //     section: 'boss'
            // }],
            multipleSelection2: [],
            // 编辑对话框
            dialogFormVisible1: false,
            editInput: '',
            // 新增对话框
            dialogFormVisible2: false,
            newInput: '',
            //新增场景成员对话框
            dialogFormVisible3: false,
            newSelect: [],
            newMemberOptions: [],
            //树形穿梭框新增组织部门
            transferTitle: ["组织架构","该场景组织部门"],
            mode: "transfer", // transfer穿梭框模式  addressList通讯录模式
            hardReset: false,
            showTransfer: false,
            // mainTreeData: [],
            fromData: [],
        //     fromData:[
        //   {
        //     id: "1",
        //     pid: 0,
        //     label: "一级 1",
        //     children: [
        //       {
        //         id: "1-1",
        //         pid: "1",
        //         label: "二级 1-1",
        //         disabled: true,
        //         children: []
        //       },
        //       {
        //         id: "1-2",
        //         pid: "1",
        //         label: "二级 1-2",
        //         children: [
        //           {
        //             id: "1-2-1",
        //             pid: "2",
        //             children: [],
        //             label: "二级 1-2-1"
        //           },
        //           {
        //             id: "1-2-2",
        //             pid: "2",
        //             children: [],
        //             label: "二级 1-2-2"
        //           }
        //         ]
        //       }
        //     ]
        //   },
        // ],
            toData: [],
            allNodes: []
        };
    },
    mounted() {
        this.$nextTick( function(){
            this.getsceneList(1)
            this.getMainTree(1)
        })
    },
    methods: {
        //条件查询
        onSearch() {
            
        },
        //隐藏搜索按钮
        hideSearchItem() {
            this.show = !this.show
        },
        //得到场景列表
        getsceneList() {
            var Params = {
                page: this.currentPage,
                sceneName: '',
                size: this.pageSize,
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/organ/scenes',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res.data.obj.total)
                this.sceneTotal = res.data.obj.total
                this.tableData = []
                for(let i=0;i<res.data.obj.list.length;i++)
                {
                    let obj2 = {}
                    obj2.sceneid = res.data.obj.list[i].id
                    obj2.name = res.data.obj.list[i].sceneName
                    obj2.date = res.data.obj.list[i].addTime
                    this.tableData.push(obj2)
                }
            }).catch( error => {
                console.log()
            })
        },
        //得到主组织树
        getMainTree() {
            var Params = {}
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/organ/mainTree',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                if(res.data.obj) {
                    this.fromData[0] = res.data.obj
                    this.fromData[0] = JSON.parse(JSON.stringify(this.fromData[0]).replace(/unitName/g, 'label'))
                    this.fromData[0] = JSON.parse(JSON.stringify(this.fromData[0]).replace(/parentId/g, 'pid'))
                    console.log(this.fromData)
                    this.$nextTick(() => {
                        this.hardReset= true
                    });
                }
                else {
                    this.$message.error('后台系统错误');
                }
            }).catch( error => {
                console.log()
            })
        },
        //清空按钮
        clearAll() {
            this.formInline.scenename = '',
            this.formInline.des = ''
        },
        //表格的index列
        table_index(index){
            return (this.currentPage-1) * this.pageSize + index + 1
        },
        //table的双色条纹
        tableRowClassName({row, rowIndex}) {
            if (rowIndex === 1||(rowIndex-1)%4 === 0) {
                return 'warning-row';
            } else if (rowIndex === 3||(rowIndex+1)%4 === 0) {
                return 'success-row';
            }
            return '';
        },
        //table的全选按钮
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSelectionChange2(val) {
            this.multipleSelection2 = val;
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
        //table的标签
        filterTag(value, row) {
            return row.tag === value;
        },
        //table的查看按钮
        handleCheck(index, row) {
            console.log(index, row);
            //查看其对应的场景成员
            this.id = row.sceneid
            this.getsceneMember();
            if(this.showTransfer===true)
                this.$message.error("请先保存或恢复更改的场景！")
            else {
                this.title = row.name
                var Params = {}
                var Params2 ={
                    Authorization: this.$store.state.user.token
                }
                this.$ajax({
                    url:'/dev-api/organ/scene/' + row.sceneid,
                    method: 'get',
                    contentType: "application/json; charset=utf-8",
                    params: Params,
                    headers: Params2
                }).then( res => {
                    console.log(res)
                    // this.treeData[0].unitName = res.data.obj.unitName
                    // this.treeData[0].sort = res.data.obj.sort
                    // this.treeData[0].children = res.data.obj.children
                    // console.log(res.data.obj.children)
                    if(res.data.obj.children) {
                        this.data = res.data.obj
                        this.data = JSON.parse(JSON.stringify(this.data).replace(/unitName/g, 'label'))
                        this.data = JSON.parse(JSON.stringify(this.data).replace(/parentId/g, 'pid'))
                        console.log(this.data)
                        this.initial(1)
                    }
                    // console.log(this.treeData)
                }).catch( error => {
                    console.log()
                })
            }
        },
        //table的新增按钮
        handleNewSubmit() {
            var Params1 = {
                sceneName: this.newInput
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/organ/scene',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                data: Params1,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.status == 200) {
                    this.getsceneList()
                    this.$message.success(res.data.msg);
                }
                else {
                    this.$message.error(res.data.msg);
                }
            }).catch( error => {
                console.log()
            })
        },
        //table的编辑按钮
        handleEdit(index, row) {
            this.dialogFormVisible1 = true
            console.log(index, row);
            this.id = row.sceneid
        },
        handleEditSubmit() {
            var Params2 = {
                id: this.id,
                sceneName: this.editInput
            }
            var Params3 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/organ/scene',
                method: 'put',
                contentType: "application/json; charset=utf-8",
                data: Params2,
                headers: Params3
            }).then( res => {
                console.log(res)
                if(res.data.status == 200) {
                    this.getsceneList()
                    this.$message.success(res.data.msg);
                }
                else {
                    this.$message.error(res.data.msg);
                }
            }).catch( error => {
                console.log()
            })
        },
        //table的删除按钮
        handleDelete(index, row) {
            console.log(index, row);
            var Params3 = {
                id: row.sceneid
            }
            var Params4 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/organ/rest/scene',
                method: 'delete',
                contentType: "application/json; charset=utf-8",
                data: Params3,
                headers: Params4
            }).then( res => {
                if(res.data.status == 200) {
                    this.getsceneList()
                    this.$message.success(res.data.msg);
                }
                else {
                    this.$message.error(res.data.msg);
                }
            }).catch( error => {
                console.log()
            })
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
            this.getsceneList()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val
            this.getsceneList()
        },
        //场景结构与场景成员页面跳转
        placestucture() {
            var ele1=document.getElementById("card1");
            var ele2=document.getElementById("card2");
            var button1=document.getElementById("buttongroup1");
            var button2=document.getElementById("buttongroup2");
            ele2.style.display = "none";
            ele1.style.display = "block";
            button2.style.display = "none";
            button1.style.display = "block";
        },
        placemember() {
            var ele1=document.getElementById("card1");
            var ele2=document.getElementById("card2");
            var button1=document.getElementById("buttongroup1");
            var button2=document.getElementById("buttongroup2");
            ele2.style.display = "block";
            ele1.style.display = "none";
            button2.style.display = "block";
            button1.style.display = "none";
        },
        //树中节点的选择
        handleNodeClick(data) {
            console.log(data);
        },

        //场景结构设置-------------------------------------------------------------------------
        //根据场景初始化穿梭框
        initialTree() {
            console.log(this.data)
            if(Object.keys(this.data).length != 0) {
                this.showTransfer=true;
                this.toData[0] = this.data
            }
            else {
                console.log("ooooooooo未选择场景oooooooooooo")
            }
        },
        // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
        changeMode() {
            if (this.mode == "transfer") {
                this.mode = "addressList";
            } else {
                this.mode = "transfer";
            }
        },
        // 监听穿梭框组件添加
        add(fromData,toData,obj){
            // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
            // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
            console.log("fromData:", fromData);
            console.log("toData:", toData);
            console.log("obj:", obj);
            for(var i=0;i<obj.keys.length;i++)
				this.allNodes.push(obj.keys[i])
			for(var j=0;j<obj.harfKeys.length;j++)
				this.allNodes.push(obj.harfKeys[j])
			this.allNodes = this.unique(this.allNodes)
			console.log(this.allNodes)
        },
        // 监听穿梭框组件移除
        remove(fromData,toData,obj){
            // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
            // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
            console.log("fromData:", fromData);
            console.log("toData:", toData);
            console.log("obj:", obj);
            var removeNode = []
			for(var i=0;i<obj.keys.length;i++)
				removeNode.push(obj.keys[i])
			// for(var j=0;j<obj.harfKeys.length;j++)
			// 	removeNode.push(obj.harfKeys[j])
			console.log(removeNode)
			this.allNodes = this.allNodes.filter(function(v){ return removeNode.indexOf(v) == -1 })
			console.log(this.allNodes)
        },
        //数组去重
		unique(arr){
			var hash=[];
			for (var i = 0; i < arr.length; i++) {
				if(arr.indexOf(arr[i])==i){
				hash.push(arr[i]);
				}
			}
			return hash;
		},
        //保存穿梭框
        toSave() {
            console.log(this.allNodes)
            var Params = {
                sceneId: this.id,
                treeIds: this.allNodes.join(",")
            }
			var Params2 = {
                Authorization: this.$store.state.user.token
            }
            console.log(Params)
            this.$ajax({
                url:'/dev-api/scene/node/add',
                method: 'post',
                contentType: "application/json; charset=utf-8",
				params: Params,
				headers: Params2
            }).then( res => {
                if(res.data.status==200)
                    this.$message.success("新增组织部门成功")
                else 
                    this.$message.error(res.data.msg)
            }).catch( error => {
                console.log()
            })
        },



        /////////////////////////////////
        //初始化强制展开
        initial() {
            this.expandAll = true
            this.expandChange()
        },
        //呈现内容为节点的key为label的值
        renderContent(h, data) {
            return data.label;
        },
        //是否展开
        onExpand(e,data) {
            if ("expand" in data) {
                data.expand = !data.expand;
                if (!data.expand && this.data.children) {
                    this.collapse(this.data.children);
                }
            } else {
                this.$set(data, "expand", true);
            }
            this.isNodeCenter = true
        },
        //点击树的某节点处(选中功能)
        onNodeClick(e, data) {
            console.log(e)
            // if(e.toElement.className.indexOf("org-tree-node-label-inner")!=-1) {
            //     this.dialogVisible = true
            //     var obj = []
            //     var childrenAll = []
            //     obj.id = data.id
            //     obj.label = data.label
            //     obj.sort = data.sort
            //     for(let i in data.children)
            //         childrenAll.push(data.children[i].label)
            //     console.log(childrenAll)
            //     if(childrenAll.length>0)
            //         obj.childrenName = childrenAll.join()
            //     else
            //         obj.childrenName = "无"
            //     console.log(obj)
            //     this.gridData[0] = obj
            // }
        },
        //折叠展开
        collapse(list) {
            var _this = this;
            list.forEach(function(children) {
                if (children.expand) {
                    children.expand = false;
                }
                children.children && _this.collapse(children.children);
            });
        },
        expandChange() {
            this.$forceUpdate()
            // console.log("open")
            // console.log(this.data+","+this.expandAll)
            this.toggleExpand(this.data, this.expandAll);
        },
        toggleExpand(data, val) {
            var _this = this;
            if (Array.isArray(data)) {
                data.forEach(function(item) {
                    _this.$set(item, "expand", val);
                    if (item.children) {
                        _this.toggleExpand(item.children, val);
                    }
                });
            } else {
                this.$set(data, "expand", val);
                if (data.children) {
                    _this.toggleExpand(data.children, val);
                }
            }
        },

        //场景成员设置-------------------------------------------------------------------------
        //得到该场景下所有场景成员
        getsceneMember() {
            var Params = {
                sceneId: this.id
            }
            console.log(Params)
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/scene/members',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                if(res.data.status==200) {
                    console.log("ppppppppppppppppppppppppppppppppppppppppppppppppp")
                    console.log(res.data.obj)
                    this.tableData2 = res.data.obj
                }
                else {
                    this.$message.error(res.data.msg)
                }
            }).catch( error => {
                console.log()
            })
        },
        //批量添加场景成员
        batchAdd() {
            //获取所有用户
            var Params = {
                accountName: "",
                email: "",
                realName: "",
                sceneId: this.id
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/sys/user/users/noScene',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                if(res.data.status==200) {
                    this.newMemberOptions = []
                    for(var i=0;i<res.data.obj.length;i++) {
                        var obj = []
                        obj.label = res.data.obj[i].accountName
                        obj.realname = res.data.obj[i].realName
                        obj.value = res.data.obj[i].id
                        this.newMemberOptions.push(obj)
                    }
                    this.dialogFormVisible3 = true
                }
                else {
                    this.$message.error(res.data.msg)
                }
            }).catch( error => {
                console.log()
            })
        },
        //处理新增场景成员
        handleNewMember() {
            console.log(this.newSelect)
            var Params = {
                sceneId: this.id,
                userIds: this.newSelect.join(",")
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/scene/members',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                if(res.data.status==200) {
                    this.getsceneMember();
                    this.$message.success("新增场景用户成功")
                }
                else {
                    this.$message.error(res.data.msg)
                }
            }).catch( error => {
                console.log()
            })
        },
        //批量删除场景成员
        batchRemove() {
            if(this.multipleSelection2.length==0) {
                this.$message.error("请先选择需要移除的成员")
            }
            else {
                this.$confirm('此操作将永久删除该场景成员, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var removeId = []
                    for(var i=0;i<this.multipleSelection2.length;i++) {
                        removeId.push(this.multipleSelection2[i].id)
                    }
                    var Params = {
                        sceneId: this.id,
                        userIds: removeId.join(",")
                    }
                    console.log(Params)
                    var Params2 ={
                        Authorization: this.$store.state.user.token
                    }
                    this.$ajax({
                        url:'/dev-api/scene/members',
                        method: 'delete',
                        contentType: "application/json; charset=utf-8",
                        params: Params,
                        headers: Params2
                    }).then( res => {
                        console.log(res)
                        if(res.data.status==200) {
                            this.tableData2 = res.data.obj
                            this.$message.success("批量删除用户成功")
                        }
                        else {
                            this.$message.error(res.data.msg)
                        }
                    }).catch( error => {
                        console.log()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.scene-container {
    margin: 10px;
    .card1 {
        width: 100%;
        margin-bottom: 15px;
    }
    .card2 {
        width: 100%;
        padding-bottom: 30px;
        #card1 {
            padding:20px;
        }
    }
}
</style>
<style>
.scene-container .elTree .el-tree-node__content {
    margin-left:60px;
    height: 35px;
    padding-left:20px;
}
.scene-container .elTree .el-tree-node__children {
    padding-left:50px;
}
.scene-container .el-table .warning-row {
    background: oldlace;
}
.scene-container .el-table .success-row {
    background: #f0f9eb;
}
.scene-container .transfer-left {
	margin-left: 15px;
}
.scene-container .transfer-right {
	margin-right: 15px;
}
  /* 更改element-UI按钮样式 */
.scene-container .el-button--primary{
    color: #fff;
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);
}
.scene-container .el-button--primary:hover{
    background-color: rgb(62,149,181);
    border-color: rgb(62,149,181);  
}
.scene-container .el-button--primary:focus{
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);  
}
/* 分页 */
.scene-container .el-dialog, .el-pager li {
	background-color: white;
}
</style>

