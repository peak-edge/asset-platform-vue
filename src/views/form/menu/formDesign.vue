<template>
    <div id="formDesign">
        <el-form :model="dynamicValidateForm" :inline="true" :rules="rules" ref="dynamicValidateForm">
            <el-form-item label="表单名称：" prop="input">
                <el-input 
                    v-model="dynamicValidateForm.input"
                    placeholder="请输入表单名称"
                    style="width:500px;margin-bottom: 15px;margin-right:25px">
                </el-input>
            </el-form-item>
            <el-form-item label="表单分组：">
                <el-select
                    :disabled="groupdisabled"
                    v-model="dynamicValidateForm.group"
                    placeholder="请选择表单分组（若不选择默认未分组）"
                    style="width:500px;margin-bottom: 15px;margin-right:30px">
                    <el-option
                        v-for="item in options"
                        :key="item.groupId"
                        :label="item.groupName"
                        :value="item.groupId">
                        <span style="float: left">{{ item.groupName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.groupId }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getjson()" style="float:right;margin-left:15px;position:fixed">{{buttonName}}</el-button>
            </el-form-item>
            <!-- <el-form-item label="表单名称：" prop="input">
                <el-select
                    v-model="dynamicValidateForm.icon"
                    placeholder="请选中表单图标"
                    style="width:85%">
                </el-select>
            </el-form-item> -->
        </el-form>
        <fm-making-form upload
            class="formMaking"
            ref="makingform"
            style="height: 500px;"
            preview>
            <template slot="action"></template>
        </fm-making-form>
    </div>
</template>

<script>
export default {
    name: 'formDesign',
    inject:['reload'],
    props: ['apptitle','appicon','appid','appybyid','group','formName','formid','formjson'],
    data() {
        return {
            dynamicValidateForm: {
                input: '',
                group: 0,
            },
            storage: '',
            rules: {
                input:[
                    { required: true, message: '请输入表单名称', trigger: 'blur' },
                ]
            },
            //是否修改，为0保存表单，为1修改表单
            wheaterModifier: 0,
            groupdisabled: false,
            // jsonData: {
            //     "list": [
            //     {
            //         "type": "input",
            //         "name": "单行文本",
            //         "icon": "icon-input",
            //         "options": {
            //         "width": "100%",
            //         "defaultValue": "",
            //         "required": false,
            //         "dataType": "string",
            //         "pattern": "",
            //         "placeholder": "",
            //         "remoteFunc": "func_1540908864000_94322"
            //         },
            //         "key": "1540908864000_94322",
            //         "model": "input_1540908864000_94322",
            //         "rules": [
            //         {
            //             "type": "string",
            //             "message": "单行文本格式不正确"
            //         }
            //         ]
            //     }
            //     ],
            //     "config": {
            //     "labelWidth": 100,
            //     "labelPosition": "top",
            //     "size": "small"
            //     }
            // },
            values: {},
            remoteFuncs: {},
            applist: '',
            options: [],
            buttonName: '保存表单',
        }
    },
    mounted() {
        this.$nextTick( function(){
            this.getinitalize(1)
            this.getGroupList(1)
        })
    },
    methods: {
        //得到路由传过来的参数
        getinitalize() {
            console.log(this.$store.state.user.chooseFormId)
            console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooo")
            // this.$refs.makingform.setJSON(this.jsonData)
            console.log(this.apptitle)
            console.log(this.appicon)
            console.log(this.appid)
            console.log(this.appybyid)
            console.log(this.group)
            console.log(this.formName)
            console.log(this.formid)
            console.log(this.formjson)
            if(this.formjson) {
                console.log("formjson:"+JSON.parse(this.formjson))
                this.dynamicValidateForm.input = this.formName;
                this.dynamicValidateForm.group = this.group;
                this.$refs.makingform.setJSON(JSON.parse(this.formjson));
                this.wheaterModifier = 1;
                this.groupdisabled = true
                this.buttonName = '修改表单'
            }
        },
        getGroupList() {
            console.log(this.$store.state.user.chooseFormId)
            //得到表单分组列表
            var Params = {
                appId: this.appid,
                sceneId: this.$store.state.user.loadScene.id,
                userId: this.$store.state.user.userId
            }
            var Params2 = {
                Authorization: this.$store.state.user.token,
            }
            console.log(Params)
            this.$ajax({
                url:'/dev-api/resource/form/list',
                method: 'get',
                contentType: "application/json; charset=utf-8",
                params: Params,
                headers: Params2
            }).then( res => {
                // this.formlist = res.data.data
                console.log(res.data.data)
                this.options = []
                for(var i=0;i<res.data.data.length;i++) {
                    var obj = []
                    obj.groupName = res.data.data[i].name
                    obj.groupId = res.data.data[i].id
                    this.options.push(obj)
                }
                console.log("--------------分组options---------------")
                console.log(this.options)
            }).catch( error => {
                console.log()
            })
        },
        /**获取设计器json数据**/
        getjson() {
            // console.log(this.apptitle)
            console.log(this.$refs.makingform)
            console.log(JSON.stringify(this.$refs.makingform.getJSON()));
            this.storage = this.$refs.makingform.getJSON();
            console.log(this.storage)
            this.$refs.dynamicValidateForm.validate((valid) => {
                if(valid) {
                    //如果新创建，则保存表单
                    if(this.wheaterModifier == 0) {
                        var Params = {
                            icon_cls: "",
                            app_id: this.appybyid,
                            form_name: this.dynamicValidateForm.input,
                            form_sheet: this.storage,
                            created_by: this.$store.state.user.userId,
                            scene_id: this.$store.state.user.loadScene.id,
                        }
                        console.log(Params)
                        this.$ajax({
                            url:'/my-api/form_model/save',
                            method: 'post',
                            contentType: "application/json; charset=utf-8",
                            data: Params
                        }).then( res => {
                            console.log(res)
                            if(res.data.obj.id) {
                                this.$root.appid = res.data.obj.id
                                this.$message({
                                    type: 'success',
                                    message: '保存成功' 
                                });
                                //添加到权限中
                                var Params = {
                                    groupId: this.dynamicValidateForm.group,
                                }
                                var Params1 = {
                                    applicationId: this.appybyid,
                                    formModelId: res.data.obj.id,
                                    formName: this.dynamicValidateForm.input,
                                    iconCls: "图标",
                                }
                                var Params2 = {
                                    Authorization: this.$store.state.user.token,
                                }
                                console.log(Params)
                                console.log(Params1)
                                this.$ajax({
                                    url:'/dev-api/resource/form/add',
                                    method: 'post',
                                    contentType: "application/json; charset=utf-8",
                                    params: Params,
                                    data: Params1,
                                    headers: Params2
                                }).then( res2 => {
                                    console.log(res2)
                                    if(res2.data.code==200)
                                        this.$message.success("添加权限操作成功")
                                    else 
                                        this.$message.error(res2.data.msg)
                                }).catch( error => {
                                    this.$message({
                                        type: 'error',
                                        message: '添加权限失败' 
                                    });
                                    console.log()
                                })
                            }
                            else {
                                this.$message({
                                    type: 'error',
                                    message: '保存失败' 
                                });
                            }
                        }).catch( error => {
                            console.log()
                        })
                    }
                    //修改表单
                    else {
                        var Params = {
                            form_model_id: this.$store.state.user.chooseFormId,
                            form_name: this.dynamicValidateForm.input,
                            form_sheet: this.storage,
                            group_id: -1,
                            icon_cls: "",
                        }
                        console.log(Params)
                        this.$ajax({
                            url:'/my-api/form_model/update',
                            method: 'patch',
                            contentType: "application/json; charset=utf-8",
                            data: Params
                        }).then( res => {
                            console.log(res)
                            if(res.data.code==200) {
                                this.$message.success("修改表单成功")
                            }
                            else
                                this.$message.error(res.data.msg)
                        }).catch( error => {
                            this.$message.error("修改表单失败")
                            console.log()
                        })
                    }
                }
                else {
                    console.log('错误')
                    return false;
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
#formDesign {
    // padding: 30px 20px;
    height: 87vh;
    // .input-name {
    //     margin-bottom: 15px;
    // }
}
</style>
<style>
.fm2-container{
    height:88% !important;
}
.fm2-container .el-footer {
    display: none;
}
</style>

