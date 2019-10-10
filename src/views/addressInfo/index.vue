<template>
    <el-container id="address-container">
        <el-main>
            <el-card id="card1" style=" overflow-y:scroll;">
                <div class="organ-architecture">
                    <span class="attribute">场景——{{sceneTitle}} （属性设置）:</span> 
                    <el-button size="mini" style="float:right;margin-top:-32px;margin-right:120px" disabled>同步组织机构</el-button>
                    <el-button type="primary" size="mini" style="float:right;margin-top:-32px" @click="initialTree()">编辑组织机构</el-button>
                    <br>
                    <el-checkbox v-model="horizontal">横向/纵向</el-checkbox>
                    <el-checkbox v-model="collapsable">折叠</el-checkbox>
                    <el-checkbox v-model="expandAll" @change="expandChange">扩展</el-checkbox>
                    <div class="labelColor" style="float:right">
                        标签颜色:  &nbsp;
                        <el-select v-model="labelClassName" clearable placeholder="请选择标签颜色" size="mini">
                            <el-option
                                v-for="item in colors"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                <span style="float: left">{{ item.label }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                            </el-option>
                        </el-select>
                    </div>
                    <div class="text-center">
                        <vue2-org-tree 
                            :data="data"
                            :horizontal="horizontal"
                            :collapsable="collapsable"
                            :label-class-name="labelClassName"
                            :render-content="renderContent"
                            @on-expand="onExpand"
                            @on-node-click="onNodeClick"
                        />
                    </div>
                </div>
            </el-card>
            <el-card id="card2" style="display:none">
                <div class="organ-architecture" style="padding-bottom:18px">
                    <span class="attribute">场景——{{sceneTitle}}</span> 
                </div>
                <el-table 
                    border
                    size="mini"
                    style="width:100%;min-height:450px" 
                    ref="multipleTable2"
                    :row-class-name="tableRowClassName"
                    :data="tableData2"
                    :header-cell-style="tableHeaderColor"
                    @selection-change="handleSelectionChange2">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" width="50" align="center"></el-table-column>
                    <el-table-column prop="accountName" label="账号" width="150" align="center"></el-table-column>
                    <el-table-column prop="id" label="成员ID" width="350" align="center"></el-table-column>
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
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="sceneTotal"
                    style="text-align:right;margin-top:10px;">
                </el-pagination>
            </el-card>
        </el-main>

        <!-- 节点增删改查对话框 -->
        <el-dialog title="节点详情" :visible.sync="dialogVisible">
            <el-table :data="gridData">
                <el-table-column property="id" label="节点ID"></el-table-column>
                <el-table-column property="label" label="节点名称" width="150"></el-table-column>
                <el-table-column property="sort" label="节点序号" width="80"></el-table-column>
                <el-table-column property="childrenName" label="直系子节点名称"></el-table-column>
            </el-table>
            <div class="dialog-buttongroup" style="text-align:right;margin:30px 20px 0px;">
                <el-button @click="dialogVisible = false;resetForm('newNodeForm')" size="small">取 消</el-button>
                <!-- <el-button type="info" size="small" @click="showEdit()">编辑该节点</el-button>
                <el-button type="primary" size="small" @click="showNewSon()">新增子节点</el-button>-->
                <el-button type="danger" size="small" v-if="showDelete" @click="deleteNode()">删除此节点</el-button> 
            </div>
            <div v-if="edit" style="margin-top:30px;"> 
                <el-divider content-position="left">编辑该节点</el-divider>
                <el-form :model="editForm" ref="editForm" label-width="180px" size="small">
                    <el-form-item label="请输入该节点新的名称：">
                        <el-input v-model="editForm.editRow"
                            clearable 
                            style="width:430px" 
                            size="small"
                            maxlength="10"
                            show-word-limit>
                        </el-input>
                    </el-form-item>
                    <el-form-item style="text-align:right;margin:0 20px 0px">
                        <el-button type="success" @click="onEdit()">确认</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="newson" style="margin-top:30px;">
                <el-divider content-position="left">新增子节点</el-divider>
                <el-form :model="newNodeForm" ref="newNodeForm" label-width="180px" size="small">
                    <el-form-item
                        v-for="(domain, index) in newNodeForm.domains"
                        :label="'请输入新增子节点名称' + index +':'"
                        :key="domain.key"
                        :prop="'domains.' + index + '.value'">  
                        <el-input v-model="domain.value"
                            clearable 
                            style="width:430px" 
                            maxlength="10"
                            show-word-limit>
                        </el-input>
                        <el-button @click.prevent="removeDomain(domain)" type="danger" icon="el-icon-delete" circle style="margin-left:18px"></el-button>
                    </el-form-item>
                    <el-form-item style="text-align:right;margin:0 20px 0px">
                        <el-button type="primary" @click="addDomain">添加</el-button>
                        <el-button type="success" @click="onSubmit()">确认</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>

        <!-- 编辑组织机构对话框 -->
        <el-dialog :title="'编辑组织机构——'+sceneTitle" :visible.sync="dialogVisible2" width="1000px">
            <!-- <span style="line-height:3;display:inline-block">{{title}}</span><br> -->
            <tree-transfer 
                class="treeTransfer"
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
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" size="medium" @click="toSave()" style="margin-right:20px">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
import { options } from '@/icons/icon.json'
import treeTransfer from 'el-tree-transfer' // 引入
export default {
    name: 'organization-container',
    components: {
        treeTransfer
    },
    data() {
        return{
            sceneTitle: '',
            sceneId: '',
            data: '',
            //vue2-org-tree
            searchName: '',
            colors: [{
                value: 'bg-white',
                label: '白色'
            }, {
                value: 'bg-orange',
                label: '橙色'
            }, {
                value: 'bg-gold',
                label: '金色'
            }, {
                value: 'bg-gray',
                label: '灰色'
            }, {
                value: 'bg-lightpink',
                label: '粉色'
            }, {
                value: 'bg-chocolate',
                label: '巧克力色'
            }, {
                value: 'bg-tomato',
                label: '番茄色'
            }],
            data: {},
            horizontal: true,
            collapsable: true,
            expandAll: false,
            labelClassName: "bg-white",
            showDelete: true,
            //节点增删改查对话框
            dialogVisible: false,
            gridData: [
                {
                    label: '',
                }
            ],
            newson: false,
            edit: false,
            editForm: {
                editRow: '',
            },
            newNodeForm: {
                domains: [{
                    value: ''
                }],
            },
            //编辑组织机构对话框
            //树形穿梭框新增组织部门
            dialogVisible2: false,
            transferTitle: ["组织架构","该场景组织部门"],
            mode: "transfer", // transfer穿梭框模式  addressList通讯录模式
            hardReset: false,
            showTransfer: false,
            title: '',
            fromData: [],
            toData: [],
            allNodes: [],
            //card2
            tableData2: [],
            multipleSelection: [],
            currentPage:1,
            sceneTotal: 0,
            pageSize: 10,

        }
    },
    mounted() {
        this.$nextTick( function(){
            this.getOrganByScene(1)
            // this.getOrganMember(1)
            // this.getMainTree(1)
        })
    },
    methods: {
        //根据场景得到组织节点
        getOrganByScene() {
            // console.log(this.$store.state.user.loadScene)
            this.sceneTitle = this.$store.state.user.loadScene.sceneName
            this.sceneId = this.$store.state.user.loadScene.id
            var Params = {}
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/organ/scene/' + this.sceneId,
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.data.children) {
                    this.data = res.data.data
                    this.data = JSON.parse(JSON.stringify(this.data).replace(/unitName/g, 'label'))
                    this.data = JSON.parse(JSON.stringify(this.data).replace(/parentId/g, 'pid'))
                    console.log(this.data)
                    this.initial(1)
                    this.getMainTree()
                }
            }).catch( error => {
                console.log()
            })
        },
        //得到该场景下所有场景成员
        getOrganMember() {
            var Params = {
                sceneId: this.sceneId
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
                console.log(res)
                if(res.data.code==200) {
                    this.tableData2 = res.data.obj
                    this.sceneTotal = res.data.obj.length
                }
                else {
                    this.$message.error(res.data.msg)
                }
            }).catch( error => {
                console.log()
            })
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
        //修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color:rgb(250,250,250);color:black'
            }
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
        handleSelectionChange2(val) {
            this.multipleSelection2 = val;
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

        //---------------------------------------------------------------------------------------------------------------------
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
                if (!data.expand && data.children) {
                    this.collapse(data.children);
                }
            } else {
                this.$set(data, "expand", true);
            }
        },
        //点击树的某节点处(选中功能)
        onNodeClick(e, data) {
            console.log(e)
            if(e.toElement.className.indexOf("org-tree-node-label-inner")!=-1) {
                this.dialogVisible = true
                var obj = []
                var childrenAll = []
                obj.id = data.id
                obj.label = data.label
                obj.sort = data.sort
                for(let i in data.children)
                    childrenAll.push(data.children[i].label)
                console.log(childrenAll)
                if(childrenAll.length>0)
                    obj.childrenName = childrenAll.join()
                else
                    obj.childrenName = "无"
                console.log(obj)
                this.gridData[0] = obj
            }
            if(this.gridData[0].childrenName == "无")
                this.showDelete = true
            else
                this.showDelete = false
        },
        //折叠展开
        collapse(list) {
            var _this = this;
            list.forEach(function(child) {
                if (child.expand) {
                    child.expand = false;
                }
                child.children && _this.collapse(child.children);
            });
        },
        expandChange() {
            this.$forceUpdate()
            console.log("open")
            console.log(this.data+","+this.expandAll)
            this.toggleExpand(this.data, this.expandAll);
        },
        toggleExpand(data, val) {
            // console.log(data+","+val)
            var _this = this;
            if (Array.isArray(data)) {
                // console.log("111111")
                data.forEach(function(item) {
                    _this.$set(item, "expand", val);
                    if (item.children) {
                        _this.toggleExpand(item.children, val);
                    }
                });
            } else {
                // console.log("222222")
                this.$set(data, "expand", val);
                if (data.children) {
                    _this.toggleExpand(data.children, val);
                }
            }
        },
        //节点增删改查对话框----------------------------------------------------------------------------------------------------------
        //是否显示编辑 
        showEdit() {
            console.log(this.edit)
            this.edit = !this.edit
        },
        //是否显示新增子节点的部分页面
        showNewSon() {
            this.newson = !this.newson
        },
        //重置
        resetForm(formName) {
            // this.$refs[formName].resetFields();
            this.newNodeForm.domains.length = 1
            this.newNodeForm.domains[0].value = ''
            this.newson = false
        },
        removeDomain(item) {
            var index = this.newNodeForm.domains.indexOf(item)
            if (index !== -1) {
                this.newNodeForm.domains.splice(index, 1)
            }
        },
        addDomain() {
            this.newNodeForm.domains.push({
                value: '',
                key: Date.now()
            });
        },
        //编辑
        onEdit() {
            console.log(this.editForm.editRow)
        },
        //提交按钮
        onSubmit() {
            var obj = []
            for(let i=0;i<this.newNodeForm.domains.length;i++) {
                var objdata = {}
                objdata.parentId = this.gridData[0].id
                objdata.sort = 0
                objdata.unitName = this.newNodeForm.domains[i].value
                obj.push(objdata)
            }
            // console.log(obj)
            var Params = obj
            this.$ajax({
                url:'/dev-api/organ/nodes',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                data: Params
            }).then( res => {
                console.log(res.data)
                if(res.data.code==200) {
                    this.dialogVisible = false
                    this.resetForm('newNodeForm')
                    this.getOrganByScene()
                    this.$message.success("新增节点成功");
                }
                else {
                    this.$message.error(res.data.msg);
                }
            }).catch( error => {
                console.log()
            })
        },
        //删除该节点
        deleteNode() {
            var Params = {
                nodeIds: this.gridData[0].id,
                sceneId: this.$store.state.user.loadScene.id
            }
            console.log(Params)
            this.$ajax({
                url:'/dev-api/scene/node/remove',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                params: Params
            }).then( res => {
                console.log(res)
                if(res.data.code==200) {
                    this.dialogVisible = false
                    this.getOrganByScene()
                    this.getMainTree()
                    this.$message.success("删除节点成功");
                }
                else {
                    this.$message.error(res.data.msg);
                }
            }).catch( error => {
                console.log()
            })
        },

        //编辑组织机构对话框-----------------------------------------------------------------------------------------------------------------------------
        initialTree() {
            this.getMainTree()
            this.dialogVisible2=true
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
                console.log(res)
                if(res.data.code==200) {
                    this.fromData[0] = res.data.data
                    this.fromData[0] = JSON.parse(JSON.stringify(this.fromData[0]).replace(/unitName/g, 'label'))
                    this.fromData[0] = JSON.parse(JSON.stringify(this.fromData[0]).replace(/parentId/g, 'pid'))
                    console.log("formData",this.fromData)
                    console.log("data",this.data)
                    if(Object.keys(this.data).length != 0) {
                        this.toData[0] = this.data
                        this.allNodes = []
                        this.GetSubJson(this.toData, this.allNodes)
                        console.log(this.allNodes)
                    }
                    else
                        this.$message.error("加载场景失败")
                }
                else {
                    this.$message.error('后台系统错误');
                }
            }).catch( error => {
                console.log()
            })
        },
        //得到树中所有Id值的方法
        GetSubJson(jsonData, json) {
            for (var i = 0; i < jsonData.length; i++) {
                if (jsonData[i].id !='') {
                    json.push(jsonData[i].id);
                    if (jsonData[i].children.length!=0) {
                        this.GetSubJson(jsonData[i].children, json);
                    }
                }
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
            // console.log("fromData:", fromData);
            // console.log("toData:", toData);
            // console.log("obj:", obj);
            for(var i=0;i<obj.keys.length;i++)
				this.allNodes.push(obj.keys[i])
			for(var j=0;j<obj.harfKeys.length;j++)
                this.allNodes.push(obj.harfKeys[j])
            console.log(this.allNodes)
			this.allNodes = this.unique(this.allNodes)
			console.log(this.allNodes)
        },
        // 监听穿梭框组件移除
        remove(fromData,toData,obj){
            // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
            // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
            // console.log("fromData:", fromData);
            // console.log("toData:", toData);
            // console.log("obj:", obj);
            var removeNode = []
			for(var i=0;i<obj.keys.length;i++)
				removeNode.push(obj.keys[i])
            console.log(removeNode)
            // console.log(this.allNodes)
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
            this.dialogVisible2 = false
            console.log(this.allNodes)
            var Params = {
                sceneId: this.sceneId,
                nodeIds: this.allNodes.join(",")
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
                if(res.data.code==200) {
                    this.$message.success("编辑组织部门成功")
                    this.getOrganByScene()
                }
                else 
                    this.$message.error(res.data.msg)
            }).catch( error => {
                console.log()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
#address-container {
    height:92vh;
    .el-aside {
        // background:#f3f5f8;
        background: white;
        box-shadow: 2px 0 5px 0px #e0e5f0;
        .title {
            font-size: 16px;
            color: #304265;
            margin-left: 24px;
            line-height: 60px;
        }
        .el-icon-plus {
            background: #409EFF;
            color: white;
            font-size: 12px;
            font-weight: bold;
            padding: 4px;
            border-radius: 3px;
            margin-left: 110px;
        }
        .el-menu {
            // background: #f3f5f8;
            background: white;
            border-right: 0px;
            .svg-icon {
                margin-left:5px;
                margin-right:8px;
                font-size:16px;
                vertical-align: -0.3em; 
            }
            span {
                line-height: 1.5;
            }
            .barstyle {
                width:3px;
                background:#409EFF;
                height:55px;
                float:left;
                margin-left:-20px;
                display:none;
            }
            .el-dropdown {
                float: right;
                display: none;
                .el-icon-s-tools {
                    float:right;
                    margin-top:21px;
                    font-size:16px;
                }
            }
        }
        .el-menu-item:hover { 
            background: #ecf1f7 !important;
            .el-dropdown {
                display: block;
            }
            .barstyle {
                display: block;
            }
        }
        .el-menu-item.is-active {
            background-color: #ecf1f7 !important;
            .el-dropdown {
                display: block;
            }
            .barstyle {
                display: block;
            }
        }
        .el-dialog {
            .el-form-item {
                margin-left:35px;
            }
            .el-input {
                margin-left:0px;
                width:300px;;
            }
            .el-select {
                width:300px;
                .el-option {
                    width:20%;
                    margin:10px;
                    .svg-icon{
                        size:70px;
                    }
                }
            }
        }
    }
    .el-main {
        // margin-right: 10px;
        // border: 1px solid #e0e0e0;
        border-left:none;
        padding-top:10px;
        background-color:rgb(242,245,248);
        .el-card {
            margin-top:20px;
            // height:78vh;
            height: 85vh;
            display: block;
            .el-pagination {
                // bottom: 0px;
                margin-top:50vh;
                text-align:center;
            }
        }
        .el-menu {
            background-color:rgb(242,245,248);
        }
        .el-menu-item:hover {
            background-color:rgb(242,245,248);
        }
        .el-menu-item.is-active {
            background-color:rgb(242,245,248);
        }
        span {
            // line-height: 3.5;
            font-size: 15px;
            padding-left: 8px;
            color: #555;
        }
        // background: #000;
        //vue2-org-tree
        .organ-architecture {
            overflow-y:auto;
            overflow-x:auto;
            padding: 0 40px 0 40px;
            .attribute {
                display: block;
                font-weight: bold;
                line-height: 3;
            }
            .text-center {
                padding-top: 35px;
                text-align: center;
            }
        }
    }
    
}
</style>
<style>
#address-container .el-input .el-input__count .el-input__count-inner {
    background-color:rgba(0,0,0,0)
}
.org-tree-node-label {
    white-space: nowrap;
}
.bg-white {
    background-color: white;
}
.bg-orange {
    background-color: orange;
}
.bg-gold {
    background-color: gold;
}
.bg-gray {
    background-color: gray;
}
.bg-lightpink {
    background-color: lightpink;
}
.bg-chocolate {
    background-color: chocolate;
}
.bg-tomato {
    background-color: tomato;
}
/* 编辑组织机构 */
#address-container .transfer-left {
	margin-left: 20px;
}
#address-container .transfer-right {
	margin-right: 20px;
}
</style>

