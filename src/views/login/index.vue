<template>
    <div class="login-container">
        <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            auto-complete="on"
            label-position="left">
            <div class="title-container">
                <h3 class="title">资产云☁️</h3>
                <h3 class="title">Login Form</h3>
            </div>
            <el-form-item prop="username">
                <span class="svg-container"><svg-icon icon-class="user" /></span>
                <el-input
                    ref="username"
                    v-model="loginForm.accountName"
                    placeholder="Username"
                    name="username"
                    type="text"
                    tabindex="1"
                    auto-complete="on">
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container"><svg-icon icon-class="password"/></span>
                <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.pwd"
                    :type="passwordType"
                    placeholder="Password"
                    name="password"
                    tabindex="2"
                    auto-complete="on"
                    @keyup.enter.native="handleLogin">
                </el-input>
                <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
            </el-form-item>
            <el-button
                :loading="loading"
                type="primary"
                style="width:100%;margin-bottom:30px"
                @click.native.prevent="handleLogin">Login
            </el-button>
            <el-button type="text" style="font-style:italic;float:right;margin-top:-16px;" @click="toRegister()">注册</el-button>
        </el-form>
    </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    }
}
export default {
    name: 'Login',
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!validUsername(value)) {
                callback(new Error('Please enter the correct user name'))
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('The password can not be less than 6 digits'))
            } else {
                callback()
            }
        }
        return {
            loginForm: {
                // accountName: 'admin',
                accountName: 'chenxu',
                pwd: '123'
            },
            loginRules: {
                accountName: [{ required: true, trigger: 'blur', validator: validateUsername }],
                pwd: [{ required: true, trigger: 'blur', validator: validatePassword }]
            },
            loading: false,
            passwordType: 'password',
            redirect: undefined
        }
    },
    // mounted() {
    //         window.addEventListener('unload', this.saveState)
    //     },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true
        }
    },
    methods: {
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true

                    var Params = {
                        accountName: this.loginForm.accountName,
                        pwd: this.loginForm.pwd
                    }
                    console.log(Params)
                    this.$ajax({
                        url:'/dev-api/login',
                        method: 'post',
                        contentType: "application/json; charset=utf-8",
                        data: Params
                    }).then( res => {
                        this.loading = false
                        console.log(res)
                        if(res.data.code == 200) {
                            console.log("1")
                            this.$store.state.user.token = res.data.data.Authorization
                            console.log("2")

                            this.$store.state.user.accountName = res.data.data.accountName
                            console.log("3")

                            this.$store.state.user.userId = res.data.data.userId
                            console.log("4")

                            this.$store.state.user.realName = res.data.data.realName
                            console.log("5")

                            this.$store.state.user.loadScene = []
                            console.log("6")

                            // console.log(this.$store.state.user.token)
                            //判断平台管理员和终端用户
                            if(res.data.data.admin==1)
                                this.$router.push({path: '/adminhome'})
                            else
                                this.$router.push({path: '/home', query:{fromLogin:'true'}})
                        }
                        else {
                            this.$message.error(res.data.msg);
                        }
                    }).catch( error => {
                        this.loading = false
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        toRegister() {
            this.$router.push({
                path: '/reg'
            })
        }
    }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
/* @import "././styles/index.scss"; */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}
/* reset element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            caret-color: $cursor;
            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
    height:100vh;
    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }
    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;
        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }
    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }
    .title-container {
        position: relative;
        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
}
</style>
