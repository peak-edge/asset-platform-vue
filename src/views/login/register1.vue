<template>
    <div class="register-container">
        <div class="title-container">
            <h3 class="title">资产云☁️</h3>
            <h3 class="title">Register Form</h3>
        </div>
        <el-card>
            <el-steps :active="active" simple>
                <el-step title="账号信息" icon="el-icon-edit"></el-step>
                <el-step title="个人信息" icon="el-icon-tickets"></el-step>
                <el-step title="头像上传" icon="el-icon-picture"></el-step>
                <el-step title="组织架构" icon="el-icon-connection"></el-step>
            </el-steps>
            <keep-alive>
                <components :is='currentStep' ref="msg"></components>
            </keep-alive>
            <div class="button-group">
                <el-button size="small" id="button1" icon="el-icon-d-arrow-left" @click="Back()">上一步</el-button>
                <el-button size="small" type="text" class="loginButton" @click="toLogin()">登录</el-button>
                <el-button size="small" id="button2" @click="Next()">下一步<i class="el-icon-d-arrow-right el-icon--right"></i></el-button>
                <el-button size="small" id="button3" @click="Finish()">完 成<i class="el-icon-finished el-icon--right"></i></el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import Step1 from './stepForms/Step1.vue'
import Step2 from './stepForms/Step2.vue'
import Step3 from './stepForms/Step3.vue'
import Step4 from './stepForms/Step4.vue'
export default {
    name: 'Register',
    components: {
        'step1': Step1,
        'step2': Step2,
        'step3': Step3,
        'step4': Step4
    },
    data() {
        return {
            currentStep: 'step1',
            active: 0,
            dataForm: {
                usertype:'',
				useraccount: '',
				realname:'',
				password: '',
                tel:'',
                sex:'',
                mail:'',
                cardtype:'',
                addr:'',
                avater: '',
                input: '',
                checkedinfo: '',
                newSceneName: '',
                allNodes: []
            }
        }
    },
    methods: {
        Next() {
            if (this.active++ > 3) this.active = 3;
            this.JumpMethods();
            //得到组件的值并临时存储
            if(this.$refs.msg.registerForm) {
                if(this.$refs.msg.registerForm.usertype=="1")
                    this.dataForm.usertype = 1
                else if(this.$refs.msg.registerForm.usertype=="2")
                this.dataForm.usertype = 0
                this.dataForm.useraccount = this.$refs.msg.registerForm.useraccount
                this.dataForm.realname = this.$refs.msg.registerForm.realname
                this.dataForm.password = this.$refs.msg.registerForm.password
            }
            if(this.$refs.msg.registerForm2) {
                this.dataForm.tel = this.$refs.msg.registerForm2.tel
                this.dataForm.sex = this.$refs.msg.registerForm2.sex
                this.dataForm.mail = this.$refs.msg.registerForm2.mail
                this.dataForm.cardtype = this.$refs.msg.registerForm2.cardtype
                this.dataForm.addr = this.$refs.msg.registerForm2.addr
            }
            if(this.$refs.msg.registerForm3) {
                this.dataForm.avater = this.$refs.msg.registerForm3.imageUrl
            }
            // console.log(this.dataForm)
        },
        Back() {
            if (this.active-- <= 0) this.active = 0;
            this.JumpMethods();
        },
        //注册
        Finish() {
            // console.log(this.$refs.msg.nowAuth)
            // if(this.$refs.msg.registerForm4) {
                // this.dataForm.input = this.$refs.msg.input
                this.dataForm.checkedinfo = this.$refs.msg.checkedinfo
                this.dataForm.newSceneName = this.$refs.msg.newSceneName
                this.dataForm.allNodes = this.$refs.msg.allNodes
            // }
            console.log(this.dataForm)
            console.log(this.dataForm.usertype)
            // var Params = {
            //     accountName: this.dataForm.useraccount,
            //     admin: this.dataForm.usertype,
            //     pwd: this.dataForm.password,
            //     realName: this.dataForm.realname,
            // }
            if(!this.dataForm.checkedinfo.id) {
                this.$message.error("请先选择场景！")
            }
            else {
                var Params = {
                    accountName: this.dataForm.useraccount,
                    admin: this.dataForm.usertype,
                    pwd: this.dataForm.password,
                    realName: this.dataForm.realname,

                }
                var Params2 = {
                    sceneId: this.dataForm.checkedinfo.id,
                    // nodeId: this.dataForm.allNodes.join(','),
                    // sceneName: this.dataForm.newSceneName,
                }
                console.log(Params)
                this.$ajax({
                    url:'/dev-api/userReg',
                    method: 'post',
                    contentType: "application/json; charset=utf-8",
                    data: Params,
                    params: Params2
                }).then( res => {
                    console.log(res)
                    if(res.data.code==200) {
                        // console.log(res.data.obj)
                        this.$message.success("注册成功");
                        // 注册用户激活
                        var Params3 = {
                            // auditType: 1,
                            sceneId: res.data.data.sceneIds,
                            userId: res.data.data.userId
                        }
                        var Params4 = {
                            Authorization: "Bearer "+ this.$refs.msg.nowAuth,
                        }
                        console.log(Params3)
                        this.$ajax({
                            url:'/dev-api/api/active',
                            method: 'post',
                            contentType: "application/json; charset=utf-8",
                            params: Params3,
                            headers: Params4
                        }).then( res => {
                            console.log(res)
                            if(res.data.code==200) {
                                this.$message.success("注册用户激活成功")
                                this.$confirm('是否跳转至登录界面?', '注册成功', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.$router.push({
                                        path: '/login'
                                    })
                                }).catch(() => {
                                    console.log()
                                });
                            }
                            else
                                this.$message.error(res.data.msg)
                        }).catch( error => {
                            this.loading = false
                            console.log()
                        })
                    }
                    else {
                        this.$message.error(res.data.msg);
                    }
                }).catch( error => {
                    console.log()
                })
            }
        },
        toLogin() {
            this.$router.push({
                path: '/login'
            })
        },        
        JumpMethods() {
            var but1=document.getElementById("button1");
            var but2=document.getElementById("button2");
            var but3=document.getElementById("button3");
            if (this.active == 0) {
                but1.style.display = "none";
                but2.style.display = "block";
                but3.style.display = "none";
                this.currentStep = "step1"
            }
            else if (this.active == 1) {
                but1.style.display = "block";
                but2.style.display = "block";
                but3.style.display = "none";
                this.currentStep = "step2"
            }
            else if (this.active == 2) {
                but1.style.display = "block";
                but2.style.display = "block";
                but3.style.display = "none";
                this.currentStep = "step3"
            }
            else if (this.active == 3) {
                but1.style.display = "block";
                but2.style.display = "none";
                but3.style.display = "block";
                this.currentStep = "step4"
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.register-container {
    min-height: 100%;
    width: 100%;
    background: #2d3a4b;
    overflow: hidden;
    height:100vh;
    .title-container {
        position: relative;
        margin-top: 9vh;
        .title {
            font-size: 26px;
            color: #eee;
            margin: 0px auto 20px auto;
            text-align: center;
            font-weight: bold;
        }
    }
    .el-card {
        background: rgb(242,242,242);
        height:480px;
        position: relative;
        width: 800px;
        max-width: 100%;
        padding: 50px 0 35px 0;
        margin: 0 auto;
        overflow: hidden;
        margin-top: 40px;
        .el-steps {
            position: absolute;
            top: 0;
            left: 0;
            width: 800px;
            background: #eee;
        }
        .button-group {
            #button1 {
                float: left;
                position: absolute;
                bottom: 30px;
                left: 40px;
                display: none;
            }
            #button2 {
                float: right;
                position: absolute;
                bottom: 30px;
                right: 40px;
                display: block;
            }
            .loginButton {
                float: right;
                position: absolute;
                bottom: 30px;
                right: 160px;
                display: block;
                font-style: italic;
            }
            #button3 {
                float: right;
                position: absolute;
                bottom: 30px;
                right: 40px;
                display: none;
            }
        }
    }
}
</style>