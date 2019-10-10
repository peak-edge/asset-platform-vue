<template>
    <el-container id="organization-container">
        <el-aside min-width="240px">
            <el-button type="primary" size="small" class="editbutton" disabled>编辑组织机构</el-button>
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
                    <el-table-column prop="realName" label="姓名" min-width="90"></el-table-column>
                    <el-table-column
                        prop="nodePrincipal"
                        label="是否为管理员"
                        width="120"
                        :filters="[{ text: '管理员', value: '管理员' }, { text: '非管理员', value: '非管理员' }]"
                        :filter-method="filterTag"
                        filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <el-tag
                                :type="scope.row.nodePrincipal === '管理员' ? 'primary' : 'info'"
                                disable-transitions>{{scope.row.nodePrincipal}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="username" label="用户名" min-width="150"></el-table-column> -->
                    <el-table-column prop="id" label="用户ID" min-width="330"></el-table-column>
                    <el-table-column prop="mainsection" label="主部门" min-width="160"></el-table-column>
                    <el-table-column prop="userEmail" label="邮箱" min-width="100"></el-table-column>
                    <el-table-column prop="roles" label="角色" min-width="170"></el-table-column>
                    <el-table-column prop="rolesId" label="角色ID" min-width="190" v-if="show"></el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="180">
                        <template slot-scope="scope"> 
                            <el-button type="text" @click="setMainSection(scope.row)" size="small">设置主部门</el-button>
                            <el-button type="text" @click="setRoleAuth(scope.row)" size="small">角色授权</el-button>
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
        <el-dialog title="设置主部门" :close-on-click-modal="false" :visible.sync="dialog1" width="500px">
            <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="80px" size="medium">
                <el-form-item label="主部门" prop="mainSection">
                    <el-select v-model="ruleForm1.mainSection" placeholder="请选择主部门" style="width:360px">
                        <el-option :value="mainSectionValue" style="height:auto">
                            <el-tree 
                                ref="tree"
                                :data="data" 
                                :props="defaultTreeProps" 
                                highlight-current
                                node-key="id"
                                :current-node-key="currentKey"
                                :default-expand-all="true"
                                :check-on-click-node="true"
                                :expand-on-click-node="false"
                                @node-click="handleNodeTreeClick">
                            </el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog1=false;$refs['ruleForm1'].resetFields();" size="medium">取 消</el-button>
                <el-button type="primary" @click="submitMainSection()" size="medium">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 第二个设置角色授权对话框 -->
        <el-dialog title="角色授权" :close-on-click-modal="false" :visible.sync="dialog2" width="500px">
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
                <el-button type="primary" @click="submitRoleAuth()" size="medium">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 第三个设置任务交接对话框 -->

        <!-- 第四个设置部门负责人对话框 -->
        <el-dialog title="部门负责人" :close-on-click-modal="false" :visible.sync="dialog4" width="500px">
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
                <el-button type="primary" @click="submitBoss()" size="medium">确 定</el-button>
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
            title: '请选择部门',
            titleId: '',
            nodeId: '',
            memberName: '',
            tableData: [],
            show: false,
            //分页
            currentPage: 1,
            Total: 0,
            pageSize: 10,
            //第一个设置主部门对话框
            dialog1: false,
            ruleForm1: {
                mainSection: '',
            },
            rules1: {
                mainSection: { required: true, message: '请选择主部门', trigger: 'change' }
            },
            mainSectionValue: '',
            data: [],
            defaultTreeProps: {
                label: 'unitName',
                children: 'children'
            },
            currentKey: '',
            userId: '',
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
            leader: '',
            dialog4: false,
            ruleForm4: {
                sectionboss: '',
            },
            rules4: {
                sectionboss: { required: true, message: '请选择部门负责人', trigger: 'change' }
            },
            options4: [],
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
        handleNodeTreeClick(data) {
            console.log(data.id);
            // this.mainSection = data.id
            this.ruleForm1.mainSection = data.unitName
            this.mainSectionValue = data.id
            console.log(this.ruleForm1.mainSection)
            // this.ruleForm4.sectionboss = data.id
        },

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
                if(res.data.code==200) {
                    this.grouptreedata = res.data.data.children
                    this.data = res.data.data.children
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
            this.titleId = data.id
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
                if(res.data.code==200) {
                    this.ruleForm4.sectionboss = ''
                    this.Total = res.data.data.total
                    this.tableData = res.data.data.list
                    this.options4 = []
                    for(var i=0;i<this.tableData.length;i++) {
                        this.tableData[i].roles=[]
                        for(var j=0;j<this.tableData[i].sceneRoles.length;j++) {
                            this.tableData[i].roles.push(this.tableData[i].sceneRoles[j].roleNameZh)
                        }
                        this.tableData[i].roles=this.tableData[i].roles.join(",")
                        this.tableData[i].rolesId=[]
                        for(var j=0;j<this.tableData[i].sceneRoles.length;j++) {
                            this.tableData[i].rolesId.push(this.tableData[i].sceneRoles[j].id)
                        }
                        this.tableData[i].mainsection = this.title
                        if(this.tableData[i].nodePrincipal==1) {
                            this.tableData[i].nodePrincipal="管理员"
                            this.ruleForm4.sectionboss = this.tableData[i].id
                        }
                        else
                            this.tableData[i].nodePrincipal="非管理员"
                        var obj = {}
                        obj.label = this.tableData[i].realName
                        obj.value = this.tableData[i].id
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
                if(res.data.code==200) {
                    this.options2 = []
                    for(var i=0;i<res.data.data.options.length;i++) {
                        var obj = {}
                        obj.label = res.data.data.options[i].roleNameZh
                        obj.value = res.data.data.options[i].id
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
        //设置主部门按钮----------------------------------------------------------------------------------------------------------------
        setMainSection(row) {
            this.ruleForm1.mainSection = this.title
            this.mainSectionValue = this.nodeId
            this.userId = row.id
            this.currentKey = this.nodeId
            this.dialog1 = true
            console.log(row)
        },
        //设置主部门确定按钮
        submitMainSection() {
            var Params = {
                nodeId: this.mainSectionValue,
                userId: this.userId,
                sceneId: this.$store.state.user.loadScene.id
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            console.log(Params)
            this.$ajax({
                url:'/dev-api/scene/node/set',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.code==200) {
                    this.dialog1 = false
                    this.$message.success("设置主部门成功")
                    this.getGroupMembers()
                }
                else 
                    this.$message.error(res.data.msg)
            }).catch( error => {
                console.log()
            })
        },
        //设置角色授权按钮-------------------------------------------------------------------------------------------------------------
        setRoleAuth(row) {
            this.dialog2 = true
            this.ruleForm2.roles = row.rolesId
            this.userId = row.id
        },
        //设置角色权限确定按钮
        submitRoleAuth() {
            var Params = {
                rids: this.ruleForm2.roles.join(","),
                userId: this.userId,
                sceneId: this.$store.state.user.loadScene.id
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            console.log(Params)
            this.$ajax({
                url:'/dev-api/scene/role/set-roles',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.code==200) {
                    this.dialog2 = false
                    this.$message.success("设置角色授权成功")
                    this.getGroupMembers()
                }
                else 
                    this.$message.error(res.data.msg)
            }).catch( error => {
                console.log()
            })
        },
        //设置部门负责人-----------------------------------------------------------------------------------------------
        //设置部门负责人确定按钮
        submitBoss() {
            var Params = {
                nodeId: this.titleId,
                userId: this.ruleForm4.sectionboss,
                sceneId: this.$store.state.user.loadScene.id
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            console.log(Params)
            this.$ajax({
                url:'/dev-api/scene/principal/set',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                console.log(res)
                if(res.data.code==200) {
                    this.dialog4 = false
                    this.$message.success("设置部门负责人成功")
                    this.getGroupMembers()
                }
                else 
                    this.$message.error(res.data.msg)
            }).catch( error => {
                console.log()
            })
        },
        //分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize = val
            this.getGroupMembers()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val
            this.getGroupMembers()
        },
        //表格中的标签
        filterTag(value, row) {
            return row.nodePrincipal === value;
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
            overflow-y: auto;
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

