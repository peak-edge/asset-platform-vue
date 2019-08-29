<template>
    <el-container id="app-container">
        <el-aside width="250px">
            <!-- 显示应用列表 -->
            <span class="title">全部应用</span>
            <i class="el-icon-plus" @click="dialogVisible = true"></i>
            <el-menu :default-active="activeIndex" @select="handleSelect">
                <el-menu-item v-for="(item,index) in applist" :key="index" :index="String(index)">
                    <div class="barstyle"></div>
                    <svg-icon :icon-class="item.iconCls"/>
                    <span slot="title">{{item.applicationName}}</span>
                    <el-dropdown placement="bottom-start" style="width:40px;">
                        <i class="el-icon-s-tools"></i>
                        <el-dropdown-menu slot="dropdown" class="el-dropdown-link1">
                            <el-dropdown-item>重命名</el-dropdown-item>
                            <el-dropdown-item>报表配置到移动端首页</el-dropdown-item>
                            <el-dropdown-item>发布到钉钉工作台</el-dropdown-item>
                            <el-dropdown-item>发布给其他企业</el-dropdown-item>
                            <el-dropdown-item @click.native="deleteApp(item.id)">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <!--应用列表的各类表单 -->
        <el-main>
            <span>{{title}}</span>
            <div class="buttongroup" style="margin-bottom:-50px">
                <el-button @click="addform1(title,icon,id,ybyid)"><i class="el-icon-plus"></i>表单</el-button>
                <el-button><i class="el-icon-plus"></i>报表</el-button>
                <el-button @click="dialogVisible2 = true" style="margin-left:20px;"><i class="el-icon-plus"></i>分组</el-button>
            </div>
            <div class="formcard" v-for="(item, index) in formlist" :key="index">
                <p style="margin-left: 5px">{{item.name}}</p>
                <div v-if="item.children.length!=0">
                    <el-card 
                        @click.native="addform2(title,icon,id,ybyid,item.groupName,item.formName,item.id,item.formjson,form)"
                        v-for="(form, index) in item.children" :key="index">
                        <svg-icon v-rainbow icon-class="icon-Financial_025"/>&nbsp;
                        {{form.name}}
                    </el-card>
                </div>
            </div>
        </el-main>

        <!-- 新建应用对话框 -->
        <el-dialog
            title="新建应用"
            :visible.sync="dialogVisible"
            width="520px"
            center>
            <el-form>
                <el-form-item label="应用名称：">
                    <el-input placeholder="请输入应用名称" v-model="appname" style="width:380px" clearable></el-input>
                </el-form-item>
                <el-form-item label="应用图标：">
                    <el-select placeholder="请选择应用图标" v-model="value" style="width:380px" >
                        <el-card>
                            <!-- 待完善 -->
                            <el-pagination small layout="prev, pager, next" :total="50"> </el-pagination>
                            <el-option style="width:50px;float:left;border: 1px solid #e6edfd" 
                                v-for="item in options" 
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"> 
                                <svg-icon style="font-size:24px;" :icon-class="item.value" />
                            </el-option>
                        </el-card>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false;appname = ''">取 消</el-button>
                <el-button type="primary" @click="newApp()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新建分组对话框 -->
        <el-dialog
            title="新建分组"
            :visible.sync="dialogVisible2"
            width="520px"
            center>
            <el-form>
                <el-form-item label="分组名称：">
                    <el-input placeholder="请输入新的分组名称" v-model="groupname" style="width:380px" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false;groupname = ''">取 消</el-button>
                <el-button type="primary" @click="newGroup()">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
