<template>
	<el-container>
		<div class="controlPanel-sidebar" width="220px">
			<el-menu class="el-menu-vertical-demo" 
				router
				:default-active="$route.path"
				@open="handleOpen" 
				@close="handleClose" 
				:collapse="isCollapse"
				background-color="rgb(32,34,42)"
				text-color="rgba(255, 255, 255, 0.8)"
				active-text-color="#fff"
				:unique-opened="true">
				<div class="Title1" v-if="!isCollapse"><span>控制台</span></div>
				<div class="Title2" v-if="isCollapse" style="width:60px;">A</div>

				<el-submenu index="1">
					<template slot="title">
						<i class="el-icon-data-board"></i>
						<span slot="title">工作台</span>
					</template>
					<el-menu-item index="/controlpanel/workpanel"><div class="barstyle"></div>通知公告</el-menu-item>
				</el-submenu>

				<el-submenu index="2">
					<template slot="title">
						<i class="el-icon-menu"></i>
						<span slot="title">事务管理</span>
					</template>
					<el-menu-item index="2-1"><div class="barstyle"></div>待办事务</el-menu-item>
					<el-menu-item index="2-2"><div class="barstyle"></div>办结事务</el-menu-item>
				</el-submenu>

				<el-submenu index="3">
					<template slot="title">
						<i class="el-icon-view"></i>
						<span slot="title">系统监控</span>
					</template>
					<el-menu-item index="/controlpanel/systemmonitor/interfacedoc"><div class="barstyle"></div>接口文档</el-menu-item>
					<el-submenu index="3-2">
						<span slot="title">日志管理</span>
						<el-menu-item index="3-2-1"><div class="barstyle" style="margin-left:-60px"></div>通用日志</el-menu-item>
						<el-menu-item index="3-2-2"><div class="barstyle" style="margin-left:-60px"></div>接口日志</el-menu-item>
						<el-menu-item index="3-2-3"><div class="barstyle" style="margin-left:-60px"></div>错误日志</el-menu-item>
					</el-submenu>
				</el-submenu>

				<el-submenu index="4">
					<template slot="title">
						<i class="el-icon-connection"></i>
						<span slot="title">业务资源管理</span>
					</template>
					<el-menu-item index="/controlpanel/businessresource/app"><div class="barstyle"></div>应用管理</el-menu-item>
					<el-menu-item index="/controlpanel/businessresource/form"><div class="barstyle"></div>表单模型</el-menu-item>
					<el-submenu index="4-3">
						<span slot="title">流程管理</span>
						<el-menu-item index="/controlpanel/businessresource/flow/model"><div class="barstyle" style="margin-left:-60px"></div>流程模型</el-menu-item>
						<el-menu-item index="/controlpanel/businessresource/flow/instance"><div class="barstyle" style="margin-left:-60px"></div>流程实例</el-menu-item>
						<el-menu-item index="/controlpanel/businessresource/flow/monitor"><div class="barstyle" style="margin-left:-60px"></div>流程监控</el-menu-item>
						<el-menu-item index="/controlpanel/businessresource/flow/monitor2"><div class="barstyle" style="margin-left:-60px"></div>流程监控2</el-menu-item>
					</el-submenu>
					<!-- <el-menu-item index="4-4"><div class="barstyle"></div>列表管理</el-menu-item> -->
					<el-menu-item index="/controlpanel/businessresource/business_role"><div class="barstyle"></div>业务角色管理</el-menu-item>
				</el-submenu>

				<!-- <el-submenu index="5">
					<template slot="title">
						<i class="el-icon-data-analysis"></i>
						<span slot="title">平台管理</span>
					</template>
					<el-menu-item index="5-1"><div class="barstyle"></div>平台角色管理</el-menu-item>
					<el-menu-item index="5-2"><div class="barstyle"></div>平台用户管理</el-menu-item>
					<el-menu-item index="5-3"><div class="barstyle"></div>平台菜单管理</el-menu-item>
				</el-submenu> -->

				<el-submenu index="5">
					<template slot="title">
						<i class="el-icon-setting"></i>
						<span slot="title">系统管理</span>
					</template>
					<el-menu-item index="/controlpanel/system/user"><div class="barstyle"></div>用户管理</el-menu-item>
					<el-menu-item index="/controlpanel/system/organization"><div class="barstyle"></div>组织机构</el-menu-item>
					<el-menu-item index="/controlpanel/system/scene"><div class="barstyle"></div>场景管理</el-menu-item>
					<el-menu-item index="/controlpanel/system/platform_role"><div class="barstyle"></div>平台角色管理</el-menu-item>
					<el-menu-item index="/controlpanel/system/dictionary"><div class="barstyle"></div>字典管理</el-menu-item>
					<el-menu-item index="/controlpanel/system/menu"><div class="barstyle"></div>菜单管理</el-menu-item>
				</el-submenu>
			</el-menu>
		</div>
		<el-container class="controlPanel-mainbar" >
			<el-header height="55px"> 
				<i class="el-icon-s-fold" @click="CollapseTrue()" id="CollapseTrueIcon"></i>
				<i class="el-icon-s-unfold" @click="CollapseFalse()" id="CollapseFalseIcon"></i>
				<el-input
					placeholder="请输入搜索内容"
					v-model="input"
					size="small">
					<el-button slot="append" icon="el-icon-search"></el-button>
				</el-input>
				<div class="userinfo">
					
					<el-dropdown :hide-on-click="false">
						<div class="el-dropdown-link">
							admin<i class="el-icon-arrow-down el-icon--right"></i>
						</div>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>首页</el-dropdown-item>
							<el-dropdown-item>个人信息</el-dropdown-item>
							<el-dropdown-item>github</el-dropdown-item>
							<el-dropdown-item divided @click.native="goBack()">退出控制台</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<div class="avater"></div>
				</div>
			</el-header>
			<el-main>
				<transition>
					<el-scrollbar style="height:100%">
						<keep-alive>
							<router-view></router-view>
						</keep-alive>
					</el-scrollbar>
				</transition>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
