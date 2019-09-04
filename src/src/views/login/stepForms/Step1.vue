<template>
	<div class="regStep1">
		<el-form
			ref="registerForm"
			:model="registerForm"
			:rules="rules"
			class="register-form"
			auto-complete="on"
			label-position="right"
			label-width="100px"
			size="small"
			@change="changeForm">
			<!-- 用户类型 -->
			<el-form-item prop="usertype" label="用户类型 :">
				<el-select v-model="registerForm.usertype" placeholder="请选择身份" style="width:300px">
					<el-option label="管理员" value="1"></el-option>
					<el-option label="普通用户" value="2"></el-option>
				</el-select>
			</el-form-item>
			<!-- 用户账号 -->
			<el-form-item prop="useraccount" label='用户账号 :' style="width:600px">
				<el-input
					ref="useraccount"
					v-model="registerForm.useraccount"
					placeholder="用户账号"
					name="useraccount"
					type="text"
					tabindex="1"
					auto-complete="off">
				</el-input>
			</el-form-item>
			<!-- 真实姓名 -->
			<el-form-item prop="realname" label='真实姓名 :' style="width:600px">
				<el-input
					ref="realname"
					v-model="registerForm.realname"
					placeholder="真实姓名"
					name="realname"
					type="text"
					tabindex="1"
					auto-complete="off">
				</el-input>
			</el-form-item>
			<!-- 密码 -->
			<el-form-item prop="password" label="密码 :" style="width:600px">
				<el-input
					ref="password"
					v-model="registerForm.password"
					placeholder="密码"
					name="password"
					/>
			</el-form-item>
			<el-form-item prop="passwordagain" label="密码确认 :" style="width:600px">
				<el-input
					ref="passwordagain"
					v-model="registerForm.passwordagain"
					placeholder="密码确认"
					name="passwordagain"
				/>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	name: 'Step1',
    data() {
		var checkPass = (rule, value, callback) => {
            if(!value){
                return callback(new Error('请确认密码'));
			}
			if(value!=this.registerForm.password){
				return callback(new Error('两次输入密码不一致'));
			}
            callback();
        };
        return {
            registerForm: {
				usertype:'',
				useraccount: '',
				realname:'',
				password: '',
				passwordagain: '',
			},
			rules: {
				useraccount: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
				realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				passwordagain: [{ required: true, validator: checkPass, trigger: 'blur' }],
			}
        }
	},
	methods: {
		changeForm(e) {
			this.$emit('changeForm', e.currentTarget)
			console.log(e)
		}
	}
}
</script>

<style lang="scss">
.regStep1 {
	.el-form {
		margin-left: 70px;
		margin-top: 60px;
	}
}
</style>


