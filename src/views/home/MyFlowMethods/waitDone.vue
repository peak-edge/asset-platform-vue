<template>
    <el-container class="waitdone-container">
        <!-- <el-header height="25px" v-for="(item,index) in showlist"> -->
        <el-header height="25px">
            <!-- <span style="margin-left:3%;width:20%">标题</span>
            <div class="vertical-divider"></div>
            <span style="width:37%">内容</span>
            <div class="vertical-divider"></div>
            <span style="width:18%">接收时间</span>
            <div class="vertical-divider"></div>
            <span>操作</span> -->
            <el-row :gutter="23">
                <el-col :span="5">
                    <span style="margin-left:20%;">标题</span>
                    <div class="vertical-divider" style="float:right"></div>
                </el-col>
                <el-col :span="0.5">&nbsp;</el-col>
                <el-col :span="9">
                    <span>内容</span>
                    <div class="vertical-divider" style="float:right"></div>
                </el-col>
                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="5">
                    <span>实例发起时间</span>
                    <div class="vertical-divider" style="float:right"></div>
                </el-col>
                <el-col :span="3.5">
                    <span>操作</span>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-card v-for="(item,index) in showlist" :key="index">
                <el-row :gutter="23" class="rowstyle">
                    <el-col :span="1">
                        <div><span class="username" style="font-size:14px">{{$store.state.user.realName}}</span></div>
                    </el-col>
                    <el-col :span="4">
                        <span @click="dialogVisible = false;getKey(item)">{{item.title}}</span>
                    </el-col>
                    <el-col :span="0.5">&nbsp;</el-col>
                    <el-col :span="9">
                        <span>{{item.content}}</span><br>
                        <span style="color:orange;line-height:2">{{item.nodeType}}</span>
                    </el-col>
                    <el-col :span="1">&nbsp;</el-col>
                    <el-col :span="5">
                        <!-- <span>2019/06/18</span><br> -->
                        <!-- <span style="line-height:2">14:50:21</span> -->
                        <span>{{item.commitTime}}</span>
                    </el-col>
                    <el-col :span="3.5" v-if="item.nodeType=='审批节点'">
                        <!-- <el-button type="primary" size="small" @click="Approve(item)">同意</el-button> -->
                        <el-button type="primary" size="small" @click="dialogVisible = false;getKey(item);">填写</el-button>
                        <el-button size="small" @click="disApprove(item)">不同意</el-button>
                    </el-col>
                    <el-col :span="3.5" v-if="item.nodeType=='经办节点'">
                        <el-button type="primary" size="small" @click="dialogVisible = false;getKey(item);">填写</el-button>
                        <el-button size="small" style="visibility:hidden">不同意</el-button>
                    </el-col>
                </el-row>
            </el-card>
            <!-- <el-card>
                <el-row :gutter="23" class="rowstyle">
                    <el-col :span="1">
                        <div><span class="username">user</span></div>
                    </el-col>
                    <el-col :span="4">
                        <span @click="dialogVisible = false">user的供应商与商品信息</span>
                    </el-col>
                    <el-col :span="0.5">&nbsp;</el-col>
                    <el-col :span="9">
                        <span>12</span><br>
                        <span style="color:orange;line-height:2">审批节点</span>
                    </el-col>
                    <el-col :span="1">&nbsp;</el-col>
                    <el-col :span="5">
                        <span>2019/06/17</span><br>
                        <span style="line-height:2">17:06:51</span>
                    </el-col>
                    <el-col :span="3.5">
                        <el-button type="primary" size="small">同意</el-button>
                        <el-button size="small">不同意</el-button>
                    </el-col>
                </el-row>
            </el-card> -->
            <div class="addPage" :hidden="dialogVisible" style="z-index:9999">
                <span style="float:left;line-height:3.2;font-size:16px;padding-left:20px;">使用说明</span>
                <div class="navbar-header">
                    <el-button @click="dialogVisible = true"><i class="el-icon-close"></i><span>关闭</span></el-button>
                    <el-button id="Button1" @click="Submit()"><span>提交</span></el-button>
                    <el-button id="Button2" @click="Submit2()"><span>同意</span></el-button>
                    <!-- <el-button v-for="(item,index) in buttonlist2" :key="index">
                        <svg-icon :icon-class="item.iconCls"/><span>{{item.name}}</span>
                    </el-button> -->
                </div>
                <div class="main" style="padding:40px;overflow-y:scroll;height:89vh">
                    <fm-generate-form
                        :data="jsonData"
                        :remote="remoteFuncs"
                        :value="values"
                        ref="generateForm">
                    </fm-generate-form>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
