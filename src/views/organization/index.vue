<template>
    <el-container id="organization-container">
        <el-aside width="240px">
            <el-button type="primary" size="small" class="editbutton">编辑组织机构</el-button>
            <!-- 通过场景获取组织列表 -->
            <el-tree 
                :data="grouptreedata" 
                :props="defaultProps" 
                :default-expand-all="true"
                :highlight-current="true"
                :expand-on-click-node="false"
                @node-click="handleNodeClick">
            </el-tree>
        </el-aside>
        <el-main>
            <el-card class="origan-card">·
                <span>{{title}}<i class="el-icon-user" @click="dialog4=true"></i></span>
                <el-input placeholder="搜索员工" size="small" v-model="memberName" style="width:200px;float:right">
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="getGroupMembers"></i>
                </el-input>
                <el-table
                    :data="tableData"
                    stripe
                    style="width:100%;min-height:67vh"
                    :header-cell-style="tableHeaderColor">
                    <el-table-column width="15"></el-table-column>
                    <el-table-column prop="realName" label="姓名" width="150"></el-table-column>
                    <el-table-column prop="username" label="用户名" width="150"></el-table-column>
                    <el-table-column prop="mainsection" label="主部门" width="160"></el-table-column>
                    <el-table-column prop="userEmail" label="邮箱" width="130"></el-table-column>
                    <el-table-column prop="roles" label="角色" min-width="190"></el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="250">
                        <template slot-scope="scope"> 
                            <el-button type="text" @click="setMainSection(scope.row)" size="small">设置主部门</el-button>
                            <el-button type="text" @click="setRoleAuth(scope.row)" size="small">角色授权</el-button>
                            <el-button type="text" @click="taskConnect(scope.row)" size="small">任务交接</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="Total"
                    style="text-align:right;margin-top:10px;">
                </el-pagination>
            </el-card>
        </el-main>

        <!-- 第一个设置主部门对话框 -->
        <el-dialog title="设置主部门" :visible.sync="dialog1" width="500px">
            <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="80px" size="medium">
                <el-form-item label="主部门" prop="mainsection">
                    <el-select v-model="ruleForm1.mainsection" placeholder="请选择主部门" style="width:360px">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog1 = false;$refs['ruleForm1'].resetFields();" size="medium">取 消</el-button>
                <el-button type="primary" @click="dialog1 = false" size="medium">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 第二个设置角色授权对话框 -->
        <el-dialog title="角色授权" :visible.sync="dialog2" width="500px">
            <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="63px" size="medium">
                <el-form-item label="角色" prop="roles">
                    <el-select v-model="ruleForm2.roles" placeholder="请选择角色" multiple style="width:377px">
                        <el-option
                            v-for="item in options2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog2 = false;$refs['ruleForm2'].resetFields();" size="medium">取 消</el-button>
                <el-button type="primary" @click="dialog2 = false" size="medium">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 第三个设置任务交接对话框 -->

        <!-- 第四个设置部门负责人对话框 -->
        <el-dialog title="部门负责人" :visible.sync="dialog4" width="500px">
            <el-form :model="ruleForm4" :rules="rules4" ref="ruleForm4" label-width="100px" size="medium">
                <el-form-item label="部门负责人" prop="sectionboss">
                    <el-select v-model="ruleForm4.sectionboss" placeholder="请选择角色" style="width:350px">
                        <el-option
                            v-for="item in options4"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog4 = false;$refs['ruleForm4'].resetFields();" size="medium">取 消</el-button>
                <el-button type="primary" @click="dialog4 = false" size="medium">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
