<template>
	<div class="regStep4">
		<div class="search-tip">
			<el-input
				placeholder="请输入关键词"
				prefix-icon="el-icon-search"
				v-model="input"
				size="small">
			</el-input>
			<el-button type="primary" size="small" @click="lookOut()">查 找</el-button>
		</div>
		<div class="group-tip">
			<span>组织架构列表： </span>
			<!-- <el-button type="text" style="padding:0px" @click="dialogVisible=true;getMainTree()">+ 新增场景</el-button> -->
			<el-row :gutter="10">
				<el-col :span="8" v-for="(item,index) in scenelist" :key="index" :index="String(index)">
					<viewer :images="images">
						<img :src="imgUrl" alt="场景图片" class="picture-tip"/>
					</viewer>
					<el-radio :label="item" style="float:right;position:absolute" v-model="checkedinfo" @change="lookOut()">{{item.sceneName}}</el-radio>
					<el-tooltip class="item" effect="dark" :content="item.id" placement="bottom">
						<div class="description-tip">{{item.id}}</div>
					</el-tooltip>
				</el-col>
			</el-row>
		</div>
		<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="1"
			:page-sizes="[6, 9, 12, 15]"
			:page-size="pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="sceneTotal"
			style="text-align:right;margin-top:10px">
		</el-pagination>
		<!-- 新增场景对话框 -->
		<el-dialog title="新增场景" :visible.sync="dialogVisible" style="width:120%;margin-left:-8%">
			<div style="margin-bottom:15px;margin-left:18px;"> 
				<span>设置场景名称：</span>
				<el-input size="small" style="width:678px" placeholder="为新场景设置场景名称" v-model="newSceneName"></el-input>
			</div>
			<tree-transfer 
				class="treeTransfer"
				v-if="hardReset"
				:title="transferTitle" 
				:from_data='fromData' 
				:to_data='toData' 
				:defaultProps="{label:'label'}" 
				@addBtn='add' 
				@removeBtn='remove' 
				:mode='mode' 
				height='540px' 
				filter 
				openAll>
			</tree-transfer>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">重 置</el-button>
				<el-button type="primary" @click="dialogVisible = false;toSubmitScene()">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import treeTransfer from 'el-tree-transfer' // 引入