export default {
    name: 'topbar',
    inject:['reload'],
    data() {
        return {
            showlist: [],
            // nodeType: '',
            dialogVisible: true,
            buttonlist2: [],
            //表单渲染
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
            clickitem: ''
        };
    },
    mounted () {
        this.$nextTick( function(){
            this.getShowList(1);
        })
    },
    methods: {
        //展示页面数据
        getShowList() {
            var Params = {
                // user_id: this.$store.state.user.userId,
                task_type: 0,
                user_id: this.$store.state.user.userId,
                scene_id: this.$store.state.user.loadScene.id,
                section_id: this.$store.state.user.sectionId,
            }
            console.log(Params)
            this.$ajax({
                url:'/my-api/form_inst/show',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params
            }).then( res => {
                console.log(res.data.obj);
                this.showlist = res.data.obj;
                for(var i=0;i<res.data.obj.length;i++)
                {
                    if(res.data.obj[i].nodeType==1)
                        this.showlist[i].nodeType="经办节点"
                    if(res.data.obj[i].nodeType==2)
                        this.showlist[i].nodeType="审批节点"
                    if(res.data.obj[i].nodeType==3)
                        this.showlist[i].nodeType="抄送节点"
                    if(res.data.obj[i].commitTime)
                        this.showlist[i].commitTime = this.getTime(res.data.obj[i].commitTime) 
                    else
                        this.showlist[i].commitTime = "null"
                }
            }).catch( error => {
                console.log()
            })
        },
        //得到点击的位置信息
        getKey(item) {
            if(item.nodeType=="经办节点"){
                var ele1 = document.getElementById("Button1");
                var ele2 = document.getElementById("Button2");
                ele1.style.display = "block";
                ele2.style.display = "none";
                console.log("经办结点")
                // var result = JSON.parse(item.formInstValue.slice(1, -1));
                var result = JSON.parse(item.formInstValue);
                this.jsonData = JSON.parse(item.formInstSheetStr)
                this.values = result 
                this.clickitem = item
                console.log(this.clickitem)
            }
            else if(item.nodeType=="审批节点"){
                var ele1 = document.getElementById("Button1");
                var ele2 = document.getElementById("Button2");
                ele2.style.display = "block";
                ele1.style.display = "none";
                console.log("审批节点")
                var result = JSON.parse(item.formInstValue);
                this.jsonData = JSON.parse(item.formInstSheetStr)
                this.values = result 
                this.clickitem = item
                console.log(this.clickitem)
            }
            
        },
        //经办节点提交按钮
        Submit() {
            //拿到新填写的表单信息
            this.$refs.generateForm.getData().then(data => {
                console.log(data)
                var str = "\""+JSON.stringify(data)+"\"";
                this.clickitem.formValue = str
                var Params = {
                    form_inst_id: this.clickitem.id,
                    editor: this.$store.state.user.userId,
                    task_id: this.clickitem.taskId,
                    proc_inst_id: this.clickitem.procInstId,
                    form_model_id: this.clickitem.formModelId,
                    form_inst_sheet: JSON.parse(this.clickitem.formInstSheetStr),
                    form_inst_value: this.clickitem.formValue.slice(1, -1)
                    // form_inst_value: str.slice(1, -1)
                }
                console.log(Params)
                this.$ajax({
                    url:'/my-api/form_inst/apply_node',
                    method: 'post',
                    contentType: "application/json; charset=utf-8",
                    data: Params
                }).then( res => {
                    if(res.data.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '该经办节点处理成功',
                        });
                        this.dialogVisible = true;
                        this.reload();
                    } else {
                        this.$message({
                            type: 'error',
                            message: '该经办节点处理失败',
                        });
                    }
                }).catch( error => {
                    console.log()
                })
            }).catch(e => {
                console.log("数据校验失败")
            })
        },
        //审批节点同意按钮
        // Approve(item) {
        //     this.getKey(item);
        //     console.log(item)
        //     var Params = {
        //         form_inst_id: this.clickitem.id,
        //         approve_result: 0,
        //         editor: this.$store.state.user.accountName,
        //         task_id: this.clickitem.taskId,
        //         form_inst_value: this.clickitem.formValue
        //     }
        //     console.log(Params)
        //     this.$ajax({
        //         url:'/my-api/form_inst/approval_node',
        //         method: 'post',
        //         contentType: "application/json; charset=utf-8",
        //         data: Params
        //     }).then( res => {
        //         if(res.data.status == 200) {
        //             this.$message({
        //                 type: 'success',
        //                 message: '该审批节点处理成功',
        //             });
        //             this.dialogVisible = true;
        //             this.reload();
        //         } else {
        //             this.$message({
        //                 type: 'error',
        //                 message: '该审批节点处理失败',
        //             });
        //         }
        //     }).catch( error => {
        //         console.log()
        //     })
        // },
        Submit2() {
            //拿到新填写的表单信息
            this.$refs.generateForm.getData().then(data => {
                console.log(data)
                var str = "\""+JSON.stringify(data)+"\"";
                this.clickitem.formValue = str
                var Params = {
                    approve_result: 1,
                    form_inst_id: this.clickitem.id,
                    editor: this.$store.state.user.userId,
                    task_id: this.clickitem.taskId,
                    proc_inst_id: this.clickitem.procInstId,
                    form_model_id: this.clickitem.formModelId,
                    form_inst_sheet: JSON.parse(this.clickitem.formInstSheetStr),
                    form_inst_value: this.clickitem.formValue.slice(1, -1)
                    // form_inst_value: str.slice(1, -1)
                }
                console.log(Params)
                this.$ajax({
                    url:'/my-api/form_inst/approval_node',
                    method: 'post',
                    contentType: "application/json; charset=utf-8",
                    data: Params
                }).then( res => {
                    if(res.data.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '该审批节点处理成功',
                        });
                        this.dialogVisible = true;
                        this.reload();
                    } else {
                        this.$message({
                            type: 'error',
                            message: '该审批节点处理失败',
                        });
                    }
                }).catch( error => {
                    console.log()
                })
            }).catch(e => {
                console.log("数据校验失败")
            })
        },
        //审批节点不同意按钮
        disApprove(item) {
            console.log(item)
            // alert("涉及流程回滚，暂未实现")
            this.$refs.generateForm.getData().then(data => {
                console.log(data)
                var str = "\""+JSON.stringify(data)+"\"";
                this.clickitem.formValue = str
                var Params = {
                    approve_result: 0,
                    form_inst_id: this.clickitem.id,
                    editor: this.$store.state.user.userId,
                    task_id: this.clickitem.taskId,
                    proc_inst_id: this.clickitem.procInstId,
                    form_model_id: this.clickitem.formModelId,
                    form_inst_sheet: JSON.parse(this.clickitem.formInstSheetStr),
                    form_inst_value: this.clickitem.formValue.slice(1, -1)
                    // form_inst_value: str.slice(1, -1)
                }
                console.log(Params)
                this.$ajax({
                    url:'/my-api/form_inst/approval_node',
                    method: 'post',
                    contentType: "application/json; charset=utf-8",
                    data: Params
                }).then( res => {
                    if(res.data.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '该审批节点处理不同意成功',
                        });
                        this.dialogVisible = true;
                        this.reload();
                    } else {
                        this.$message({
                            type: 'error',
                            message: '该审批节点处理失败',
                        });
                    }
                }).catch( error => {
                    console.log()
                })
            }).catch(e => {
                console.log("数据校验失败")
            })
        },
        //将毫秒数转换成日期格式
        getTime(str) {
            var oDate = new Date(str);
            var oMonth = oDate.getMonth()+1;  
            var oDay = oDate.getDate();
            var oDate1 = oDate.getFullYear()+'/'+this.getzf(oMonth)+'/'+this.getzf(oDay);
            var oDate2 = this.getzf(oDate.getHours())+':'+this.getzf(oDate.getMinutes())+':'+this.getzf(oDate.getSeconds());
            return oDate1+' '+oDate2;
        },
        //转换日期首位补零
        getzf(num) {
            if(parseInt(num)<10) {
                num = '0'+ num;
            }
            return num;
        }
    }
}
</script>

