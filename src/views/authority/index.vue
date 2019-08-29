<template>
    <el-container id="authority_container">
        <el-aside width="250px">
            <!-- 角色按钮 -->
            <div class="button-group" style="margin:15px 0 15px 27px;">
                <el-button size="mini" type="primary" @click="dialogAddRole = true" style="margin-right:10px">新建角色</el-button>
                <el-button size="mini" type="primary">新建角色组</el-button>
            </div>
            <el-input placeholder="搜索角色" v-model="searchInput" size="medium" style="width:220px;margin-left:15px">
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <!-- 显示角色列表 -->
            <el-menu v-for="(item,index) in rolelist" :key="index">
                <el-submenu :index="String(index)">
                    <template slot="title">
                        <i class="el-icon-coordinate"></i>
                        <span>{{item.roleGroupName}}</span>
                    </template> 
                    <el-menu-item v-for="(role,index) in item.sceneRoles" :key="index" @click="getResourceHaveList(item,role)">
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
                    <el-button type="primary" size="mini" style="float:right;margin-top:12px">保存</el-button>
                    <el-button type="primary" size="mini" style="float:right;margin-right:8px;margin-top:12px">同步角色</el-button>
                </div>
                <div id="buttongroup2" style="display:none">
                    <el-button type="primary" size="mini" style="float:right;margin-top:12px">添加成员</el-button>
                    <el-button type="primary" size="mini" style="float:right;margin-right:8px;margin-top:12px">批量移除</el-button>
                </div>
            </el-menu>
            <!-- 角色权限设置 -->
            <el-card id="card1">
                <el-table
                    :data="tableData1"
                    border
                    :span-method="objectSpanMethod"
                    style="width: 100%; margin-top: 20px">
                    <el-table-column label="应用权限" width="180">
                        <el-menu :default-active="activeIndex" style="background:white">
                            <el-menu-item v-for="(item,index) in applist" :label="item" :key="index" :index="String(index)" @click="toAuthority(item,index)">
                                {{item.name}}
                            </el-menu-item>
                        </el-menu>    
                    </el-table-column> 
                    <!-- <el-table-column prop="appname" label="应用权限" width="120"></el-table-column> -->
                    <el-table-column width="150" label="全选" :render-header="renderHeader">
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.isDisabled" @change="handleDisabled(scope.row)">{{ scope.row.formname }}</el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column label="表单权限" min-width="160">
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
                                <el-checkbox v-for="item in scope.row.formbutton" :label="item" :key="item">{{item}}</el-checkbox>
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
                                <el-checkbox v-for="item in scope.row.tablebutton" :label="item" :key="item">{{item}}</el-checkbox>
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
                 <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    :header-cell-style="tableHeaderColor"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column prop="roleNameZh" label="成员名称" width="140"></el-table-column>
                    <el-table-column prop="roleName" label="成员名称（英）" width="180"></el-table-column>
                    <el-table-column prop="id" label="成员ID" width="110"></el-table-column>
                    <el-table-column prop="groupId" label="分组ID" width="110"></el-table-column>
                    <el-table-column prop="createdTime" label="创建时间" min-width="140"></el-table-column>
                    <el-table-column prop="roleDescription" label="备注" min-width="140"></el-table-column>
                </el-table>
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
        <el-dialog title="新建角色" :visible.sync="dialogAddRole">
            <el-input v-model="rolenput" placeholder="请输入内容"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAddRole = false">取 消</el-button>
                <el-button type="primary" @click="dialogAddRole = false">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
