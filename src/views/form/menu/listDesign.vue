<template>
    <div id="listDesign">
        <el-container>
            <el-aside width="80%">
                <span>查询条件</span>
                <el-form :inline="true" :model="formInline" class="select-Condition" size="small">
                    <el-form-item label="公司名称" style="width:32%">
                        <el-input v-model="formInline.cityname" style="width:250px"></el-input>
                    </el-form-item>
                    <el-form-item label="所属部门" style="width:32%">
                        <el-select v-model="formInline.value" placeholder="点击选择所属部门" style="width:250px">
                            <el-option
                                v-for="item in formInline.cities"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                <span style="float: left">{{ item.label }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="联系人" style="width:32%">
                        <el-input v-model="formInline.linkman" style="width:250px"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" style="width:32%">
                        <!-- <el-input v-model="formInline.starttime" style="width:123px"><template slot="prepend" style="padding:0 10px">从</template></el-input>
                        <el-input v-model="formInline.endttime" style="width:123px"><template slot="prepend">至</template></el-input> -->
                        <el-date-picker
                            v-model="formInline.creattime"
                            type="datetimerange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            style="width:250px"
                            align="right">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <span>列表字段</span>
                <el-table :data="tableData" border style="width: 98%;" size="small" :header-cell-style="{background:'rgb(250,250,250)',color:'#606266'}">
                    <el-table-column type="index" width="60" fixed></el-table-column>
                    <el-table-column prop="title" label="标题" width="150"></el-table-column>
                    <el-table-column prop="creatman" label="创建人" width="150" v-if="show1"></el-table-column>
                    <el-table-column prop="owner" label="所有者" width="150" v-if="show2"></el-table-column>
                    <el-table-column prop="ownsection" label="所属部门" width="150" v-if="show3"></el-table-column>
                    <el-table-column prop="creattime" label="创建时间" width="180" v-if="show4"></el-table-column>
                    <el-table-column prop="modifytime" label="修改时间" width="180" v-if="show5"></el-table-column>
                    <el-table-column prop="firmname" label="公司名称" width="180" v-if="show6"></el-table-column>
                    <el-table-column prop="linkphone" label="联系电话" width="150" v-if="show7"></el-table-column>
                    <el-table-column prop="sex" label="性别" width="150" v-if="show8"></el-table-column>
                    <el-table-column prop="address" label="地址" width="300" v-if="show9"></el-table-column>
                    <el-table-column prop="linkman" label="联系人" width="180" v-if="show10"></el-table-column>
                    <el-table-column prop="flowstatus" label="流程状态" width="180" v-if="show11"></el-table-column>
                    <el-table-column prop="nodename" label="节点名称" width="150" v-if="show12"></el-table-column>
                    <el-table-column prop="handleman" label="当前处理人" width="150" v-if="show13"></el-table-column>
                </el-table>
                <el-pagination
                    style="float:right;margin-top:20px;margin-right:12px"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="40">
                </el-pagination>
            </el-aside>
            <el-main style="border-left:1px solid rgb(221,221,221)">
                 <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="" name="11" style="display: none">1</el-tab-pane>
                    <!-- 字段设置 -->
                    <el-tab-pane label="字段设置" name="first" class="firstTab">
                        <span>查询条件</span>
                        <el-dropdown style="float:right;margin-right:0px;font-family:'黑体';font-size:13px !important">
                            <span>
                                <i class="el-icon-plus" style="float:right;color:#409EFF;font-weight:800;margin-top:5px;"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="item in lists" :label="item" :key="item" v-bind:disabled="selectlists.indexOf(item)!=-1" @click.native="selectCondition(item)">{{item}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <br>
                        <div style='clear:both'></div>
                        <div v-for="item in selectlists" :label="item" :key="item">
                            <p style="font-family:'黑体';font-size:15px;">{{item}}</p>
                        </div>
                        <span>列表字段</span>
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="margin-right:0px;margin-top:5px;float:right">全选&nbsp;&nbsp;</el-checkbox>
                        <div style="margin: 10px 0;clear:both"></div>
                        <el-checkbox-group v-model="checkedlists" @change="handleCheckedListsChange" style="line-height:1.5;height:200px;border:1px solid green">
                            <el-checkbox v-for="item in lists" :label="item" :key="item" style="margin-right:0px;width:100px;color:red;border:1px solid red;display:block;">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </el-tab-pane>
                    <!-- 列表设置 -->
                    <el-tab-pane label="列表设置" name="second" class="secondTab">
                        <span>可选显示模式</span>
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox label="列表" style="margin-right:25px"></el-checkbox>
                            <el-checkbox label="日历" style="margin-right:25px"></el-checkbox>
                            <el-checkbox label="时间轴"></el-checkbox>
                        </el-checkbox-group>
                        <br>
                        <span>排序字段</span>
                        <el-select v-model="value" placeholder="请选择活动区域" size="small" style="width:100%">
                            <el-option label="创建时间" value="creattime"></el-option>
                            <el-option label="公司名称" value="firmname"></el-option>
                        </el-select>
                    </el-tab-pane>
                </el-tabs>
                <el-button type="primary" size="small" style="margin-top:20px;float:right" @click="Submit()">保存</el-button>
                <el-button size="small" style="margin-top:20px;float:right;margin-right:10px">重置</el-button>
            </el-main>
        </el-container>
        
    </div>
</template>

<script>
const listOptions = ['创建人', '所有者', '所属部门',  ];
export default {
    name: 'listDesign',
    data() {
        return {
            formInline: {
                cityname: '',
                section: '',
                cities: [{
                    value: 'Beijing',
                    label: '部门一'
                }, {
                    value: 'Shanghai',
                    label: '部门二'
                }, {
                    value: 'Nanjing',
                    label: '部门三'
                }],
                linkman:'',
                creattime:''
            },
            tableData: [{
                title: '请假单',
                firmname: 'cloud-Platform',
                sex: 'men',
                address: '北京市',
                linkman: '管理员',
                flowstatus: 'normal'
            }, {
                title: '流程单',
                firmname: 'cloud-Platform',
                sex: 'men',
                address: '上海市',
                linkman: '管理员',
                flowstatus: 'normal'
            }],
            show1: true,
            show2: true,
            show3: true,
            show4: true,
            show5: true,
            show6: true,
            show7: true,
            show8: true,
            show9: true,
            show10: true,
            show11: true,
            show12: true,
            show13: true,
            activeName: 'first',
            //查询条件
            selectlists: ['公司名称','所属部门','联系人','创建时间'],
            //字段设置的列表字段
            checkAll: false,
            checkedlists: ['创建人','公司名称','联系人','流程状态','创建时间'],
            lists: listOptions,
            isIndeterminate: true,
            //列表设置
            checkList: [],
            value: 'firmname',
        }
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        //字段设置的查询条件
        selectCondition(item) {
            console.log(item)
            var obj=item
            this.selectlists.push(obj)
        },
        //字段设置的列表字段
        handleCheckAllChange(val) {
            this.checkedlists = val ? listOptions : [];
            this.isIndeterminate = false;
        },
        handleCheckedListsChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.lists.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.lists.length;
            console.log(this.checkedlists)
        },
        //提交
        Submit() {
            console.log(this.checkedlists)
            // for(var i=0;i<this.checkedlists.length;i++) {
            //     if(checkedlists[i]==)
            // }
            this.show1=this.show2=this.show3=this.show4=this.show5=this.show6=this.show7=this.show8=this.show9=this.show10=this.show11=this.show12=this.show13=true
            if(!(this.checkedlists.indexOf("创建人")!=-1))
               this.show1=false; 
            if(!(this.checkedlists.indexOf("所有者")!=-1))
               this.show2=false; 
            if(!(this.checkedlists.indexOf("所属部门")!=-1))
               this.show3=false; 
            if(!(this.checkedlists.indexOf("创建时间")!=-1))
               this.show4=false; 
            if(!(this.checkedlists.indexOf("修改时间")!=-1))
               this.show5=false; 
            if(!(this.checkedlists.indexOf("公司名称")!=-1))
               this.show6=false; 
            if(!(this.checkedlists.indexOf("联系电话")!=-1))
               this.show7=false;
            if(!(this.checkedlists.indexOf("性别")!=-1))
               this.show8=false; 
            if(!(this.checkedlists.indexOf("地址")!=-1))
               this.show9=false; 
            if(!(this.checkedlists.indexOf("联系人")!=-1))
               this.show10=false; 
            if(!(this.checkedlists.indexOf("流程状态")!=-1))
               this.show11=false; 
            if(!(this.checkedlists.indexOf("节点名称")!=-1))
               this.show12=false; 
            if(!(this.checkedlists.indexOf("当前处理人")!=-1))
               this.show13=false; 
        }
    }
}
</script>

<style lang="scss" scoped>
#listDesign {
    // height: 90vh;
    .el-container {
        .el-aside {
            span {
                font-size: 15px;
                font-weight: 800;
            }
            .el-form {
                margin-top: 15px;
            }
            .el-table {
                margin-top: 15px;
            }
        }
        .el-main {
            .el-tabs {
                margin-left: 15px;
                margin-top: -30px;
                span {
                    font-size: 15px;
                    font-weight: 800;
                    line-height: 2;
                }
                p {
                    line-height: 0.6;
                    margin-left: 6px;
                }
            }
        }
    }
}
</style>
<style>
#listDesign .el-input-group__prepend {
    padding: 0 10px;
}
#listDesign .firstTab .el-checkbox-group .el-checkbox__inner {
    margin-left: 120px;
}
#listDesign .firstTab .el-checkbox-group .el-checkbox__label {
    float: left;
    margin-left: -91px;
}
#listDesign .firstTab .el-checkbox__label {
    float: left;
}
</style>