<style lang="scss" scoped>
@keyframes bounceInRight {
    0% { right:-200px; opacity: 0.2 } 
    25% { right:0px; opacity: 1 } 
}
.waitdone-container {
    height: 87vh;
    background: rgb(243,245,248);
    margin-left: 8%;
    margin-right: 8%;
    .el-header {
        span {
            color: rgb(136,147,167);
            float: left;
            font-size:15px;
        }
        .vertical-divider {
            float: left;
            // display: inline;
            height: 16px;
            color: rgb(213,219,230);
            padding: 0 !important;
            margin: 0px 35px 0px 10px !important;
            height: 25px;
            border-left: 1px solid;
            font-size: 0;
        }
    }
    .el-main {
        padding-left: 0px;
        padding-right: 0px;
        .el-card {
            padding: 20px;
            box-shadow: 0 2px 8px 0 rgba(95,134,218,.1);
            padding-left: 20px;
            margin-bottom: 15px;
            .rowstyle {
                //垂直居中
                display: flex;
                justify-content: center;
                align-items: center;
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
                cursor: pointer;
                color: #fff;
            }
            span {
                display:inline;
            }
        }
        .addPage {
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
}
</style>
<style>
.waitdone-container .el-card {
    padding: 20px !important;
}
.waitdone-container .el-card__body {
    padding: 0px !important;
}
</style>
