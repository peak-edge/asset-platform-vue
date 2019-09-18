<template>
    <el-container class="home-container">
        <el-header>
            <img class="logo" src="https://cn.vuejs.org/images/logo.png">
            <el-input
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                size="small">
            </el-input>
            <!-- 右侧 user-->
            <span class="username" @click="toReg()">{{$store.state.user.realName}}</span>
            <!-- 右侧 应用工厂-->
            <el-tooltip
                effect="dark"
                content="注销"
                placement="bottom">
                <i class="el-icon-switch-button" @click="logout()"> </i>
            </el-tooltip>
            <el-tooltip
                effect="dark"
                content="应用工厂"
                placement="bottom">
                <i class="el-icon-setting" @click="toMyApp()"></i>
            </el-tooltip>
            <el-tooltip
                effect="dark"
                content="切换场景"
                placement="bottom">
                <i class="el-icon-guide" @click="centerDialogVisible = true" style="float:right;font-size:23px;margin-top:18px;margin-right:28px"></i>
            </el-tooltip>
            <!-- <el-tooltip
                effect="dark"
                content="控制台"
                placement="bottom">
                <i class="el-icon-data-analysis" @click="toControlCenter()" style="float:right;font-size:23px;margin-top:18px;margin-right:28px"></i>
            </el-tooltip> -->
            <!-- <span type="text" style="float:right;padding-right:30px;padding-top:5px">控制台</span> -->
        </el-header>
        <el-header style="box-shadow: 0 1.5px 8px 0 #e0e5f0;background:white">
            <el-row>
                <el-col :span="22">
                    <el-button class="button1" shadow="hover"  @click="dialogVisible=true">
                        <svg-icon icon-class="icon-add" style="font-size:28px;"/> &nbsp;新建应用
                    </el-button>
                    <el-button class="button2" shadow="hover" v-for="(item,index) in applist" :key="index" @click="toAppInfomation(item.id,item.iconCls,item.applicationName,item.path)"> 
                        <svg-icon :icon-class="item.iconCls" style="font-size:23px;"/> &nbsp;{{item.applicationName}}
                    </el-button>
                </el-col>
                <el-col :span="2">
                    <el-dropdown trigger="click" style="margin-top:5px;">
                        <span class="el-dropdown-link" style="cursor:pointer;color:#409EFF;">
                            显示全部应用
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item,index) in applist" :key="index" @click.native="toAppInfomation(item.id,item.iconCls,item.applicationName,item.path)">
                                <svg-icon :icon-class="item.iconCls" style="font-size:23px;"/> &nbsp;{{item.applicationName}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-row :gutter="20">
                <el-col :span="15">
                <div class="grid-content bg-purple">
                    <div class="shared-head">
                        <span class="head__title"> 我的流程</span>
                        <div class="message__more">全部</div>
                    </div>
                    <ul class="work-list__content">
                        <li class="to_do_list" @click="toMyFlow(0)">
                            <div class="todo__title">待办</div>
                            <span class="todo__count">{{myflowlist[0].count}}</span>
                        </li>
                        <li class="to_do_list" @click="toMyFlow(1)">
                            <div class="todo__title">待阅</div>
                            <span class="todo__count">{{myflowlist[1].count}}</span>
                        </li>
                        <li class="to_do_list" @click="toMyFlow(2)">
                            <div class="todo__title">我发起的</div>
                            <span class="todo__count">0</span>
                        </li>
                    </ul>
                </div>
                </el-col>
                <el-col :span="9">
                    <div class="grid-content bg-purple">
                        <div class="shared-head">
                            <span class="head__title"> 提醒事项</span>
                            <div class="message__more">更多</div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="24">
                    <div class="grid-content bg-purple" style="height:415px;margin-top:20px;">
                        <img src="" alt="">
                        <el-button type="text" @click="toDefineHome()">自定义首页添加内容</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-main>

        <!-- 场景选择弹出框 -->
        <el-dialog
            title="请选择你所要管理的场景:"
            :visible.sync="centerDialogVisible"
            width="50%"
            :show-close="false"
            :close-on-click-modal="false"
            center>
            <el-row style="margin-bottom:10px">
                <el-col :span="6">
                    <el-button type="text" style="padding-top:2px" @click="otherScene()">+ 点击绑定其它场景</el-button>
                </el-col>
                <el-col :span="18">
                    <span v-if="checkedradio!=''">新绑定场景：{{checkedradio.sceneName}}</span>
                </el-col>
            </el-row>
            
            <el-row :gutter="20">
                <el-col :span="6" v-for="(item,index) in scenesByUser" :key="index" :index="String(index)">
                    <el-card style="min-height:140px;margin-bottom:10px">
                        <el-radio v-model="radio" :label="index">{{item.sceneName}}</el-radio>
                        <div style="margin-top:20px;">
                            <el-tooltip class="item" effect="dark" :content="item.id" placement="bottom">
                                <viewer :images="images">
                                    <img :src="imgUrl" alt="场景图片" style="width:100%;height:100%"/>
                                </viewer>
                            </el-tooltip>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-pagination
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                :current-page="currentPage2"
                :page-sizes="[8, 12, 16, 20]"
                :page-size="pageSize2"
                layout="total, sizes, prev, pager, next, jumper"
                :total="sceneTotal2"
                style="text-align:right;margin-top:10px">
            </el-pagination>
            <span slot="footer" class="dialog-footer">
                <el-button @click="radio=0">重 置</el-button>
                <el-button type="primary" @click="toLoadScene()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 点击绑定其它场景弹出框 -->
        <el-dialog
            title="绑定其它场景:"
            :visible.sync="centerDialogVisible1"
            width="75%"
            center>
            <el-row style="margin-bottom:15px" :gutter="10">
                <el-col :span="10">
                    <el-input size="small" placeholder="输入关键词搜索场景" v-model="searchScenes"></el-input>
                </el-col>
                <el-col :span="14">
                    <el-button size="small" type="primary" icon="el-icon-search" @click="getOtherScenesList()">搜索</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="12">
                <el-col :span="4" v-for="(item,index) in otherScenes" :key="index" :index="String(index)">
                    <el-card style="min-height:140px;margin-bottom:10px">
                        <el-radio v-model="checkedradio" :label="item">{{item.sceneName}}</el-radio>
                        <div style="margin-top:20px;">
                            <el-tooltip class="item" effect="dark" :content="item.id" placement="bottom">
                                <viewer :images="images">
                                    <img :src="imgUrl" alt="场景图片" style="width:100%;height:100%"/>
                                </viewer>
                            </el-tooltip>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[12, 18, 24]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="sceneTotal"
                style="text-align:right;margin-top:10px">
            </el-pagination>
            <span slot="footer" class="dialog-footer">
                <el-button @click="checkedradio='';centerDialogVisible1=false">取 消</el-button>
                <el-button type="primary" @click="toSubmit()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新建应用对话框 -->
        <el-dialog
            title="新建应用"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="520px"
            class="newAppDialog"
            center>
            <el-form>
                <el-form-item label="应用名称：">
                    <el-input placeholder="请输入应用名称" v-model="appname" clearable></el-input>
                </el-form-item>
                <el-form-item label="应用图标：">
                    <el-select placeholder="请选择应用图标" v-model="value">
                        <el-card>
                            <!-- 待完善 -->
                            <!-- <el-pagination small layout="prev, pager, next" :total="50"> </el-pagination> -->
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
                <el-button @click="dialogVisible=false;appname='';value=''">取 消</el-button>
                <el-button type="primary" @click="newApp()">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { options } from '@/icons/icon.json'
// import imgUrl from "@/assets/404_images/404.png"
export default {
    name: 'Dashboard',
    inject:['reload'],
    data() {
        return {
            dialogVisible: false,
            applist: [],
            appname: '',
            value: '',
            options: options,
            myflowlist: [{
                taskType: 0,
                count: 0,
            },{
                taskType: 1,
                count: 0,
            },{
                taskType: 2,
                count: 0,
            }],
            // pagesize:4,
            // currentPage:1
            //场景选择弹出框
            centerDialogVisible: false,
            imgUrl: require("@/assets/404_images/404.png"),
            // imgUrl1: require("@/assets/404_images/404_cloud.png"),
            images: [],
            scenesByUser: [],
            radio: 0,
            currentPage2:1,
			pageSize2: 8,
            sceneTotal2: 0,
            //绑定其它场景弹出框
            centerDialogVisible1: false,
            searchScenes: '',
            otherScenes: [],
            checkedradio: '',
            currentPage:1,
			pageSize: 12,
            sceneTotal: 0,
            //判断是否从登录界面跳转过来的标记符
            k: false,
            //新建应用对话框
            ybyapplist: [],
        }
    },
    mounted () {
        this.$nextTick( function(){
            this.checkScene(1)
            this.getSceneByUser(1)//获取用户对应的场景
            this.getAppList(1)
            this.myFlowList(1)
            // this.getAllMenus(1)
        })
    },
    computed: {
        ...mapGetters([
            'name'
        ])
    },
    beforeRouteEnter (to, from, next) {
       console.log(to)
       console.log(from)
       next(vm => {
            if(from.path=="/") {
                // vm.centerDialogVisible = true;
                vm.k=true
            }
       })
    },
    methods: {
        //判断是否已经选择了场景
        checkScene() {         
            console.log(this.$store.state.user.token)
            console.log(this.$store.state.user.accountName)
            console.log(this.$store.state.user.userId)
            console.log(this.$store.state.user.loadScene.id)
            if(this.k==true&&!this.$store.state.user.loadScene.id)
                this.centerDialogVisible = true
        },
        //通过用户ID获取用户对应的场景-----------------------------------------------------------------------------------------------------------
        getSceneByUser() {
            var Params = {
                page: this.currentPage2,
                size: this.pageSize2,
                userId: this.$store.state.user.userId
            }
            var Params2 = {
                Authorization: this.$store.state.user.token,
            }
            console.log(Params)
            this.$ajax({
                url: '/dev-api/scene/list/byUser',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.code==200) {
                    this.sceneTotal2 = res.data.data.total
                    this.scenesByUser = res.data.data.list
                }
                else
                    this.$message.error(res.data.msg)
            }).catch( error => {
                console.log()
            })
        },
        //选择用户装载场景的分页
        handleSizeChange2(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize2 = val
            this.getSceneByUser()
        },
        handleCurrentChange2(val) {
            console.log(`当前页: ${val}`);
            this.currentPage2 = val
            this.getSceneByUser()
        },
        //为用户装载工作场景
        toLoadScene() {
            console.log(this.radio)
            console.log(this.scenesByUser[this.radio])
            var Params = {
                sceneId: this.scenesByUser[this.radio].id,
                userId: this.$store.state.user.userId
            }
            var Params2 = {
                Authorization: this.$store.state.user.token,
            }
            console.log(Params)
            this.$ajax({
                url: '/dev-api/scene/loadScene',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.code==200) {
                    this.$store.state.user.loadScene = this.scenesByUser[this.radio]
                    this.$message.success("装载工作场景" + this.scenesByUser[this.radio].sceneName + "成功")
                    this.centerDialogVisible = false
                    //判断用户所属部门
                    var Params = {
                        sceneId: this.$store.state.user.loadScene.id,
                        userId: this.$store.state.user.userId
                    }
                    var Params2 = {
                        Authorization: this.$store.state.user.token,
                    }
                    console.log(Params)
                    this.$ajax({
                        url: '/dev-api/sys/user/signify',
                        method: 'get',
                        contentType: "application/json; charset=utf-8",
                        params: Params,
                        headers: Params2
                    }).then( res => {
                        console.log(res)
                        if(res.data.code==200) {
                            this.$store.state.user.sectionId = res.data.data
                            console.log("经判断用户所属部门ID为"+res.data.data)
                            this.getAppList()
                            this.myFlowList()
                        }
                        else
                            this.$message.error(res.data.msg)
                    }).catch( error => {
                        console.log()
                    })
                }
                else
                    this.$message.error(res.data.msg)
            }).catch( error => {
                console.log()
            })
        },

        //绑定其它场景-----------------------------------------------------------------------------------------------------------------------------
        otherScene() {
            this.centerDialogVisible1=true;
            this.getOtherScenesList()
        },
        getOtherScenesList() {
            var Params = {
                page: this.currentPage,
                size: this.pageSize,
                userId: this.$store.state.user.userId,
                sceneName: this.searchScenes //搜索要用
            }
            var Params2 = {
                Authorization: this.$store.state.user.token,
            }
            console.log(Params)
            this.$ajax({
                url: '/dev-api/scene/list/invert',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.code==200) {
                    this.sceneTotal = res.data.data.total
                    this.otherScenes = res.data.data.list
                }
                else
                    this.$message.error(res.data.msg)
            }).catch( error => {
                console.log()
            })
        },
        //绑定其它场景的分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize = val
            this.getOtherScenesList()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val
            this.getOtherScenesList()
		},
        //提交选择的其它场景
        toSubmit() {
            console.log(this.checkedradio)
            //用户请求绑定其它场景
            var Params = {
                sceneId: this.checkedradio.id,
                userId: this.$store.state.user.userId
            }
            var Params2 = {
                Authorization: this.$store.state.user.token,
            }
            console.log(Params)
            this.$ajax({
                url: '/dev-api/scene/bind/another',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.code==200) {
                    this.$message.success("改用户绑定场景："+this.checkedradio.sceneName+"成功")

                    //此处默认审核通过。后期需要修改
                    var Params3 = {
                        sceneId: this.checkedradio.id,
                        userId: this.$store.state.user.userId
                    }
                    var Params4 = {
                        Authorization: this.$store.state.user.token,
                    }
                    console.log(Params3)
                    this.$ajax({
                        url: '/dev-api/sys/user/active',
                        method: 'post',
                        contentType: "application/json; charset=utf-8",
                        params: Params3,
                        headers: Params4
                    }).then( res2 => {
                        console.log(res2)
                        if(res2.data.code==200) {
                            this.$message.success("该场景审核通过")
                            this.getSceneByUser()
                        }
                        else
                            this.$message.error(res2.data.msg)
                    }).catch( error => {
                        console.log()
                    })

                    this.centerDialogVisible1 = false
                }
                else
                    this.$message.error(res.data.msg)
            }).catch( error => {
                console.log()
            })
        },

        //获取平台级资源---------------------------------------------------------------------------------------------------------------------------------
        // getAllMenus() {
        //     var Params = {
        //         userId: this.$store.state.user.userId
        //     }
        //     var Params2 = {
        //         Authorization: this.$store.state.user.token,
        //     }
        //     this.$ajax({
        //         url: '/dev-api/menu/menus',
        //         method: 'get',
        //         contentType: "application/json; charset=utf-8",
        //         params: Params,
        //         headers: Params2
        //     }).then( res => {
        //         console.log(res)
        //     }).catch( error => {
        //         console.log()
        //     })
        // },

        //得到APP应用列表--------------------------------------------------------------------------------------------------------------------------------
        getAppList() {
            var Params = {
                sceneId: this.$store.state.user.loadScene.id,
                userId: this.$store.state.user.userId
            }
            var Params2 = {
                Authorization: this.$store.state.user.token,
            }
            console.log(Params)
            this.$ajax({
                url: '/dev-api/resource/app/byUser',
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
            }).catch( error => {
                console.log()
            })
        },
        //得到我的流程的数据
        myFlowList() {
            var Params = {
                user_id: this.$store.state.user.userId,
                scene_id: this.$store.state.user.loadScene.id,
                section_id: this.$store.state.user.sectionId,
            }
            console.log(Params)
            this.$ajax({
                url:'/my-api/form_inst/all/count',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params
            }).then( res => {
                console.log(res)
                if(res.data.code==200) {
                    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
                    this.myflowlist = res.data.obj
                }
                else
                    this.$message.error(res.data.msg)
                // console.log()
            }).catch( error => {
                console.log()
            })
        },
        //新建应用对话框-------------------------------------------------------------------------------------------------------------------
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
                console.log(res)
                if(res.data.code==200) {
                    this.$message.success("新建应用成功")
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
                        this.reload()
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
                console.log(res)
                if(res.data.code==200) {
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
        toMyWork() {

        },
        logout() {
            this.$router.push({
                path: '/login'
            })
            // await this.$store.dispatch('user/logout')
            // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        },
        toReg() {
            this.$router.push({
                path: '/reg'
            })
        },
        toMyApp() {
            this.$router.push({
                path: '/app'
            })
        },
        toControlCenter() {
            this.$router.push({
                path: '/controlpanel'
            })
        },

        toDefineHome(){
            this.$router.push({
                path:'/homedesigner'
            })
        },
        toMyFlow(method) {
            this.$router.push({
                path:'/myflow',
                query: {
                    method: method,
                }
            })
        },
        toAppInfomation(id,icon,appname,path) {
            this.$router.push({
                path:'/appinfomation',
                query: {
                    appId:id,
                    appIcon:icon,
                    appName:appname,
                    appPath:path,
                }
            })
        }
    }
}
</script>

<style>
.el-scrollbar__view {
    padding: 6px !important;
    width:300px;
}
.el-card__body {
    padding: 6px;
}
.el-select-dropdown__item {
    padding: 2px 12px;
    margin: 2px;
}
</style>

<style lang="scss" scoped>
.home-container {
    height: 100vh;
    .el-header,
    .el-footer {
        color: #333;
        line-height: 50px;
        border-bottom: 1px solid #efefef;
    }
    .el-header {
        background: linear-gradient(180deg,#f9fafd,#e7eef8);
        position: relative; 
        z-index: 1;
        img {
            float: left;
            height: 30px;
            line-height: 60px;
            margin: 16px 20px;
        }
        .el-input {
            // 头部搜索框
            float: left;
            width: 220px;
            margin: 5px 30px;
        }
        ul {
            list-style: none;
            font: 15px verdana, arial, sans-serif; /* 设置文字大小和字体样式 */
            li {
                float: right; /* 往左浮动 */
                list-style: none; /* 将默认的列表符号去掉 */
                padding: 0; /* 将默认的内边距去掉 */
                margin: 0; /* 将默认的外边距去掉 */
                display: inline;
                // line-height: 30px;
                padding: 0px 12px;
                &:hover {
                cursor: pointer;
                color: powderblue;
                }
            }
        }
        .first-ul li {
            border-right: 2px solid rgb(79, 82, 79);
            &:last-child {
                border-left: 2px solid rgb(79, 82, 79);
            }
        }
        .el-icon-setting {
            float: right;
            font-size: 26px;
            margin-top: 15px;
            margin-right: 30px;
            cursor: pointer;
        }
        .el-icon-switch-button {
            float: right;
            font-size: 23px;
            margin-top: 17px;
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
        .button1{
            margin-left:80px;
            margin-top:5px;
            width:130px;
            height:50px;
            border: white;
            font-size:15px;
            line-height: 30px;
            border-radius:10px;
        }
        .button1:hover {
            background: rgba(250, 250, 250, 0.9);
        }
        .button2{
            margin-left:0px;
            margin-top:5px;
            min-width:110px;
            height:50px;
            border: white;
            font-size:15px;
            line-height: 30px;
            border-radius:10px;
            padding-left:13px;
            padding-right:13px;
        }
        .button2:hover {
            background: rgba(250, 250, 250, 0.9);
        }
        .svg-icon {
            font-size:30px;
            float:left;
        }
    }
    .el-main {
        // color: white;
        text-align: center;
        height: 100%;
        display: grid;
        padding: 30px 100px;
        background-color: #f3f5f8;
        position: relative; 
        z-index: 1;
        .el-row {
            // padding-bottom: 10px;
            &:first-child {
                height: 350px;
            }
            .shared-head {
                padding: 0 16px 0 20px;
                height: 56px;
                border-bottom: 1px solid rgba(235, 237, 245, 0.9);
                width: 100%;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
            .head__title {
                font-size: 16px;
                padding: 10px 12px;
                position: relative;
                color: #304265;
            }
            .head__title:before {
                content: " ";
                width: 4px;
                height: 16px;
                background: -webkit-gradient(
                    linear,
                    left top,
                    left bottom,
                    from(#25b6ff),
                    to(#107fff)
                );
                background: linear-gradient(180deg, #25b6ff, #107fff);
                border-radius: 3px;
                position: absolute;
                left: 0;
                top: 13px;
                }
            }
            .message__more {
                margin-left: auto;
                font-size: 14px;
                color: #8893a7;
                cursor: pointer;
                -webkit-transition: color 0.2s;
                transition: color 0.2s;
            }
            .work-list__content {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                justify-content: space-between;
                padding: 33px 36px;
                height: calc(100% - 56px);
                min-height: 238px;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                list-style: none;
                margin: 0;
                // padding: 0;
                padding: 10px 40px;
                .to_do_list {
                    // border: 1px solid;
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-orient: vertical;
                    -webkit-box-direction: normal;
                    -ms-flex-direction: column;
                    flex-direction: column;
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    -webkit-box-pack: center;
                    -ms-flex-pack: center;
                    justify-content: center;
                    width: 28%;
                    border-radius: 6px;
                    background-color: #fff;
                    cursor: pointer;
                    -webkit-transition: all 0.2s ease;
                    transition: all 0.2s ease;


                    &:hover {
                        background-color: #f7fafc;
                        .todo__title {
                        background: #fff;
                        color: #107fff;
                        -webkit-box-shadow: 0 0 8px 0 #e6edfd;
                        box-shadow: 0 0 8px 0 #e6edfd;
                    }
                }
                .todo__title {
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-pack: center;
                    -ms-flex-pack: center;
                    justify-content: center;
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    width: 65%;
                    min-width: 74px;
                    max-width: 150px;
                    height: 32px;
                    margin: 0 0 18px 0;
                    font-size: 16px;
                    border-radius: 16px;
                    background: #f7fafc;
                    -webkit-box-shadow: 0 0 0 0 #e6edfd;
                    box-shadow: 0 0 0 0 #e6edfd;
                    color: #8893a7;
                    -webkit-transition: all 0.2s ease 0.05s;
                    transition: all 0.2s ease 0.05s;
                }
                .todo__count {
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    position: relative;
                    font-size: 50px;
                    font-weight: 500;
                    color: #304265;
                    -webkit-transition: color 0.2s 0.05s;
                    transition: color 0.2s 0.05s;

                    &:hover{
                    color: #107fff;
                    }
                }
                }
            }
        }
        .el-col {
            height: 100%;
            border-radius: 6px;
        }
        .bg-purple {
            background-color: #fff;
            border-radius: 4px;
            height: 100%;
            border: 1px solid #304265;
        }
        .grid-content {
            border-radius: 4px;
            // min-height: 36px;
            margin-top:0px;
            // margin-bottom:50px;
            height: 100%;
            border-color:white;
            box-shadow: 0 1.5px 8px 0 #e0e5f0;
        }
    }
    body > .el-container {
        margin-bottom: 40px;
    }
    .newAppDialog {
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
</style>
