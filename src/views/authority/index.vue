<template>
    <el-container id="authority_container">
        <el-aside width="250px">
            <!-- 角色按钮 -->
            <div class="button-group" style="margin:20px 0 20px 16px;">
                <el-button size="mini" type="primary" @click="dialogAddRole = true" style="margin-right:4px;padding:7px 22px 7px 22px">新建角色</el-button>
                <el-button size="mini" type="primary" @click="dialogAddRoleGroup = true" style="padding:7px 22px 7px 22px">新建角色组</el-button>
            </div>
            <!-- 显示角色列表 -->
            <el-menu 
                v-for="(item,index) in rolelist" 
                :key="index" 
                :default-openeds="['0','1','2','3','4']"
                :default-active="activemenu"
                @select="handleSelect">
                <el-submenu :index="String(index)">
                    <template slot="title">
                        <i class="el-icon-coordinate"></i>
                        <span>{{item.roleGroupName}}</span>
                    </template> 
                    <el-menu-item v-for="(role,index2) in item.sceneRoles" :key="index2" :index="String(index)+String(index2)" @click.native="getResourceHaveList(item,role,activeApply,[])">
                        {{role.roleNameZh}}
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <!-- 主界面 -->
        <el-main>
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" style="padding-left:30%"> 
                <el-menu-item index="0" @click="placestucture()">角色权限设置</el-menu-item>
                <el-menu-item index="1" @click="placemember()" style="margin-left:10%">角色成员管理</el-menu-item>
                <div id="buttongroup1" style="display:block">
                    <el-button type="primary" size="mini" style="float:right;margin-top:12px" @click="toSave()">保存</el-button>
                    <el-button type="primary" size="mini" style="float:right;margin-right:8px;margin-top:12px" disabled>同步角色</el-button>
                </div>
                <div id="buttongroup2" style="display:none">
                    <el-button type="primary" size="mini" style="float:right;margin-top:12px" disabled>添加成员</el-button>
                    <el-button type="primary" size="mini" style="float:right;margin-right:8px;margin-top:12px" disabled>批量移除</el-button>
                </div>
            </el-menu>
            <!-- 角色权限设置 -->
            <el-card id="card1">
                <el-table
                    :cell-style="{padding:'10px'}"
                    :data="tableData1"
                    border
                    :span-method="objectSpanMethod"
                    style="width: 100%; margin-top: 20px">
                    <el-table-column label="应用权限" width="180">
                        <el-menu :default-active="activeIndex2" @select="handleSelectApply" style="background:white">
                            <el-menu-item v-for="(item,index) in authoritylist" :label="item" :key="index" :index="String(index)" @click="toAuthority(item,index)">
                                {{item.name|ellipsis}}
                            </el-menu-item>
                        </el-menu>    
                    </el-table-column> 
                    <!-- <el-table-column prop="appname" label="应用权限" width="120"></el-table-column> -->
                    <el-table-column width="150" label="全选" :render-header="renderHeader">
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.isDisabled" :disabled="disabledTotal" @change="handleDisabled(scope.row)">{{ scope.row.formname }}</el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column label="表单权限" min-width="180">
                        <template slot-scope="scope">
                            <el-checkbox 
                                :indeterminate="scope.row.isIndeterminateform" 
                                :disabled="!scope.row.isDisabled" 
                                v-model="scope.row.formcheckall" 
                                @change="handleCheckAllChange1(scope.row)">
                                全选
                            </el-checkbox>
                            <div style="margin: 10px 0;"></div>
                            <el-checkbox-group :disabled="!scope.row.isDisabled" v-model="scope.row.formcheckbox" @change="handleCheckedFormChange(scope.row)">
                                <el-checkbox v-for="item in scope.row.formbutton" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                            </el-checkbox-group>
                        </template>
                    </el-table-column>
                    <el-table-column label="列表权限" min-width="170">
                        <template slot-scope="scope">
                            <el-checkbox 
                                :indeterminate="scope.row.isIndeterminatetable" 
                                :disabled="!scope.row.isDisabled" 
                                v-model="scope.row.tablecheckall"
                                @change="handleCheckAllChange2(scope.row)">
                                全选
                            </el-checkbox>
                            <div style="margin: 10px 0;"></div>
                            <el-checkbox-group :disabled="!scope.row.isDisabled" v-model="scope.row.tablecheckbox" @change="handleCheckedTableChange(scope.row)">
                                <el-checkbox v-for="item in scope.row.tablebutton" :label="item.id" :key="item.name">{{item.name}}</el-checkbox>
                            </el-checkbox-group>
                        </template>
                    </el-table-column>
                    <el-table-column label="数据权限">
                        <template slot-scope="scope">
                            <el-radio-group v-model="scope.row.radio" :disabled="!scope.row.isDisabled" >
                                <el-radio :label="1">本人</el-radio>
                                <div style="margin: 10px 0;"></div>
                                <el-radio :label="2">服务部门</el-radio>
                                <div style="margin: 10px 0;"></div>
                                <el-radio :label="3">全部</el-radio>
                            </el-radio-group>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <!-- 角色成员管理 -->
            <el-card id="card2" style="display:none">
                <el-input placeholder="搜索角色（按角色名称）" v-model="searchInput" size="medium" style="width:220px;float:right">
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="roleMemberList()"></i>
                </el-input>
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    :header-cell-style="tableHeaderColor"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column prop="realName" label="成员名称" width="140"></el-table-column>
                    <el-table-column prop="accountName" label="成员名称（英）" width="160"></el-table-column>
                    <el-table-column prop="id" label="成员ID" width="380"></el-table-column>
                    <el-table-column prop="createdTime" label="创建时间" width="200"></el-table-column>
                    <el-table-column prop="userEmail" label="成员邮箱" min-width="200"></el-table-column>
                    <el-table-column prop="userAddress" label="成员地址" min-width="200"></el-table-column>
                    <el-table-column prop="userBirthday" label="成员生日" width="200"></el-table-column>
                </el-table>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="Total"
                    style="text-align:right;margin-top:10px">
                </el-pagination>
            </el-card>
        </el-main>
        <!-- 添加成员 -->
        <!-- <el-dialog title="添加成员" :visible.sync="dialogAddNumber">
            <el-select v-model="value1" multiple placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAddNumber = false">取 消</el-button>
                <el-button type="primary" @click="addnumbersure()">确 定</el-button>
            </span>
        </el-dialog> -->
        <!-- 新建角色 -->
        <el-dialog title="新建角色" :visible.sync="dialogAddRole" width="700px">
            <el-form label-width="180px">
                <el-form-item label="请输入新建角色名称：">
                    <el-input v-model="roleInput"></el-input>
                </el-form-item>
                <el-form-item label="请选择新建角色所在分组：">
                    <el-select v-model="roleInputGroup" style="width:100%">
                        <!-- <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option> -->
                        <el-option
                            v-for="item in roleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAddRole=false;roleInput='';roleInputGroup=''">取 消</el-button>
                <el-button type="primary" @click="NewRole()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 新建角色组 -->
        <el-dialog title="新建角色组" :visible.sync="dialogAddRoleGroup">
            <el-form label-width="170px">
                <el-form-item label="请输入新建角色组名称：">
                    <el-input v-model="roleInputGroupName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAddRoleGroup=false;roleInputGroupName=''">取 消</el-button>
                <el-button type="primary" @click="NewRoleGroup()">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
