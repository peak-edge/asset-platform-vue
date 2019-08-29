<template>
    <el-container class="home-container">
        <el-header>
            <svg-icon :icon-class="appicon"/>
            <span>{{appname}}</span>
            <el-dropdown placement="bottom-start" style="width:40px;">
                <span>
                    <i class="el-icon-s-tools"></i>
                </span>
                <el-dropdown-menu slot="dropdown" class="el-dropdown-link1">
                    <el-dropdown-item>重命名</el-dropdown-item>
                    <el-dropdown-item divided>删除</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <!-- 右侧 user-->
            <span class="username" @click="toReg()" style="font-size:15px">{{$store.state.user.realName}}</span>
            <el-tooltip
                class="item"
                effect="dark"
                content="应用工厂"
                placement="bottom">
                <i class="el-icon-setting" @click="toMyApp()"></i>
            </el-tooltip>
        </el-header>
        <el-container>
            <el-aside width="250px">
                <!-- 显示角色列表 -->
                <el-menu 
                    v-for="(item,index) in formlist" 
                    :key="index" 
                    :default-openeds="['0','1']"
                    default-active="00"
                    @select="handleSelect">
                    <el-submenu :index="String(index)">
                        <template slot="title">
                            &nbsp;
                            <i class="el-icon-menu"></i>
                            <span>{{item.name}}</span>
                        </template> 
                        <el-menu-item v-for="(form,index2) in item.children" :key="index2" :index="String(index)+String(index2)">
                            {{form.name}}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <div class="table">
                    <el-button type="primary" style="float:left;padding-left:15px;margin-top:1px;margin-right:15px;" @click="dialogVisible = false"><i class="el-icon-plus"></i> 新增</el-button>
                    <div class="buttongroup">
                        <el-button v-for="(item,index) in buttonlist1" :key="index">
                            <svg-icon :class="colorstyle[index]" :icon-class="item.iconCls"/>{{item.name}}
                        </el-button>
                    </div>
                    <el-dropdown style="float:right;padding-left:25px">
                        <span>列表<i class="el-icon-arrow-down el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown" class="el-dropdown-link2">
                            <el-dropdown-item>列表</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown style="float:right">
                        <span>全部<i class="el-icon-arrow-down el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown" class="el-dropdown-link3">
                            <el-dropdown-item>全部</el-dropdown-item>
                            <el-dropdown-item>我部门的</el-dropdown-item>
                            <el-dropdown-item>我的</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-table
                        :data="tableData"
                        style="width: 100%"
                        :default-sort = "{prop: 'date', order: 'descending'}">
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column prop="procInstName" label="实例名称" min-width="140"></el-table-column>
                        <el-table-column prop="procInstId" label="实例ID" min-width="360"></el-table-column>
                        <!-- <el-table-column prop="status" label="实例状态" sortable width="120"></el-table-column> -->
                        <el-table-column 
                            prop="status" 
                            label="实例状态" 
                            min-width="140"
                            :filters="[{ text: '激活状态', value: '激活状态' }, { text: '被挂起', value: '被挂起' }, { text: '被删除', value: '被删除' },{ text: '已完成', value: '已完成' }]"
                            :filter-method="filterTag"
                            filter-placement="bottom-end">
                            <template slot-scope="scope">
                                <el-tag
                                    :type="chooseType(scope)"
                                    disable-transitions>{{scope.row.status}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="commitTime" label="创建时间" sortable min-width="210"></el-table-column>
                        <el-table-column prop="committer" label="创建人" min-width="110"></el-table-column>
                        <el-table-column prop="picture" label="运行流转图" min-width="100">
                            <!-- <template slot-scope="scope">
                                <el-button @click="handleSee(scope.row)" type="text" icon="el-icon-view" size="small">查看</el-button>
                            </template> -->
                            <template slot-scope="scope">
                                <el-popover
                                    placement="right"
                                    trigger="hover">
                                    <img v-if="scope.row" :src="getPicture(scope.row)" width=100% height=100%>
                                    <img slot="reference" :src="getPicture(scope.row)" :alt="getPicture(scope.row)" width=100% height=100%>
                                </el-popover>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 弹出框 -->
                <div class="addPage" :hidden="dialogVisible" style="overflow:scroll; ">
                    <span style="float:left;line-height:3.2;font-size:16px;padding-left:20px;">使用说明</span>
                    <div class="navbar-header">
                        <el-button @click="dialogVisible = true"><i class="el-icon-close"></i><span>关闭</span></el-button>
                        <el-button v-for="(item,index) in buttonlist2" :key="index" @click="handleWay(item.name)">
                            <svg-icon :icon-class="item.iconCls"/><span>{{item.name}}</span>
                        </el-button>
                    </div>
                    <div class="main" style="padding:40px;">
                        <fm-generate-form
                            :key="index"
                            :data="jsonData"
                            :remote="remoteFuncs"
                            :value="values"
                            ref="generateForm">
                        </fm-generate-form>
                    </div>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
// import { mapGetters } from 'vuex'
// import { options } from '@/icons/icon.json'
export default {
    name: 'Dashboard',
    inject:['reload'],
    data() {
        return {
            ybyid: '',
            //页面传过来的值
            appid: '',
            appicon: '',
            appname: '',
            apppath: '',
            //应用列表
            formlist: [],
            forminfolist: [],
            modelJson: '',
            formId: '',
            activeIndex: '0',
            activeKey: ['0','00'],
            //按钮列表,应用按钮和表单按钮两个部分
            buttonlist: [],
            buttonlist1: [],
            buttonlist2: [],
            tableData: [],
            //弹出框
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
            index: 0,
            // applist: [],
            // appname: '',
            // value: '',
            // options: options,
            // pagesize:4,
            // currentPage:1
            colorstyle:[
                "ss1",
                "ss2",
                "ss3",
                "ss4",
                "ss5",
                "ss6",
                "ss7"
            ]
        }
    },
    created () {
        this.getParams()
    },
    mounted () {
        this.$nextTick( function(){
            this.getAppList(1);
            // this.getFormList(1);
        })
    },
    watch: {
        '$route':'getParams'
    },
    methods: {
        //得到路由传过来的参数
        getParams() {
            const routerParamsid = this.$route.query.appId
            const routerParamsicon = this.$route.query.appIcon
            const routerParamsname = this.$route.query.appName
            const routerParamspath = this.$route.query.appPath
            this.appid = routerParamsid;
            this.appicon = routerParamsicon;
            this.appname = routerParamsname;
            this.apppath = routerParamspath;
            console.log(routerParamsid)
            console.log(routerParamsicon)
            console.log(routerParamsname)
            console.log(routerParamspath)
        },
        // 得到APP应用列表
        getAppList() {
            var Params = {
                appId: this.appid,
                sceneId: this.$store.state.user.loadScene.id,
                userId: this.$store.state.user.userId
            }
            var Params2 = {
                Authorization: this.$store.state.user.token,
            }
            this.$ajax({
                url: '/dev-api/resource/form/list',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res.data.data)
                this.formlist = res.data.data
                this.getFormList();
                this.getFormInfo();
                // console.log(res.data)
                // this.formlist=[]
                // this.formlist = res.data.obj[0].group
                // console.log(this.formlist)
                // this.buttonlist = []
                // // console.log(this.activeKey)
                // // console.log(this.buttonlist)
                // // console.log(this.formlist[0].children[0])
                // for(let j=0;j<this.formlist[0].children[0].children.length;j++)
                //     {
                //         let obj2 = {}
                //         obj2.id = this.formlist[0].children[0].children[j].id
                //         obj2.name = this.formlist[0].children[0].children[j].name
                //         obj2.iconCls = this.formlist[0].children[0].children[j].iconCls
                //         obj2.path = this.formlist[0].children[0].children[j].path
                //         obj2.sort = this.formlist[0].children[0].children[j].sort
                //         this.buttonlist.push(obj2)
                //     }
                // console.log(this.buttonlist)
                // this.buttonlist1 = []
                // this.buttonlist2 = []
                // for(let k=0;k<this.buttonlist.length;k++)
                // {
                //     if(this.buttonlist[k].path.indexOf("list")!=-1)
                //         this.buttonlist1.push(this.buttonlist[k])
                //     else if(this.buttonlist[k].path.indexOf("form")!=-1)
                //         this.buttonlist2.push(this.buttonlist[k])
                // }
                // console.log(this.buttonlist1)
                // console.log(this.buttonlist2)
                // this.getFormInfo();
            }).catch( error => {
                console.log()
            })
        },
        //得到导航栏的选中信息
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
            this.activeKey = keyPath;
            this.getFormList();
            this.getFormInfo();
            // this.getFormFirst();
        },
        //得到app中按钮的列表
        getFormList() {
            console.log(this.activeKey[1])
            var str = this.activeKey[1].charAt(this.activeKey[1].length-1)
            console.log(this.formlist[this.activeKey[0]].children[str].id)
            console.log(this.formlist[this.activeKey[0]].children[str].name)
            var Params = {
                formResourceId: this.formlist[this.activeKey[0]].children[str].id,
                sceneId: this.$store.state.user.loadScene.id,
                userId: this.$store.state.user.userId
            }
            console.log(Params)
            this.$ajax({
                url:'/dev-api/resource/func/byForm',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params
            }).then( res => {
                console.log(res.data.obj)
                this.buttonlist1 = []
                this.buttonlist2 = []
                for(let i=0;i<res.data.obj.length;i++) {
                    if(res.data.obj[i].level==1)
                        this.buttonlist1.push(res.data.obj[i])
                    else
                        this.buttonlist2.push(res.data.obj[i])
                }
            }).catch( error => {
                console.log()
            })
        },
        //得到该表单的信息
        getFormInfo() {
            var Params = {}
            this.$ajax({
                url:'/my-api/application/appList',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params
            }).then( res => {
                console.log(res)
                console.log(this.appname)
                var ybyapplist = res.data
                for(let i=0;i<ybyapplist.length;i++) {
                    if(ybyapplist[i].applicationName == this.appname) {
                        this.ybyid = ybyapplist[i].id
                    }
                }
                console.log(this.ybyid)
                var Params2 = {
                    app_id: this.ybyid,
                    group_id: -1,
                    form_status: -1
                }
                console.log(Params)
                this.$ajax({
                    url:'/my-api/form_model/models',
                    method: 'get',
                    contentType: "application/json; charset=utf-8",
                    params: Params2
                }).then( res2 => {
                    console.log(res2)
                    var str = this.activeKey[1].charAt(this.activeKey[1].length-1)
                    console.log("oooo")
                    console.log(this.formlist[this.activeKey[0]].children[str].name)
                    for(var i=0;i<res2.data.obj.length;i++) {
                        if(res2.data.obj[i].formName==this.formlist[this.activeKey[0]].children[str].name) {
                            // this.modelJson = res2.data.obj[i].modelSheetStr
                            this.formId = res2.data.obj[i].id
                            console.log(this.formId)
                        }
                    }
                    // console.log(this.modelJson)
                    // this.jsonData = JSON.parse(this.modelJson)
                    //请求第一个节点要填写的表单内容
                    var Params3 = {
                        form_model_id: this.formId
                    }
                    this.$ajax({
                        url:'/my-api/form_inst/form_sheet',
                        method: 'get',
                        contentType: "application/json; charset=utf-8",
                        params: Params3
                    }).then( res3 => {
                        console.log(res3)
                        this.modelJson = res3.data.obj.form_json
                        this.jsonData = JSON.parse(this.modelJson)
                    }).catch( error => {
                        this.$message.error("该表单不符合发布要求")
                        console.log()
                    })
                    //获取当前表单模型下正在运行的实例
                    var Params4 = {
                        form_model_id: this.formId
                    }
                    console.log(Params4)
                    this.$ajax({
                        url:'/my-api/proc_inst/insts',
                        method: 'get',
                        contentType: "application/json; charset=utf-8",
                        params: Params4
                    }).then( res4 => {
                        console.log(res4)
                        this.tableData = res4.data.obj
                        for(var i=0;i<this.tableData.length;i++) {
                            this.tableData[i].commitTime= this.timeFormal(this.tableData[i].commitTime)
                            if(this.tableData[i].status==0)
                                this.tableData[i].status="激活状态"
                            else if(this.tableData[i].status==1)
                                this.tableData[i].status="被挂起"
                            else if(this.tableData[i].status==2)
                                this.tableData[i].status="被删除"
                            else
                                this.tableData[i].status="已完成"
                        }
                    }).catch( error => {
                        console.log()
                    })
                }).catch( error => {
                    console.log()
                })
            }).catch( error => {
                console.log()
            })
        },
        //处理各按钮操作
        handleWay(way) {
            this.$refs.generateForm.getData().then(data => {
                console.log(data)
                // var str = "\""+JSON.stringify(data)+"\"";
                var str = JSON.stringify(data);
                // console.log(str)
                if(way=="提交") {
                    //发布该流程
                    var Params = {
                        form_model_id: this.formId,
                        editor: this.$store.state.user.realName,
                        form_inst_sheet: this.jsonData,
                        form_inst_value: str
                    }
                    console.log(Params)
                    this.$ajax({
                        url:'/my-api/form_inst/save',
                        method: 'post',
                        contentType: "application/json; charset=utf-8",
                        data: Params
                    }).then( res => {
                        console.log(res)
                        if(res.data.status == 200) {
                            this.$message.success("发布成功")
                            this.dialogVisible = true
                            this.getFormInfo()
                        }
                        else
                            this.$message.error(res.data.msg)
                    }).catch( error => {
                        console.log()
                    })
                }
            }).catch(e => {
                console.log("数据校验失败")
            })
        },
        toMyApp() {
            this.$router.push({
                path: '/app'
            })
        },
        //得到叶柄跃的APP应用列表
        getYbyAppList() {
            var Params = {}
            this.$ajax({
                url:'/my-api/application/appList',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params
            }).then( res => {
                console.log(res)
                this.ybyapplist=[]
                for(let i=0;i<res.data.length;i++)
                {
                    let obj = {}
                    obj.id = res.data[i].id
                    obj.applicationName = res.data[i].applicationName
                    obj.iconCls = res.data[i].iconCls
                    obj.path = res.data[i].path
                    this.ybyapplist.push(obj)
                }
                console.log(this.ybyapplist)
            }).catch( error => {
                console.log()
            })
        },
        //table的标签
        filterTag(value, row) {
            return row.status === value;
        },
        //el-tag颜色分配
        chooseType(scope) {
            if(scope.row.status === '激活状态')
                return 'success'
            else if(scope.row.status === '被挂起')
                return 'warning'
            else if(scope.row.status === '被删除')
                return 'error'
            else 
                return 'primary'
        },
        //计算时间差方法
        timeFormal(date)
        {
            var year = new Date(date)
            var month = year.getMonth()+1
            return year.getFullYear()+'-'+month+'-'+year.getDate()+'  '+year.getHours()+':'+year.getMinutes()+':'+year.getSeconds();
        },
        getPicture(row) {
            console.log(row)
            var src = '/my-api/admin/proc_inst/diagram?proc_inst_id='+ row.procInstId
            return src
        }
    }
}
</script>

