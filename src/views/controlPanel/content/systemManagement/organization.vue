<template>
    <el-container class="organization-container">
        <el-main>
            <el-menu class="el-menu-demo" mode="horizontal"> 
                <el-input placeholder="搜索单位和部门" style="float:left;width:250px;" size="small" v-model="searchName">
                    <el-button slot="append" icon="el-icon-search" @click="highlight()"></el-button>
                </el-input>
                <el-button size="mini" type="warning" style="margin-left:15px;margin-top:2px" @click="clearAll()">清除</el-button>
                <div class="buttongroup">
                    <el-button type="primary" size="mini" disabled>同步组织机构树</el-button>
                    <el-button type="danger" size="mini" style="margin-right:0px" disabled>批量移除</el-button>
                    <el-button type="primary" size="mini" style="margin-right:20px" disabled>新增</el-button>
                </div>
            </el-menu>
            <el-card>
                <div class="organ-architecture">
                    <span class="attribute">属性设置:</span> 
                    <el-checkbox v-model="horizontal">横向/纵向</el-checkbox>
                    <el-checkbox v-model="collapsable">折叠</el-checkbox>
                    <el-checkbox v-model="expandAll" @change="expandChange">扩展</el-checkbox>
                    <div class="labelColor" style="float:right">
                        标签颜色:  &nbsp;
                        <el-select v-model="labelClassName" clearable placeholder="请选择标签颜色" size="mini">
                            <el-option
                                v-for="item in colors"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                <span style="float: left">{{ item.label }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                            </el-option>
                        </el-select>
                    </div>
                    <div class="text-center">
                        <vue2-org-tree 
                            name="test"
                            :data="data"
                            :horizontal="horizontal"
                            :collapsable="collapsable"
                            :label-class-name="labelClassName"
                            :render-content="renderContent"
                            @on-expand="onExpand"
                            @on-node-click="onNodeClick"
                        />
                    </div>
                </div>
                <!-- <el-tree 
                    :props="props"
                    :data="treeData" 
                    @node-click="handleNodeClick"
                    default-expand-all
                    highlight-current>
                </el-tree> -->
                <el-dialog title="节点详情" :visible.sync="dialogVisible">
                    <el-table :data="gridData">
                        <el-table-column property="id" label="节点ID"></el-table-column>
                        <el-table-column property="label" label="节点名称" width="150"></el-table-column>
                        <el-table-column property="sort" label="节点序号" width="80"></el-table-column>
                        <el-table-column property="childrenName" label="直系子节点名称"></el-table-column>
                    </el-table>
                    <div class="dialog-buttongroup" style="text-align:right;margin:30px 20px 0px;">
                        <el-button @click="dialogVisible = false;resetForm('newNodeForm')" size="small">取 消</el-button>
                        <el-button type="info" size="small" @click="showEdit()" disabled>编辑该节点</el-button>
                        <el-button type="primary" size="small" @click="showNewSon()">新增子节点</el-button>
                        <el-button type="danger" size="small" @click="deleteNode()">删除此节点</el-button>
                    </div>
                    <div v-if="edit" style="margin-top:30px;"> 
                        <el-divider content-position="left">编辑该节点</el-divider>
                        <el-form :model="editForm" ref="editForm" label-width="180px" size="small">
                            <el-form-item label="请输入该节点新的名称：">
                                <el-input v-model="editForm.editRow"
                                    clearable 
                                    style="width:430px" 
                                    size="small"
                                    maxlength="10"
                                    show-word-limit>
                                </el-input>
                            </el-form-item>
                            <el-form-item style="text-align:right;margin:0 20px 0px">
                                <el-button type="success" @click="onEdit()">确认</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="newson" style="margin-top:30px;">
                        <el-divider content-position="left">新增子节点</el-divider>
                        <el-form :model="newNodeForm" ref="newNodeForm" label-width="180px" size="small">
                            <el-form-item
                                v-for="(domain, index) in newNodeForm.domains"
                                :label="'请输入新增子节点名称' + index +':'"
                                :key="domain.key"
                                :prop="'domains.' + index + '.value'">  
                                <el-input v-model="domain.value"
                                    clearable 
                                    style="width:430px" 
                                    maxlength="18"
                                    show-word-limit>
                                </el-input>
                                <el-button @click.prevent="removeDomain(domain)" type="danger" icon="el-icon-delete" circle style="margin-left:18px"></el-button>
                            </el-form-item>
                            <el-form-item style="text-align:right;margin:0 20px 0px">
                                <el-button type="primary" @click="addDomain">添加</el-button>
                                <el-button type="success" @click="onSubmit()">确认</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-dialog>
            </el-card>
        </el-main>
    </el-container>
</template>

<script type="text/javascript">
$("#aa").trigger("change");
</script>
<script>
export default {
    name: 'organization-container',
    inject: ['reload'],  
    data() {
        return{
            // treeData: [{
            //     label: '单位 1',
            //     children: [{
            //         label: '单位 1-1',
            //         children: [{
            //              label: '单位 1-1-1'
            //         }]
            //     }]
            //     }, {
            //     label: '单位 2',
            //     children: [{
            //         label: '单位 2-1',
            //         children: [{
            //              label: '单位 2-1-1'
            //         }]
            //     }, {
            //         label: '单位 2-2',
            //         children: [{
            //              label: '单位 2-2-1'
            //         }]
            //     }]
            //     }, {
            //     label: '单位 3',
            //     children: [{
            //         label: '单位 3-1',
            //         children: [{
            //         label: '单位 3-1-1'
            //         }]
            //     }, {
            //         label: '单位 3-2',
            //         children: [{
            //         label: '单位 3-2-1'
            //         }]
            //     }]
            // }],
            // checkedKeys: [],
            //组织架构
            searchName: '',
            colors: [{
                value: 'bg-white',
                label: '白色'
            }, {
                value: 'bg-orange',
                label: '橙色'
            }, {
                value: 'bg-gold',
                label: '金色'
            }, {
                value: 'bg-gray',
                label: '灰色'
            }, {
                value: 'bg-lightpink',
                label: '粉色'
            }, {
                value: 'bg-chocolate',
                label: '巧克力色'
            }, {
                value: 'bg-tomato',
                label: '番茄色'
            }],
            data: {},
            horizontal: true,
            collapsable: true,
            expandAll: false,
            labelClassName: "bg-white",
            searchColor: "bg-orange",
            isNodeCenter: false,
            dialogVisible: false,
            gridData: [
                {
                    label: '',
                }
            ],
            newson: false,
            edit: false,
            editForm: {
                editRow: '',
            },
            newNodeForm: {
                domains: [{
                    value: ''
                }],
            },
        }
    },
    mounted() {
        this.$nextTick( function(){
            this.getMainTree(1)
        })
    },
    methods: {
        //得到主组织树
        getMainTree() {
            console.log(this.$store.state.user.token)
            var Params = {
            }
            var Params2 ={
                Authorization: this.$store.state.user.token
            }
            this.$ajax({
                url:'/dev-api/organ/mainTree',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                if(res.data.data) {
                    this.data = res.data.data
                    this.data = JSON.parse(JSON.stringify(this.data).replace(/unitName/g, 'label'))
                    // console.log(JSON.stringify(this.data.children).slice(1, -1))
                    // this.data = this.data.children
                    console.log(this.data)
                    this.initial(1)
                    // this.expandChange()
                }
                else {
                    this.$message.error('后台系统错误');
                }
            }).catch( error => {
                console.log()
            })
        },
        //高亮搜索部分
        highlight() {
            this.clearcolor()
            var demo = document.getElementsByClassName("org-tree-node-label-inner");
            // console.log(demo.style.background-color)
            for(let i=0;i<demo.length;i++)
            {
                if(this.searchName && demo[i].innerText.indexOf(this.searchName)!=-1) {
                    demo[i].style.background = "orange"
                    // demo[i].style.background = this.searchColor
                    // console.log(demo[i])
                }
                // else {
                //     // demo[i].style.background = this.labelClassName
                //     console.log(demo[i].style.background)
                // }
            }
        },
        //清除上一次高亮的节点颜色
        clearcolor() {
            var demo = document.getElementsByClassName("org-tree-node-label-inner");
            console.log(this.labelClassName)
            for(let i=0;i<demo.length;i++) {
                demo[i].style.background = "white"
            }
        },
        clearAll() {
            this.reload()
        },
        // handleNodeClick(data) {
        //     console.log(data);
        // },
        //初始化强制展开
        initial() {
            this.expandAll = true
            this.expandChange()
        },
        //呈现内容为节点的key为label的值
        renderContent(h, data) {
            return data.label;
        },
        //是否展开
        onExpand(e,data) {
            if ("expand" in data) {
                data.expand = !data.expand;
                if (!data.expand && data.children) {
                    this.collapse(data.children);
                }
            } else {
                this.$set(data, "expand", true);
            }
            this.isNodeCenter = true
        },
        //点击树的某节点处(选中功能)
        onNodeClick(e, data) {
            console.log(e)
            if(e.toElement.className.indexOf("org-tree-node-label-inner")!=-1) {
                this.dialogVisible = true
                var obj = []
                var childrenAll = []
                obj.id = data.id
                obj.label = data.label
                obj.sort = data.sort
                for(let i in data.children)
                    childrenAll.push(data.children[i].label)
                console.log(childrenAll)
                if(childrenAll.length>0)
                    obj.childrenName = childrenAll.join()
                else
                    obj.childrenName = "无"
                console.log(obj)
                this.gridData[0] = obj
            }
        },
        //折叠展开
        collapse(list) {
            var _this = this;
            list.forEach(function(children) {
                if (children.expand) {
                    children.expand = false;
                }
                children.children && _this.collapse(children.children);
            });
        },
        expandChange() {
            this.$forceUpdate()
            console.log("open")
            console.log(this.data+","+this.expandAll)
            this.toggleExpand(this.data, this.expandAll);
        },
        toggleExpand(data, val) {
            // console.log(data+","+val)
            var _this = this;
            if (Array.isArray(data)) {
                // console.log("111111")
                data.forEach(function(item) {
                    _this.$set(item, "expand", val);
                    if (item.children) {
                        _this.toggleExpand(item.children, val);
                    }
                });
            } else {
                // console.log("222222")
                this.$set(data, "expand", val);
                if (data.children) {
                    _this.toggleExpand(data.children, val);
                }
            }
        },
        //是否显示编辑 
        showEdit() {
            console.log(this.edit)
            this.edit = !this.edit
        },
        //是否显示新增子节点的部分页面
        showNewSon() {
            this.newson = !this.newson
        },
        //重置
        resetForm(formName) {
            // this.$refs[formName].resetFields();
            this.newNodeForm.domains.length = 1
            this.newNodeForm.domains[0].value = ''
            this.newson = false
        },
        removeDomain(item) {
            var index = this.newNodeForm.domains.indexOf(item)
            if (index !== -1) {
                this.newNodeForm.domains.splice(index, 1)
            }
        },
        addDomain() {
            this.newNodeForm.domains.push({
                value: '',
                key: Date.now()
            });
        },
        //编辑
        onEdit() {
            console.log(this.editForm.editRow)
        },
        //提交按钮
        onSubmit() {
            var obj = []
            for(let i=0;i<this.newNodeForm.domains.length;i++) {
                var objdata = {}
                objdata.parentId = this.gridData[0].id
                objdata.sort = 0
                objdata.unitName = this.newNodeForm.domains[i].value
                obj.push(objdata)
            }
            // console.log(obj)
            var Params = obj
            this.$ajax({
                url:'/dev-api/organ/nodes',
                method: 'post',
                contentType: "application/json; charset=utf-8",
                data: Params
            }).then( res => {
                console.log(res.data)
                if(res.data.code==200) {
                    this.dialogVisible = false
                    this.resetForm('newNodeForm')
                    this.getMainTree()
                    this.$message.success("新增节点成功");
                }
                else {
                    this.$message.error(res.data.msg);
                }
            }).catch( error => {
                console.log()
            })
        },
        //删除该节点
        deleteNode() {
            var Params = [{
                id: this.gridData[0].id,
            }]
            this.$ajax({
                url:'/dev-api/organ/nodes',
                method: 'delete',
                contentType: "application/json; charset=utf-8",
                data: Params
            }).then( res => {
                console.log(res.data)
                if(res.data.code==200) {
                    this.dialogVisible = false
                    this.getMainTree()
                    this.$message.success("删除节点成功");
                }
                else {
                    this.$message.error(res.data.msg);
                }
            }).catch( error => {
                console.log()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.organization-container {
    height:92vh;
    .el-main {
        border-left: none;
        padding-top: 4px;
        background: rgb(242,242,242);
        .el-menu {
            padding-top: 5px !important;
            margin-top: 10px;
            padding: 20px;
            background-color: rgb(242,242,242);
            .buttongroup {
                float: right;
                margin-top: 8px;
            }
        }
        .el-card {
            margin-top: 10px;
            height: 80vh;
            display: block;
            margin-left: 0px;
            margin-right: 0px;
            overflow: auto;
            .organ-architecture {
                padding: 0 40px 0 40px;
                .attribute {
                    display: block;
                    font-weight: bold;
                    line-height: 3;
                }
            }
        }
        
    }
    
}
</style>
<style>
/* .el-tree {
    padding-left:30px;
} */
/* .el-tree-node__content {
    margin-left:60px;
    height: 35px;
    padding-left:20px;
}
.el-tree-node__children {
    padding-left:50px;
} */


.org-tree-node-label {
    white-space: nowrap;
}
.bg-white {
    background-color: white;
}
.bg-orange {
    background-color: orange;
}
.bg-gold {
    background-color: gold;
}
.bg-gray {
    background-color: gray;
}
.bg-lightpink {
    background-color: lightpink;
}
.bg-chocolate {
    background-color: chocolate;
}
.bg-tomato {
    background-color: tomato;
}

.organization-container .el-input .el-input__count .el-input__count-inner {
    background-color:rgba(0,0,0,0)
}
  /* 更改element-UI按钮样式 */
.organization-container .el-button--primary{
    color: #fff;
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);
}
.organization-container .el-button--primary:hover{
    background-color: rgb(62,149,181);
    border-color: rgb(62,149,181);  
}
.organization-container .el-button--primary:focus{
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);  
}
</style>