export default {
    name: 'topbar',
    inject:['reload'],
    filters: {
    //vue中的过滤器filter
        ellipsis (value) {
            if (!value) return ''
            if (value.length > 8) {
                return value.slice(0,8) + '...'
            }
            return value
        }
    },
    data() {
        return {
            activemenu: '00',
            // activeKey: ['0','00'],
            checkedRoleId: [], //选中的角色
            searchInput: '',
            dialogAddNumber: false,
            value1: [],
            value2: [],
            rolelist: [],
            authoritylist: [],
            tableData: [],
            tableData1:[],
            activeIndex: '0',
            activeIndex2: '0',
            activeApply: 0,
            spanArr: [],
            pos: 0,
            //角色成员分页
            currentPage: 1,
            Total: 0,
            pageSize: 10,
            //新建角色
            dialogAddRole: false,
            roleInput:'',
            roleInputGroup: '',
            roleOptions: [],
            //新建角色组
            dialogAddRoleGroup: false,
            roleInputGroupName: '',
            //临时存储
            tableTotalArr: [],
            tableTotalKeys: [],
            number: '',
            disabledTotal: true
        };
    },
    mounted() {
        this.$nextTick( function(){
            this.getRoleList(1)
            // this.getResourceList(0)
        })
    },
    watch: {
        'number': 'getNavType'
    },
    methods: {
        //得到角色列表
        getRoleList() {
            var Params = {
                sceneId: this.$store.state.user.loadScene.id,
                page: "1",
                size: "100"
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            console.log(Params)
            this.$ajax({
                url:'/dev-api/scene/role/list-by-scene',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.code==200) {
                    this.rolelist=[]
                    this.rolelist = res.data.data.list;
                    console.log(this.rolelist)
                    console.log(this.rolelist[0].sceneRoles[0].id)
                    this.roleOptions = []
                    for(var i=0;i<this.rolelist.length;i++) {
                        var obj = {}
                        obj.label = this.rolelist[i].roleGroupName
                        obj.value = this.rolelist[i].id
                        this.roleOptions.push(obj)
                    }
                    console.log(this.roleOptions)
                    this.checkedRoleId.id = this.rolelist[0].sceneRoles[0].id
                    this.roleMemberList()
                    this.getResourceList(0)
                }
                else {
                    this.$message.error(res.data.msg)
                }
            }).catch( error => {
                console.log()
            })
        },
        //得到导航栏的选中信息
        handleSelect(key, keyPath) {
            // console.log(this.activemenu)
            this.activemenu=key
            console.log(this.activemenu)
            console.log(key, keyPath);
            // this.activeKey = keyPath;
            // this.getRoleList();
        },
        handleSelectApply(key, keyPath) {
            console.log(key, keyPath)
            this.activeApply = key
        },
        //得到选中的应用权限信息
        toAuthority(item,index) {
            console.log(item,index)
            // this.getResourceList(index)
            console.log(this.tableTotalArr)
            this.getResourceHaveList(this.authoritylist,this.checkedRoleId,index,this.tableTotalArr)
        },
        //得到所有资源列表（角色权限设置列表）
        getResourceList(index) {
            var Params = {
                sceneId: this.$store.state.user.loadScene.id
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/resource/list',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                if(res.data.code==200) {
                    this.authoritylist = res.data.data
                    // console.log(this.authoritylist)
                    if(this.checkedRoleId)
                        this.getResourceHaveList(this.authoritylist,this.checkedRoleId,index,[])
                    // console.log(this.tableTotalKeys)
                    // console.log(this.tableTotalArr)
                }
                else {
                    this.$message.error(res.data.msg)
                }
            }).catch( error => {
                console.log()
            })
        },
        //角色权限与角色成员页面跳转
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
        //获取资源（已有的角色权限设置列表）
        getResourceHaveList(item,role,index,ifTable) {
            console.log(ifTable)
            this.checkedRoleId = role
            // console.log("oooooooooooooooooooooooooooooooooooooooooooooooooooooooo")
            // console.log(role)
            // console.log(item)
            
            this.roleMemberList()
            var Params = {
                roleId: role.id,
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            console.log(Params)
            this.$ajax({
                url:'/dev-api/resource/role-res-keys',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.code==200) {
                    console.log(res.data.data)
                    this.tableTotalKeys = res.data.data
                    if(ifTable.length!=0)
                        this.tableTotalArr = ifTable
                    else
                        this.tableTotalArr = this.handleKeys(res.data.data)
                    console.log(this.tableTotalArr)
                    var obj = {}
                    var objtotle = []
                    if(this.tableTotalArr[index].children) {
                        for(var i=0;i<this.tableTotalArr[index].children.length;i++) {
                            console.log("ooo")
                            console.log(this.tableTotalArr[index].children[i].name)
                            obj.appname = this.tableTotalArr[index].name
                            obj.appid = this.tableTotalArr[index].id
                            obj.formname = this.tableTotalArr[index].children[i].name
                            obj.formid = this.tableTotalArr[index].children[i].id
                            if(role.roleNameZh=="系统管理员"||!role.roleNameZh) {
                                obj.isDisabled = false
                                this.disabledTotal = true
                            }
                            else {
                                obj.isDisabled = true
                                this.disabledTotal = false
                            }
                            var objtest1 = []
                            var objtest2 = []
                            for(var j=0;j<this.tableTotalArr[index].children[i].children.length;j++) {
                                if((this.tableTotalArr[index].children[i].children[j].sort>=1 && this.tableTotalArr[0].children[i].children[j].sort<=4)||this.tableTotalArr[0].children[i].children[j].name=="打印二维码") {
                                    var buttonobj1=[]
                                    buttonobj1.name = this.tableTotalArr[index].children[i].children[j].name
                                    buttonobj1.id = this.tableTotalArr[index].children[i].children[j].id
                                    buttonobj1.status = this.tableTotalArr[index].children[i].children[j].status
                                    objtest1.push(buttonobj1) 
                                }
                                else {
                                    var buttonobj2=[]
                                    buttonobj2.name = this.tableTotalArr[index].children[i].children[j].name
                                    buttonobj2.id = this.tableTotalArr[index].children[i].children[j].id
                                    buttonobj2.status = this.tableTotalArr[index].children[i].children[j].status
                                    objtest2.push(buttonobj2) 
                                }
                            }
                            //表单权限
                            obj.formbutton = objtest1
                            obj.tablebutton = objtest2
                            obj.formcheckbox = []
                            for(let i in objtest1) {
                                if(objtest1[i].status==1)
                                    obj.formcheckbox.push(objtest1[i].id)
                            }
                            if(obj.formbutton.length==obj.formcheckbox.length)
                                obj.formcheckall = true
                            else if(obj.formcheckbox.length==0) {
                                obj.formcheckall = false
                                obj.isIndeterminateform = false
                            }
                            else
                                obj.isIndeterminateform = true
                            //列表权限
                            obj.tablecheckall = false
                            obj.tablecheckbox = []
                            for(let j in objtest2) {
                                if(objtest2[j].status==1)
                                    obj.tablecheckbox.push(objtest2[j].id)
                            }
                            if(obj.tablebutton.length==obj.tablecheckbox.length)
                                obj.tablecheckall = true
                            else if(obj.tablecheckbox.length==0) {
                                obj.tablecheckall = false
                                obj.isIndeterminatetable = false
                            }
                            else
                                obj.isIndeterminatetable = true
                            obj.radio = 3
                            objtotle.push(obj)
                            obj = {}
                            console.log(objtotle)
                        }
                    }
                    else {
                        obj.appname = this.tableTotalArr[index].name
                        objtotle.push(obj)
                    }
                    this.tableData1 = objtotle
                    console.log(this.tableData1)
                    this.getSpanArr(this.tableData1)
                }
                else {
                    this.$message.error(res.data.msg)
                }
            }).catch( error => {
                console.log()
            })
        },

        //把获取的资源key值信息进行处理
        handleKeys(arr) {
            var tableTotal = []
            console.log("88888888888888888888888888888888888888888888888888888888888888888")
            console.log(this.authoritylist)
            //把资源key值转成树状
            tableTotal = this.authoritylist
            for(var i=0;i<tableTotal.length;i++) {
                if(tableTotal[i].children) {
                    for(var j=0;j<tableTotal[i].children.length;j++) {
                        if(tableTotal[i].children[j].children) {
                            for(var k=0;k<tableTotal[i].children[j].children.length;k++) {
                                if(arr.indexOf(tableTotal[i].children[j].children[k].id.toString())!=-1) {
                                    // tableTotal[i].children[j].children.splice(k,1); 
                                    tableTotal[i].children[j].children[k].status=1
                                }
                                else
                                    tableTotal[i].children[j].children[k].status=0
                            }
                        }
                        else
                            continue
                    }
                }
                else
                    continue
            }
            console.log(tableTotal)
            return tableTotal
        },
        
        //card1的合并表格
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
        },
        //知道合并的行数
        getSpanArr(data) {　
            for (var i = 0; i < data.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1);
                    this.pos = 0
                } else {
                // 判断当前元素与上一个元素是否相同
                    if (data[i].name === data[i - 1].name) {
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    } else {
                        this.spanArr.push(1);
                        this.pos = i;
                    }
                }
            }
        },
        //判断表格行是否禁用
        handleDisabled(row) {
            console.log(row)
        },
        //表单权限的全选和选择按钮
        handleCheckAllChange1(row) {
            console.log(row)
            if(row.formcheckall == true) {
                row.formcheckbox = []
                for(let i in row.formbutton)
                    row.formcheckbox.push(row.formbutton[i].id)
            }
            else
                row.formcheckbox = []
            row.isIndeterminateform = false;
            //变化
            for(var i=0;i<this.tableTotalArr.length;i++) {
                if(this.tableTotalArr[i].children && this.tableTotalArr[i].id==row.appid){
                    for(var j=0;j<this.tableTotalArr[i].children.length;j++) {
                        if(this.tableTotalArr[i].children[j].children && this.tableTotalArr[i].children[j].id==row.formid) {
                            for(var k=0;k<this.tableTotalArr[i].children[j].children.length;k++) {
                                if((this.tableTotalArr[i].children[j].children[k].sort>=1 && this.tableTotalArr[i].children[j].children[k].sort<=4)||this.tableTotalArr[i].children[j].children[k].name=="打印二维码") {
                                    if(row.formcheckall == false && row.isIndeterminateform == false)
                                        this.tableTotalArr[i].children[j].children[k].status=0
                                    else if(row.formcheckall == true)
                                        this.tableTotalArr[i].children[j].children[k].status=1
                                }
                            }
                        }
                        else
                            continue
                    }
                }
                else
                    continue
            }
            console.log(this.tableTotalArr)
        },
        handleCheckedFormChange(row) {
            console.log(row)
            let checkedCount = row.formcheckbox.length;
            row.formcheckall = checkedCount === row.formbutton.length;
            row.isIndeterminateform = checkedCount > 0 && checkedCount < row.formbutton.length
            //变化
            // console.log(this.tableTotalArr)
            for(var i=0;i<this.tableTotalArr.length;i++) {
                if(this.tableTotalArr[i].children && this.tableTotalArr[i].id==row.appid){
                    for(var j=0;j<this.tableTotalArr[i].children.length;j++) {
                        if(this.tableTotalArr[i].children[j].children && this.tableTotalArr[i].children[j].id==row.formid) {
                            for(var k=0;k<this.tableTotalArr[i].children[j].children.length;k++) {
                                if(row.formcheckbox.indexOf(this.tableTotalArr[i].children[j].children[k].id)!=-1)
                                    this.tableTotalArr[i].children[j].children[k].status=1
                                else if((this.tableTotalArr[i].children[j].children[k].sort>=1 && this.tableTotalArr[i].children[j].children[k].sort<=4)||this.tableTotalArr[i].children[j].children[k].name=="打印二维码")
                                    this.tableTotalArr[i].children[j].children[k].status=0
                            }
                        }
                        else
                            continue
                    }
                }
                else
                    continue
            }
            console.log(this.tableTotalArr)
        },
        //列表权限的全选和选择按钮
        handleCheckAllChange2(row) {
            console.log(row)
            if(row.tablecheckall == true) {
                row.tablecheckbox = []
                for(let i in row.tablebutton)
                    row.tablecheckbox.push(row.tablebutton[i].id)
            }
            else
                row.tablecheckbox = []
            row.isIndeterminatetable = false;
            //变化
            for(var i=0;i<this.tableTotalArr.length;i++) {
                if(this.tableTotalArr[i].children && this.tableTotalArr[i].id==row.appid){
                    for(var j=0;j<this.tableTotalArr[i].children.length;j++) {
                        if(this.tableTotalArr[i].children[j].children && this.tableTotalArr[i].children[j].id==row.formid) {
                            for(var k=0;k<this.tableTotalArr[i].children[j].children.length;k++) {
                                if(this.tableTotalArr[i].children[j].children[k].sort>=5 && this.tableTotalArr[i].children[j].children[k].sort<=10 && this.tableTotalArr[i].children[j].children[k].name!="打印二维码") {
                                    if(row.tablecheckall == false && row.isIndeterminatetable == false)
                                        this.tableTotalArr[i].children[j].children[k].status=0
                                    else if(row.tablecheckall == true)
                                        this.tableTotalArr[i].children[j].children[k].status=1
                                }
                            }
                        }
                        else
                            continue
                    }
                }
                else
                    continue
            }
            console.log(this.tableTotalArr)
        },
        handleCheckedTableChange(row) {
            console.log(row)
            let checkedCount = row.tablecheckbox.length;
            row.tablecheckall = checkedCount === row.tablebutton.length;
            row.isIndeterminatetable = checkedCount > 0 && checkedCount < row.tablebutton.length
            //变化
            // console.log(this.tableTotalArr)
            for(var i=0;i<this.tableTotalArr.length;i++) {
                if(this.tableTotalArr[i].children && this.tableTotalArr[i].id==row.appid){
                    for(var j=0;j<this.tableTotalArr[i].children.length;j++) {
                        if(this.tableTotalArr[i].children[j].children && this.tableTotalArr[i].children[j].id==row.formid) {
                            for(var k=0;k<this.tableTotalArr[i].children[j].children.length;k++) {
                                if(row.tablecheckbox.indexOf(this.tableTotalArr[i].children[j].children[k].id)!=-1)
                                    this.tableTotalArr[i].children[j].children[k].status=1
                                else if(this.tableTotalArr[i].children[j].children[k].sort>=5 && this.tableTotalArr[i].children[j].children[k].sort<=10 && this.tableTotalArr[i].children[j].children[k].name!="打印二维码")
                                    this.tableTotalArr[i].children[j].children[k].status=0
                            }
                        }
                        else
                            continue
                    }
                }
                else
                    continue
            }
            console.log(this.tableTotalArr)
        },
        //角色权限设置保存按钮
        toSave() {
            //将树形结构转化为id的数组
            // console.log(this.tableTotalArr)
            var ids = []
            for(var i=0;i<this.tableTotalArr.length;i++) {
                if(this.tableTotalArr[i].children){
                    ids.push(this.tableTotalArr[i].id)
                    for(var j=0;j<this.tableTotalArr[i].children.length;j++) {
                        if(this.tableTotalArr[i].children[j].children) {
                            ids.push(this.tableTotalArr[i].children[j].id)
                            for(var k=0;k<this.tableTotalArr[i].children[j].children.length;k++) {
                                if(this.tableTotalArr[i].children[j].children[k].status==1)
                                    ids.push(this.tableTotalArr[i].children[j].children[k].id)
                            }
                        }
                        else
                            continue
                    }
                }
                else
                    continue
            }
            // console.log(ids.map(String))
            var idsString
            idsString = ids.join(",")
            console.log(idsString)
            var Params = {
                resourceIds: idsString,
                roleId: parseInt(this.checkedRoleId.id)
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            console.log(Params)
            this.$ajax({
                url: '/dev-api/scene/role/grant',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.code==200) {
                    this.$message.success("编辑该业务角色权限成功")
                    // this.getRoleList()
                    // history.go(0) 
                    this.reload();
                }
                else {
                    this.$message.error(res.data.msg)
                }
            }).catch( error => {
                console.log()
            })
        },
        //更改全选表头
        renderHeader(h,{column}){
            return h(
                'div',
                [ 
                    h('el-checkbox',{
                        style:'display:inline-flex;margin-right:10px',
                        props: {
                            checked: true,
                            disabled: this.disabledTotal,
                        },
                        on:{
                            change: ($event, column) => this.select($event, column), // 选中事件 $event, column，这里$event=true,column是input的dom当在select里打印的时候
                        }
                    }),
                    h('span', column.label),
                ],
            )
        },
        select($event, column) {
            console.log($event)
            // $event = true
            if($event == true) {
                for(let i=0;i<this.tableData1.length;i++)
                    this.tableData1[i].isDisabled = true
            }
            else {
                for(let i=0;i<this.tableData1.length;i++)
                    this.tableData1[i].isDisabled = false
            }
        },
        //card2---------------------------------------------------------------------------------------------------------------------------
        //通过角色获取角色成员
        roleMemberList() {
            var Params = {
                roleId: this.checkedRoleId.id,
                page: this.currentPage,
                size: this.pageSize,
                userName: this.searchInput,
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            console.log(Params)
            this.$ajax({
                url: '/dev-api/scene/role/users-by-role',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.code==200) {
                    console.log(res.data.data)
                    this.tableData = res.data.data.list
                    this.Total = res.data.data.total
                }
                else {
                    this.$message.error(res.data.msg)
                }
            }).catch( error => {
                console.log()
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //角色成员的分页
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
        //修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color:rgb(250,250,250);color:black'
            }
        },
        // addNumber() {
        //     this.dialogAddNumber=true;
        // },
        // addnumbersure(){
        //     this.userData=this.userData.concat(this.value1);
        //     this.dialogAddNumber=false;
        // },
        //新建角色---------------------------------------------------------------------------------------------------------------
        NewRole() {
            var Params = {
                roleNameZh: this.roleInput,
                groupId: this.roleInputGroup.toString(),
                sceneCode: this.$store.state.user.loadScene.id
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            console.log(Params)
            this.$ajax({
                url:'/dev-api/scene/role/submit',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                data: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.code==200) {
                    this.dialogAddRole = false
                    this.$message.success("新建角色成功")
                    this.getRoleList()
                }
                else {
                    this.$message.error(res.data.msg)
                }
            }).catch( error => {
                console.log()
            })
        },
        //新建角色组-------------------------------------------------------------------------------------------------------------
        NewRoleGroup() {
            var Params = {
                roleGroupName: this.roleInputGroupName,
                sceneCode: this.$store.state.user.loadScene.id
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            console.log(Params)
            this.$ajax({
                url:'/dev-api/scene/role/group/add',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                data: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.code==200) {
                    this.dialogAddRoleGroup = false
                    this.$message.success("新建角色组成功")
                    this.getRoleList()
                }
                else {
                    this.$message.error(res.data.msg)
                }
            }).catch( error => {
                console.log()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
#authority_container {
    // padding: 0px;
    // height: 100%;
    height: 92vh;
    .el-dialog {
        height: 30%;
    }
    .el-aside {
        background: white;
        box-shadow: 2px 0 5px 0px #e0e5f0;
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
        .el-submenu:hover { 
            background: #ecf1f7 !important;
            .el-dropdown {
                display: block;
            }
            .barstyle {
                display: block;
            }
        }
        .el-submenu.is-active {
            background-color: #ecf1f7 !important;
            .el-dropdown {
                display: block;
            }
            .barstyle {
                display: block;
            }
        }
    }
    // .el-aside {
    //     .el-menu-item:first-child {
    //     &:hover {
    //         background-color: #ffff !important;
    //     }
    //     }
    // }
    .el-main {
        border-left: none;
        padding-top: 10px;
        background-color: rgb(242,245,248);
        .el-card {
            margin-top: 20px;
            height: 79vh;
            display: block;
            overflow-y: auto; 
            overflow-x: auto;
            .el-pagination {
                margin-top: 50vh;
                text-align: center;
            }
        }
        .el-menu {
            background-color: rgb(242,245,248);
        }
        .el-menu-item:hover {
            background-color: rgb(242,245,248);
        }
        .el-menu-item.is-active {
            background-color: rgb(242,245,248);
        }
        .tabs {
            text-align: center;
            width: 60%;
            display: inline-block;
            background-color: rgb(242,245,248);
            .tabs-tab {
                display: inline-block;
                height: 100%;
                padding: 8px 16px;
                margin-right: 16px;
                box-sizing: border-box;
                cursor: pointer;
                text-decoration: none;
                position: relative;
                transition: color 0.3s ease-in-out;
                border-bottom: 3px solid #2d7fff !important;
            }
        }
        .btn-con {
            display: inline-block;
            margin-left: 20px;
        }

        .el-table {
            padding: 10px;
            // border: 1px solid;
            margin: 20px 10px;
        }
    }
    .formcard {
        float: left;
        // border: 1px solid black;
        height: 50px;
        width: 100px;
        text-align: center;
        line-height: 50px;
        background-color: #94c9ff;
        color: white;
        border-radius: 4px;
        margin: 10px 0px;
        margin-right: 30px;
        cursor: pointer;
    }
}
</style>
<style>
/* #authority_container .el-table__body-wrapper {
    height: 80px;
} */
</style>