<style>
.el-dropdown-link1.el-dropdown-menu {
    width:130px;
    padding-top:6px;
    padding-bottom:6px;
}
.el-dropdown-link2.el-dropdown-menu {
    padding:0px;
}
.el-dropdown-link3.el-dropdown-menu {
    padding:0px;
}
.ss1 {
    background: black;
    color: white;
}
.ss2 {
    background: purple;
    color:#17c295;
}
.ss3 {
    background: green;
    color:#fabb0c;
}
.ss4 {
    background: yellow;
    color: #e97763;
}
.ss5 {
    background: gray;
    color:gray;
}
.ss6 {
    background: pink;
}
</style>

<style lang="scss" scoped>
@keyframes bounceInRight {
    0% { right:-200px; opacity: 0.2 } 
    25% { right:0px; opacity: 1 } 
    // 75% { right:10px; opacity: 0.8 } 
    // 100% { right:0px; opacity: 1; } 
}

.home-container {
    height: 100vh;
    .el-header {
        color: #333;
        line-height: 50px;
        border-bottom: 1px solid #efefef;
        background: linear-gradient(180deg,#f9fafd,#e7eef8);
        .svg-icon {
            float:left;
            font-size:28px;
            margin-top:18px;
        }
        span {
            font-size: 16px;
            color: #304265;
            white-space: nowrap;
            margin-left:10px;
            line-height:60px;
        }
        .el-icon-s-tools {
            margin-left:5px;
            color: #B0B0B0;
        }
        .el-icon-setting {
            float: right;
            font-size: 26px;
            margin-top: 15px;
            margin-right: 30px;
            cursor: pointer;
        }
        .username {
            //圆形姓名
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            width: 34px;
            height: 34px;
            background: #107fff;
            border-radius: 30px;
            overflow: hidden;
            margin-right: 20px;
            cursor: pointer;
            color: #fff;
            float: right;
            margin-top: 10px;
        }
    }
    .el-aside {
        background:#f3f5f8;
        box-shadow: 2px 0 5px 0px #e0e5f0;
        .el-menu {
            border-right: 0px;
            background: #f3f5f8;
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
            i {
                float:right;
                margin-top:21px;
                font-size:16px;
                display:none;
                // display: block;
            }
        }
        .el-submenu {
            .el-menu-item {
                background: #ecf1f7 !important;
            }
            .el-menu-item:hover{ 
                background: #ecf1f7 !important;
                i {
                    display: block;
                }
                .barstyle {
                    display: block;
                }
            }
            .el-menu-item.is-active {
                background-color: #ecf1f7 !important;
                i {
                    display: block;
                }
                .barstyle {
                    display: block;
                }
            }
        }
    }

    .el-main {
        padding:20px;
        background:white;
        .buttongroup {
            .el-button {
                border: white;
                padding: 15px;
                float: left;
            }
            .el-button:hover {
                background-color: #F8F8F8;
            }
        }
        .addPage {
            z-index: 999;
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
                    // i {
                    //     vertical-align: middle;
                    //     font-size: 20px;
                    //     color: #8AAED1;
                    // }
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
    body > .el-container {
        margin-bottom: 40px;
    }
}
</style>