import { options } from '@/icons/icon.json'
// import {MakingForm} from 'form-making'
// Vue.component(MakingForm.name, MakingForm)
export default {
    inject:['reload'],
    data() {
        return {
            //应用列表
            applist: [],
            ybyapplist: [],
            activeIndex: '0',
            activeKey: '0',
            //右侧标题及内容
            title: '',
            icon: '',
            id: '',
            ybyid: '',
            formlist: [],
            formName: '',
            formid: '',
            //传每个表单所携带json
            formjson: {},
            key() {
                return this.$route.fullPath
            },
            newappname: '',
            //新建应用对话框及其值
            dialogVisible: false,
            appname: '',
            value: '',
            appid: '',
            options: options,
            //新建分组对话框及其值
            //对话框及其值
            dialogVisible2: false,
            groupname: '',
        };
    },
    directives:{
        'rainbow':{
            bind(el,binding,vnode){
                el.style.color = '#' + Math.random().toString(16).slice(2,8);//随机颜色
            }
        },
    },
    mounted () {
        this.$nextTick( function(){
            this.getAppList(1)
            // this.getYbyAppList()
        })
    },
    methods: {
        //得到导航栏的选中信息
        handleSelect(key, keyPath) {
            this.activeKey = key;
            console.log(this.activeKey)
            this.getAppFormList();
        },
        //得到APP应用列表
        getAppList() {
            var Params = {
                sceneId: this.$store.state.user.loadScene.id,
            }
            var Params2 = {
                Authorization: this.$store.state.user.token,
            }
            this.$ajax({
                url: '/dev-api/resource/tree',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                this.applist=[]
                console.log(res)
                for(let i=0;i<res.data.data.length;i++)
                {
                    let obj = {}
                    obj.id = res.data.data[i].id
                    obj.applicationName = res.data.data[i].name
                    obj.iconCls = res.data.data[i].iconCls
                    obj.path = res.data.data[i].path
                    this.applist.push(obj)
                }
                console.log(this.applist)
                this.getYbyAppList()
                // this.getAppFormList()
            }).catch( error => {
                console.log()
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
                this.getAppFormList()
            }).catch( error => {
                console.log()
            })
        },
        // 得到APP应用及其表单的列表
        getAppFormList() {
            console.log(this.activeKey)
            console.log(this.applist[this.activeKey])
            console.log(this.ybyapplist)
            // this.appid = this.applist[this.activeKey].id
            this.title = this.applist[this.activeKey].applicationName
            this.icon = this.applist[this.activeKey].iconCls
            this.id = this.applist[this.activeKey].id
            var k = false
            for(let i=0;i<this.ybyapplist.length;i++)
            {
                if(this.ybyapplist[i].applicationName == this.title && this.ybyapplist[i].iconCls == this.icon) {
                    this.ybyid = this.ybyapplist[i].id
                    k = true
                }
            }
            if(k==false)
                this.ybyid = ''
            console.log(this.title)
            console.log(this.icon)
            console.log(this.id)
            console.log(this.ybyid)
            var Params = {
                appId: this.id,
                sceneId: this.$store.state.user.loadScene.id,
                userId: this.$store.state.user.userId
            }
            var Params2 = {
                Authorization: this.$store.state.user.token,
            }
            this.$ajax({
                url:'/dev-api/resource/form/list',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                this.formlist = res.data.data
                console.log("--------------formlist---------------")
                console.log(this.formlist)
            }).catch( error => {
                this.formlist=[]
                console.log()
            })
            // console.log(this.activeKey)
            // console.log(this.applist[this.activeKey])
            // this.title = this.applist[this.activeKey].applicationName
            // this.icon = this.applist[this.activeKey].iconCls
            // for(let i=0;i<this.ybyapplist.length;i++)
            // {
            //     if(this.ybyapplist[i].applicationName == this.title && this.ybyapplist[i].iconCls == this.icon) {
            //         this.id = this.ybyapplist[i].id
            //     }
            // }
            // // this.id = this.applist[this.activeKey].id
            // console.log(this.title)
            // console.log(this.icon)
            // console.log(this.id)
            // var Params = {
            //     app_id: this.id,
            //     group_id: -1,
            //     form_status: -1
            // }
            // console.log(Params)
            // this.$ajax({
            //     url:'/my-api/form_model/models',
            //     method: 'get',
            //     contentType: "application/json; charset=utf-8",
            //     params: Params
            // }).then( res => {
            //     console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")
            //     console.log(res)
            //     this.formlist=[]
            //     for(let i=0;i<res.data.obj.length;i++)
            //     {
            //         let obj2 = {}
            //         obj2.id = res.data.obj[i].id
            //         obj2.formName = res.data.obj[i].formName
            //         obj2.iconCls = res.data.obj[i].iconCls
            //         obj2.groupId = res.data.obj[i].groupId
            //         obj2.modelJson = res.data.obj[i].modelSheetStr
            //         this.formlist.push(obj2)
            //     }
            //     console.log(this.formlist)
            // }).catch( error => {
            //     this.formlist=[]
            //     console.log()
            // })
        },
        //跳转至添加表单
        addform1(title,icon,id,ybyid,groupname,formName,formid,formjson) {
            console.log(title,icon,id,ybyid,groupname,formName,formid,formjson)
            this.$router.push({ 
                path: '/form',
                query: {
                    apptitle:title,
                    appicon:icon,
                    appid:id,
                    appybyid: ybyid,
                    formName:formName,
                    formid:formid,
                    formjson:formjson,
                }
            })
        },
        //跳转至编辑表单
        addform2(title,icon,id,ybyid,groupname,formName,formid,formjson,form) {
            console.log(title,icon,id,ybyid,groupname,formName,formid,formjson,form)
            // console.log(title,icon,id,ybyid,groupname,formName,formid,formjson)
            var Params = {
                app_id: ybyid,
                group_id: -1,
                form_status: -1
            }
            console.log(Params)
            this.$ajax({
                url:'/my-api/form_model/models',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params
            }).then( res => {
                console.log(res)
                console.log(ybyid)
                if(res.data.obj) {
                    for(let i=0;i<res.data.obj.length;i++) {
                        if(res.data.obj[i].formName == form.name) {
                            formName = res.data.obj[i].formName
                            formid = res.data.obj[i].id
                            formjson = res.data.obj[i].modelSheetStr
                        }
                    }
                    console.log(title,icon,id,ybyid,groupname,formName,formid,formjson)
                    this.$router.push({ 
                        path: '/form',
                        query: {
                            apptitle:title,
                            appicon:icon,
                            appid:id,
                            appybyid: ybyid,
                            formName:formName,
                            formid:formid,
                            formjson:formjson,
                        }
                    })
                }
                else 
                    this.$message.error("该表单不存在")
            }).catch( error => {
                console.log()
            })
        },
        //第一个新建应用对话框----------------------------------------------------------------------------------------------------------
        //1.输入完信息调用新建应用接口
        newApp() {
            this.dialogVisible = false;
            var Params = {
                applicationName: this.appname,
                iconCls: this.value
            }
            console.log(Params)
            this.$ajax({
                url:'/my-api/application/addApp',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                data: Params
            }).then( res => {
                if(res.data.status==200) {
                    this.$message.success("新建应用成功")
                    // this.getYbyAppList()
                    // this.newAppSetting()
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
                        this.newAppSetting()
                    }).catch( error => {
                        console.log()
                    })
                }
                else
                    this.$message.error(res.data.msg)
            }).catch( error => {
                this.$message.error("新建任务失败")
                console.log()
            })
        },
        //2.确定数据存储成功后调用 （将这个表单加在权限里）
        newAppSetting() {
            console.log(this.ybyapplist)
            for(let i=0;i<this.ybyapplist.length;i++)
            {
                if(this.ybyapplist[i].applicationName == this.appname && this.ybyapplist[i].iconCls == this.value)
                    this.appid = this.ybyapplist[i].id
            }
            var Params = {
                applicationName: this.appname,
                iconCls: this.value,
                id: this.appid,
            }
            var Params1 = {
                sceneId: this.$store.state.user.loadScene.id
            }
            var Params2 = {
                Authorization: this.$store.state.user.token,
            }
            console.log(Params)
            this.$ajax({
                url:'/dev-api/resource/app/add',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                data: Params,
                params: Params1,
                headers: Params2
            }).then( res => {
                console.log("8888888888888888888888888888888888")
                console.log(res)
                if(res.data.status==200) {
                    this.$message.success("表单加在权限中成功")
                    this.getAppList()
                }
                else
                    this.$message.error(res.data.msg)
            }).catch( error => {
                this.$message.error("表单加在权限中失败")
                console.log()
            })
            this.reload();
        },
        //删除应用
        deleteApp(id) {
            var Params = {
                id: id
            }
            this.$ajax({
                url:'/my-api/application/deleteApp',
                method: 'delete',
                contentType: "application/json; charset=utf-8",
                data: Params
            }).then( res => {
                this.$message({
                    type: 'success',
                    message: '删除成功' 
                });
            }).catch( error => {
                this.$message({
                    type: 'error',
                    message: '删除失败' 
                });
                console.log()
            })
            this.reload();
        },
        //第二个新建分组对话框--------------------------------------------------------------------------------------------------------------
        //新增或修改分组
        newGroup() {
            var Params = {
                appId: this.id,
                // id: this.ybyid,
                name: this.groupname,
                sceneId: this.$store.state.user.loadScene.id
            }
            var Params2 = {
                Authorization: this.$store.state.user.token,
            }
            console.log(Params)
            this.$ajax({
                url:'/dev-api/resource/group/submit',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                data: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.code==200) {
                    this.$message.success("添加分组成功")
                    this.dialogVisible2 = false
                    // this.reload()
                    this.getAppFormList()
                }
                else
                    this.$message.error(res.data.msg)
            }).catch( error => {
                console.log()
            })
        },
    }
};
</script>

<style lang="scss" scoped>
#app-container {
    height: 92vh;
    .el-dialog {
        height: 30%;
    }
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
        padding:20px;
        // background:white;
        // background-color: #f3f5f8;
        background-color:rgb(242,245,248);
        // background-color:rgb(240,246,248);
        span {
            line-height: 2;
            font-size: 18px;
            font-weight: 600;
            padding-left: 8px;
            color: #555;
        }
        .buttongroup {
            padding-bottom: 70px;
            .el-button {
                color: #409EFF;
                border: #f3f5f8;
                margin: 10px 10px 0 6px;
                padding: 12px 17px 12px 17px;
                border: 1px solid #EBEEF5;
            }
        }
        .formcard {
            // padding-top: 120px;
            margin: 30px 0 0 6px;
            .el-card {
                width: 215px;
                float: left;
                margin-right: 10px;
                margin-bottom: 10px;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,0)
            }
            .el-card:hover {
                background: #d8e0ec;
            }
        }
    }
}
</style>
<style>
.el-card__body {
    padding: 20px !important;
}
</style>