import { options } from '@/icons/icon.json'
export default {
    name: 'organization-container',
    data() {
        return {
            grouptreedata: [],
            defaultProps: {
                label: 'unitName',
                children: 'children'
            },
            title: '请选择',
            nodeId: '',
            memberName: '',
            tableData: [],
            //分页
            currentPage: 1,
            Total: 0,
            pageSize: 10,
            //第一个设置主部门对话框
            dialog1: false,
            ruleForm1: {
                mainsection: '',
            },
            rules1: {
                mainsection: { required: true, message: '请选择主部门', trigger: 'change' }
            },
            //第二个设置角色授权对话框
            dialog2: false,
            ruleForm2: {
                roles: [],
            },
            rules2: {
                roles: { required: true, message: '请选择角色', trigger: 'change' }
            },
            options2: [],
            //第四个设置部门负责人对话框
            dialog4: false,
            ruleForm4: {
                sectionboss: '',
            },
            rules4: {
                sectionboss: { required: true, message: '请选择部门负责人', trigger: 'change' }
            },
            options4: []
        }
    },
    mounted() {
        this.$nextTick( function(){
            this.getGroupList(1)
            this.getGroupMembers(1)
            this.getSceneRole(1)
        })
    },
    methods: {
        //通过场景获取组织
        getGroupList() {
            var Params = {
                sceneId: this.$store.state.user.loadScene.id
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/organ/scene/'+this.$store.state.user.loadScene.id,
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.status==200) {
                    this.grouptreedata=res.data.obj.children
                }
                else 
                    this.$message.error(res.data.msg)
            }).catch( error => {
                console.log()
            })
        },
        //点击树形组织机构的动作
        handleNodeClick(data) {
            console.log(data);
            console.log(data.id)
            this.nodeId = data.id
            this.getGroupMembers()
            this.title = data.unitName
        },
        //场景中通过组织部门获取所属用户
        getGroupMembers() {
            var Params = {
                memberName: this.memberName,
                nodeId: this.nodeId,
                page: 1,
                size: 9,
                sceneId: this.$store.state.user.loadScene.id
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/scene/node/members/list',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.status==200) {
                    this.Total = res.data.obj.total
                    this.tableData = res.data.obj.list
                    this.options4 = []
                    for(var i=0;i<this.tableData.length;i++) {
                        var obj = {}
                        obj.label = this.tableData[i].realName
                        obj.value = this.tableData[i].username
                        this.options4.push(obj)
                    }
                    console.log(this.options4)
                }
                else 
                    this.$message.error(res.data.msg)
            }).catch( error => {
                console.log()
            })
        },
        //获取场景中的角色（用于设置授权）
        getSceneRole() {
            var Params = {
                userId: this.$store.state.user.userId,
                sceneId: this.$store.state.user.loadScene.id
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/scene/role/authorities',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.status==200) {
                    this.options2 = []
                    for(var i=0;i<res.data.obj.options.length;i++) {
                        var obj = {}
                        obj.label = res.data.obj.options[i].roleNameZh
                        obj.value = res.data.obj.options[i].id
                        this.options2.push(obj)
                    }
                    console.log(this.options2)
                    this.ruleForm2.roles=res.data.obj.values
                }
                else 
                    this.$message.error(res.data.msg)
            }).catch( error => {
                console.log()
            })
        },
        //设置主部门按钮
        setMainSection(row) {
            // this.dialog1 = true
            this.$message.warning("暂未实现")
        },
        //设置角色授权按钮
        setRoleAuth(row) {
            this.dialog2 = true
        },
        //设置任务交接按钮
        taskConnect(row) {
            this.$message.warning("暂未实现")
        },
        //分页
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
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color:rgb(244,248,252); color:#333;'
            }
        },
    }
}
</script>

<style lang="scss" scoped>
#organization-container {
    height:92vh;
    .el-aside {
        border-right: 1px solid #e6e6e6;
        top: 52px;
        left: 0;
        bottom: 0;
        padding: 24px 8px;
        background: #fff;
        .editbutton {
            width: 100%;
            font-size: 14px;
            margin-bottom: 15px;
        }
        .el-menu-vertical-demo {
            border-right: none;
        }
    }
    .el-main {
        padding: 30px;
        background-color:rgb(242,245,248);
        .origan-card {
            box-shadow: none;
            border: none;
            height: 100%;
            padding: 15px;
            .el-icon-user {
                margin-left: 15px;
                font-size: 17px;
                color: #107fff;
            }
            .el-table {
                margin-top: 30px;
            }
        }
    }
}
</style>
<style>
#organization-container .el-tree-node__content {
    height: 35px;
    padding-left: 20px;
}
#organization-container .el-tree-node__label {
    font-size: 14px;
}
</style>