export default {
	name: 'topbar',
	data() {
		return {
			isCollapse: false,
			input: ''
		};
	},
	methods: {
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		},
		//收起
		CollapseTrue() {
			this.isCollapse = true;
			var show1 = document.getElementById("CollapseTrueIcon");
			var show2 = document.getElementById("CollapseFalseIcon");
			show2.style.display = "block";
			show1.style.display = "none";
		},
		//展开
		CollapseFalse() {
			this.isCollapse = false;
			var show1 = document.getElementById("CollapseTrueIcon");
			var show2 = document.getElementById("CollapseFalseIcon");
			show1.style.display = "block";
			show2.style.display = "none";
		},
		//退出控制台
		goBack() {
			this.$router.push({
                path: '/adminhome'
            })
		}
	}
}
</script>

<style lang="scss" scoped>
.controlPanel-sidebar {
	height: 100vh;
	.Title1 {
		background:rgb(32,34,42);
		// width:220px;
		height:55px;
		border-bottom: 1.5px rgb(6,7,8) solid;
		span {
			display: block;
			text-align: center;
			font-weight: 300;
			font-size: 18px;
			color: white;
			font-family: 'YouYuan';
			padding-top: 15px;
		}
	}
	.Title2 {
		background:rgb(32,34,42);
		// width:220px;
		height:55px;
		border-bottom: 1.5px rgb(6,7,8) solid;
		display: block;
		text-align: center;
		font-size: 18px;
		font-weight: bold;
		color: #fff;
		padding-top:15px;
	}
	.el-menu-vertical-demo {
		// width: 220px;
		// min-height: 100%;
		height: 100%;
		.barstyle {
			width: 4px;
			background: #409EFF;
			height: 50px;
			float: left;
			margin-left: -40px;
			display: none;
		}
		.el-menu-item:hover {
			background: rgb(6,7,8) !important;
			color: #fff !important;
			i {
				color: #fff !important;
			}
			.barstyle {
                display: block;
            }
		}
		.el-menu-item.is-active {
			background: rgb(6,7,8) !important;
			.barstyle {
                display: block;
            }
		}
	}
	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 240px;
	}
}
.controlPanel-mainbar {
	padding: 0px;
	margin: 0px;
	height: 100vh;
	background: rgb(242,242,242);
	.el-header {
		background: white !important;
		.el-icon-s-fold {
			font-size: 28px;
			color: rgb(144,147,153);
			padding-top: 13px;
			display: block;
			width: 20px;
			float: left;
		}
		.el-icon-s-unfold {
			font-size: 28px;
			color: rgb(144,147,153);
			padding-top: 13px;
			display: none;
			width: 20px;
			float: left;
		}
		.el-input {
			width:250px;
			padding-left: 30px;
			padding-top: 12px;
			.el-button {
				padding-left: 13px;
				padding-right: 6px;
			}
		}
		.userinfo {
			float: right;
			.avater {
				width: 35px;
				height: 35px;
				background: rgb(56,161,242);
				-moz-border-radius: 50px;
				-webkit-border-radius: 50px;
				border-radius: 50px;
				margin-top: 10px;
				float: right;
				margin-right: 15px;
			}
			.el-dropdown {
				float: right;
				.el-dropdown-link {
					color: black !important;
					// float: right;
					margin-right: 5px;
					margin-top: 18px;
				}

			}
		}
	}
	.el-main {
		padding: 5px;
	}
}
</style>
<style src="@/styles/el-submenu.css">
/* @import '@/styles/el-submenu.css' */
/* .controlPanel-sidebar .el-submenu i,span{
	color: rgba(255, 255, 255, 0.8) !important;
}
.controlPanel-sidebar .el-submenu i:hover,span:hover{
	color: #fff !important;
	background: rgb(6,7,8) !important;
}
.controlPanel-sidebar .el-submenu .el-submenu__title:hover{
	color: #fff !important;
	background: rgb(6,7,8) !important;

}
.controlPanel-sidebar .el-submenu .el-submenu__title.is-active {
	background: rgb(6,7,8) !important;
} */
</style>