export default {
	name: 'Step4',
	components: {
		treeTransfer
	},
	data() {
        return {
			input: '',
			imgUrl: require("@/assets/404_images/404.png"),
			images: [],
			checkedinfo: '1',
			scenelist: [],
			nowAuth: '',
			//分页
			currentPage:1,
            sceneTotal: 0,
			pageSize: 6,
			//新增场景
			newSceneName: '',
			dialogVisible: false,
			transferTitle: ["组织架构","该场景组织部门"],
			mode: "transfer", // transfer穿梭框模式  addressList通讯录模式
			hardReset: false,
			fromData: [],
			toData: [],
			allNodes: []
		}
	},
	mounted() {
        this.$nextTick( function(){
			this.getALLPlaceList(1)
        })
    },
	methods: {
		//展示场景获取令牌
		getALLPlaceList() {
            this.$ajax({
                url:'/dev-api/oauth/token?grant_type=client_credentials&scope=admin',
                method: 'post',
				contentType: "application/json; charset=utf-8",
                auth: {
					username: 'clientadmin',
					password: '123'
				}
            }).then( res => {
				console.log(res.data.access_token)
				this.nowAuth = res.data.access_token
				//展示所有场景
				var Params2 = {
					page: this.currentPage,
					size: this.pageSize
				}
				var Params3 = {
					Authorization: "Bearer "+ res.data.access_token,
				}
				this.$ajax({
					url:'/dev-api/api/rest/scenes',
					method: 'get',
					contentType: "application/json; charset=utf-8",
					params: Params2,
					headers: Params3
				}).then( res => {
					this.sceneTotal = res.data.obj.total
					this.scenelist = res.data.obj.list
					console.log(this.scenelist)
				}).catch( error => {
					console.log()
				})
			}).catch( error => {
				console.log()
			})
		},
		//查找
		lookOut() {
			console.log(this.checkedinfo)
		},
		//分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize = val
            this.getALLPlaceList()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val
            this.getALLPlaceList()
		},
		//新增场景
		//得到主组织树
		getMainTree() {
			var Params = {}
			var Params2 = {
				Authorization: "Bearer "+ this.nowAuth,
			}
            this.$ajax({
                url:'/dev-api/api/mainTree',
                method: 'get',
                contentType: "application/json; charset=utf-8",
				params: Params,
				headers: Params2
            }).then( res => {
				console.log(res)
                if(res.data.obj) {
                    this.fromData[0] = res.data.obj
                    this.fromData[0] = JSON.parse(JSON.stringify(this.fromData[0]).replace(/unitName/g, 'label'))
                    this.fromData[0] = JSON.parse(JSON.stringify(this.fromData[0]).replace(/parentId/g, 'pid'))
                    console.log(this.fromData)
                    this.$nextTick(() => {
                        this.hardReset= true
                    });
                }
                else {
                    this.$message.error('后台系统错误');
                }
            }).catch( error => {
                console.log()
            })
		},
		// 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
        changeMode() {
            if (this.mode == "transfer") {
                this.mode = "addressList";
            } else {
                this.mode = "transfer";
            }
        },
        // 监听穿梭框组件添加
        add(fromData,toData,obj){
            // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
            // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
            console.log("fromData:", fromData);
            console.log("toData:", toData);
			console.log("obj:", obj);
			// this.allNodes = []
			for(var i=0;i<obj.keys.length;i++)
				this.allNodes.push(obj.keys[i])
			for(var j=0;j<obj.harfKeys.length;j++)
				this.allNodes.push(obj.harfKeys[j])
			this.allNodes = this.unique(this.allNodes)
			console.log(this.allNodes)
        },
        // 监听穿梭框组件移除
        remove(fromData,toData,obj){
            // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
            // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
            console.log("fromData:", fromData);
            console.log("toData:", toData);
			console.log("obj:", obj);
			var removeNode = []
			for(var i=0;i<obj.keys.length;i++)
				removeNode.push(obj.keys[i])
			// for(var j=0;j<obj.harfKeys.length;j++)
			// 	removeNode.push(obj.harfKeys[j])
			console.log(removeNode)
			this.allNodes = this.allNodes.filter(function(v){ return removeNode.indexOf(v) == -1 })
			console.log(this.allNodes)
		},
		//数组去重
		unique(arr){
			var hash=[];
			for (var i = 0; i < arr.length; i++) {
				if(arr.indexOf(arr[i])==i){
				hash.push(arr[i]);
				}
			}
			return hash;
		},
		//提交新的场景
		toSubmitScene() {
			console.log(this.newSceneName)
			console.log(this.allNodes)
		}
	}
}
</script>

<style lang="scss">
.regStep4 {
	.search-tip {
		margin-top: 0px;
		.el-input {
			width: 530px;
			margin-left: 50px;
		}
		.el-button {
			margin-left: 80px;
			padding-left: 20px;
			padding-right: 20px;
		}
	}
	.group-tip {
		height: 258px;
		overflow-y: scroll;
		overflow-x: hidden;
		padding-top: -10px;
		margin-left: 15px;
		.el-col {
			margin-bottom: 20px;
		}
		span {
			line-height: 3.5;
			font-weight: bold;
		}
		.picture-tip {
			width: 80px; 
			height: 80px; 
			margin: 0 auto; 
			-webkit-border-radius: 50px; 
			-moz-border-radius: 50px; 
			-o-border-radius: 50px; 
			border-radius: 50px; 
			float: left;
			margin-right: 8px;
			background: #000;
		}
		.description-tip {
			height: 32px;
			width: 135px;
			float: right;
			margin-right: 5px;
			margin-top: 45px;
			color: rgb(141, 140, 140);
			font-size: 13px;
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
	}
}
</style>
<style>
/* 修改分页按钮的背景色 */
.regStep4 .el-pagination button {
	background-color: rgb(242,242,242);
}
.regStep4 .el-dialog, .el-pager li {
	background-color: rgb(242,242,242);
}
.regStep4 .el-tree__empty-block {
	height: 430px;
}
.regStep4 .el-tree {
	height: 430px;
}
.regStep4 .transfer-main,.transfer-title {
	border: 1px #e8e8e8 solid;
}
.regStep4 .transfer-left {
	margin-left: 15px;
}
.regStep4 .transfer-right {
	margin-right: 15px;
}
</style>

