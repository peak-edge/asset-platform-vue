<template>
    <el-container class="adminhome-container">
        <el-header height="65px">
            <img class="logo" src="https://cn.vuejs.org/images/logo.png">
            <h1>平台管理员</h1>
            <div class="right-tabs">
                <div><i class="el-icon-switch-button" style="font-size:18px;" @click="logout()"></i></div>
                <div class="vertical-divider"></div>
                <!-- <div><i class="el-icon-setting"  style="font-size:20px;" @click="toMyApp()"></i></div> -->
                <div>
                    <el-tooltip
                        effect="dark"
                        content="控制台"
                        placement="bottom">
                        <i class="el-icon-data-analysis" @click="toControlCenter()" style="float:right;font-size:23px;margin-top:19px;"></i>
                    </el-tooltip>
                </div>
                <div class="vertical-divider"></div>
                <div><span class="username">user</span></div>
            </div>
        </el-header>
        <el-main>
            <el-row :gutter="14" class="card-content">
                <el-col :span="15">
                <div class="grid-content bg-purple">
                    <div class="shared-head">
                        <span class="head__title"> 1、流程监控</span>
                        <div class="message__more">全部</div>
                    </div>
                    <div class="button-group">
                        <el-row :gutter="14">
                            <el-col :span="8">
                                <el-card class="button" @click.native="toHistoryFlow()">
                                    <div class="button-icon" style="background:rgb(49,180,141)">
                                        <svg-icon icon-class="icon-flowruning"/>
                                    </div>
                                    <div class="button-title" style="color:rgb(49,180,141)">132</div>
                                    <div class="button-title" style="font-size: 15px;">运行中</div>
                                </el-card>
                            </el-col>
                            <el-col :span="8">
                                <el-card class="button">
                                    <div class="button-icon" style="background:rgb(56, 161, 242)">
                                        <svg-icon icon-class="icon-history"/>
                                    </div>
                                    <div class="button-title" style="color:rgb(56, 161, 242)">200</div>
                                    <div class="button-title" style="font-size: 15px;">历史流程</div>
                                </el-card>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                </el-col>
                <el-col :span="9">
                    <div class="grid-content bg-purple">
                        <div class="shared-head">
                            <span class="head__title"> 2、流程日志</span>
                            <div class="message__more">更多</div>
                        </div>
                        <div class="shared-body">
                            <el-row style="line-height:26px;">
                                <el-col :span="18"><li>用户uesr发起了请假单流程</li></el-col>
                                <el-col :span="6"><span style="color:#999">2019-07-04</span></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="18"><li>用户橙粒粒的木马人儿发起了审核表流程</li></el-col>
                                <el-col :span="6"><span style="color:#999">2019-07-05</span></el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="24" class="card-content" style="margin-top:15px;height:400px;">
                <el-col :span="24">
                    <div class="grid-content bg-purple">
                        <div class="shared-head">
                            <span class="head__title"> 3、流程实例</span>
                            <div class="message__more">更多</div>
                        </div>
                        <el-row>
                            <el-col :span="8" style="padding-top:20px">
                                <!--为echarts准备一个具备大小的容器dom-->
                                <div id="main" style="width: 400px;height:300px;"></div>
                            </el-col>
                            <el-col :span="8"></el-col>
                            <el-col :span="8"></el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import echarts from 'echarts'
export default {
    name: 'topbar',
    data() {
        return {
            charts: '',
            opinionData: ["3", "2", "4", "4", "5"]
        };
    },
    mounted() {
        this.$nextTick(function() {
            this.drawLine('main')
        })
    },
    methods: {
        //退出登录
        logout() {
            this.$router.push({
                path:'/'
            })
        },
        //控制台
        toControlCenter() {
            this.$router.push({
                path: '/controlpanel'
            })
        },
        toHistoryFlow() {
            this.$router.push({
                path:'/historyflow'
            })
        },
        //折线图
        drawLine(id) {
            this.charts = echarts.init(document.getElementById(id))
            this.charts.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['流程运行']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },

                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                data: ["1","2","3","4","5"]
                
                },
                yAxis: {
                    type: 'value'
                },

                series: [{
                    name: '流程运行',
                    type: 'line',
                    stack: '总量',
                    data: this.opinionData
                }]
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.adminhome-container {
    height:100vh;
    .el-header {
        // background: rgb(0,33,64);
        width: 100%;
        background: linear-gradient(180deg,#f9fafd,#e7eef8);
        img {
            float: left;
            height: 30px;
            line-height: 60px;
            margin: 18px 18px;
        }
        h1 {
            font-size: 22px;
        }
        .right-tabs {
            position: absolute;
            right: 0;
            top: 0;
            height: 66px;
            line-height: 63px;
            margin: 0;
            padding: 0;
            text-align: center;
            width: 210px;
            display: flex;
            & > div {
                display: inline-block;
                padding: 0 16px;
                cursor: pointer;
            }
            .vertical-divider {
                height: 16px;
                // color: white;
                padding: 0 !important;
                margin: 20px 0 0px 0 !important;
                height: 22px;
                line-height: 22px;
                border-left: 1px solid;
                font-size: 0;
            }
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
            background: rgb(56,161,242);
            border-radius: 30px;
            overflow: hidden;
            margin-right: 20px;
            cursor: pointer;
            color: #fff;
            float: right;
            margin-top: 13px;
        }
    }
    .el-main {
        text-align: center;
        display: grid;
        padding: 20px 20px;
        background-color: #f3f5f8;

        .card-content {
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
            margin-top: 0px;
            height: 100%;
            border-color: white;
            box-shadow: 0 1.5px 8px 0 #e0e5f0;
            .button-group {
                padding: 25px;
                .button {
                    border-radius: 8px;
                    box-shadow: none;
                    float: left;
                    // padding: 0px 20px;
                    color: #999;
                    width: 100%;
                    height: 100px;
                    padding: 0px;
                    .button-icon {
                        float: left;
                        width: 40%;
                        height: 100px;
                        font-size: 50px;
                        color: white;
                        padding-top: 15px;
                    }
                    .button-title {
                        padding-top: 28px;
                        font-size: 28px;
                        line-height: 10px;
                        text-align: center;
                    }
                }
                .button:hover {
                    background: rgb(248, 245, 245);
                }
            }
            .shared-body {
                padding: 20px;
                width: 100%;
                color: rgb(75, 71, 71);
                li {
                    float: left;
                    padding-left: 15px;
                }
            }
        }
    }
}
</style>
<style>
.adminhome-container .el-card__body {
    padding: 0px;
}
</style>