export default {
    name: 'topbar',
    data() {
        return {
            searchInput: '',
            dialogAddNumber: false,
            dialogAddRole: false,
            rolenput:'',
            value1: [],
            value2: [],
            rolelist: [],
            authoritylist: [],
            tableData: [],
            tableData1:[],
            activeIndex: '0',
            applist: [],
            spanArr: [],
            pos: 0
        };
    },
    mounted() {
        this.$nextTick( function(){
            this.getRoleList(1)
            this.getResourceList(0)
        })
    },
    computed: {

    },
    methods: {
        //得到角色列表
        getRoleList() {
            var Params = {
                sceneId: this.$store.state.user.loadScene.id
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            console.log(Params)
            this.$ajax({
                url:'/dev-api/scene/role/list',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.status==200) {
                    this.rolelist=[]
                    this.rolelist = res.data.obj;
                    console.log(this.rolelist)
                    this.tableData = []
                    for(var i=0;i<this.rolelist.length;i++) {
                        for(var j=0;j<this.rolelist[i].sceneRoles.length;j++)
                        this.tableData.push(this.rolelist[i].sceneRoles[j])
                    }
                    console.log(this.tableData)
                }
                else {
                    this.$message.error(res.data.msg)
                }
            }).catch( error => {
                console.log()
            })
        },
        //得到选中的应用权限信息
        toAuthority(item,index) {
            console.log(item,index)
            this.getResourceList(index)
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
                console.log(res)
                if(res.data.code==200) {
                    console.log("aaa")
                    this.authoritylist = res.data.data
                    console.log(this.authoritylist)
                    // for(var i=0;i<this.authoritylist.length;i++) {
                    //     this.tableData1[i].applyname = this.authoritylist
                    // }
                    // console.log(this.authoritylist[0].children)
                    // for(var i=0;i<this.authoritylist[0].children.length;i++) {
                    //     this.tableData1[i].formname = this.authoritylist[0].children[i].name
                    // }
                    this.applist = []
                    for(var number=0;number<this.authoritylist.length;number++) {
                        var obj = {}
                        obj.name = this.authoritylist[number].name
                        obj.id = this.authoritylist[number].id
                        obj.children = this.authoritylist[number].children
                        this.applist.push(obj)
                    }
                    console.log(this.applist)

                    // if(!index)
                    //     index = 0
                    // console.log("ppppppppppppppppppppppppppppppppp"+index)
                    // console.log(this.authoritylist)
                    var obj = {}
                    var objtotle = []
                    for(var i=0;i<this.authoritylist[index].children.length;i++) {
                        console.log("ooo")
                        console.log(this.authoritylist[index].children[i].name)
                        obj.appname = this.authoritylist[index].name
                        obj.formname = this.authoritylist[index].children[i].name
                        obj.isDisabled = true
                        var objtest1 = []
                        var objtest2 = []
                        for(var j=0;j<this.authoritylist[index].children[i].children.length;j++) {
                            // console.log(this.authoritylist[0].children[i].children[j].name)
                            if((this.authoritylist[index].children[i].children[j].sort>=1 && this.authoritylist[0].children[i].children[j].sort<=4)||this.authoritylist[0].children[i].children[j].name=="打印二维码")
                                objtest1.push(this.authoritylist[index].children[i].children[j].name)
                            else 
                                objtest2.push(this.authoritylist[index].children[i].children[j].name)
                        }
                        obj.formbutton = objtest1
                        obj.tablebutton = objtest2
                        obj.formcheckall = true
                        obj.formcheckbox = objtest1
                        obj.isIndeterminateform = false
                        obj.tablecheckall = true
                        obj.tablecheckbox = objtest2
                        obj.isIndeterminatetable = false
                        obj.radio = 3
                        objtotle.push(obj)
                        obj = {}
                        console.log(objtotle)
                    }
                    this.tableData1 = objtotle
                    console.log(this.tableData1)
                    this.getSpanArr(this.tableData1)
                        // obj[i].formname = []
                    // this.tableData1[0].applyname = this.authoritylist[0].name
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
        getResourceHaveList(item,role) {
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
                }
                else {
                    this.$message.error(res.data.msg)
                }
            }).catch( error => {
                console.log()
            })
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
            if(row.formcheckall == true)
                row.formcheckbox = row.formbutton
            else
                row.formcheckbox = []
            row.isIndeterminateform = false;
        },
        handleCheckedFormChange(row) {
            console.log(row)
            let checkedCount = row.formcheckbox.length;
            row.formcheckall = checkedCount === row.formbutton.length;
            row.isIndeterminateform = checkedCount > 0 && checkedCount < row.formbutton.length
        },
        //列表权限的全选和选择按钮
        handleCheckAllChange2(row) {
            console.log(row)
            if(row.tablecheckall == true)
                row.tablecheckbox = row.tablebutton
            else
                row.tablecheckbox = []
            row.isIndeterminatetable = false;
        },
        handleCheckedTableChange(row) {
            console.log(row)
            let checkedCount = row.tablecheckbox.length;
            row.tablecheckall = checkedCount === row.tablebutton.length;
            row.isIndeterminatetable = checkedCount > 0 && checkedCount < row.tablebutton.length
        },
        //更改全选表头
        renderHeader(h,{column}){
            return h(
                'div',
                [ 
                    h('el-checkbox',{
                        style:'display:inline-flex;margin-right:10px',
                        props: {
                            checked: true
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
        //card2的选中框
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        async logout() {
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClick() {

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
            height: 78vh;
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
