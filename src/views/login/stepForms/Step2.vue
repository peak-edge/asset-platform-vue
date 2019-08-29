<template>
	<div class="regStep2">
		<el-form
			ref="registerForm"
			:model="registerForm2"
			class="register-form"
			auto-complete="on"
			label-position="right"
			label-width="100px"
			size="small">
			<!-- 手机号码 -->
			<el-form-item prop="tel" label='手机号码 :'>
				<el-input
					ref="tel"
					v-model="registerForm2.tel"
					placeholder="手机号码"
					name="tel"
					type="text"
					style="width:500px"
				/>
			</el-form-item>
			<!-- 性别 -->
			<el-form-item label="性别 :">
				<el-radio-group v-model="registerForm2.sex">
					<el-radio label="男"></el-radio>
					<el-radio label="女"></el-radio>
				</el-radio-group>
			</el-form-item>
			<!-- 出生日期
			<el-form-item label="出生日期 :">
				<el-date-picker 
					type="date" 
					placeholder="选择日期" 
					v-model="registerForm2.date" 
					style="width: 100%;">
				</el-date-picker>
			</el-form-item> -->
			<!-- 邮箱 -->
			<el-form-item prop="mail" label='邮箱 :'>
				<el-input
					ref="mail"
					v-model="registerForm2.mail"
					placeholder="邮箱"
					name="mail"
					type="text"
					style="width:500px"
				/>
			</el-form-item>
			<!-- 证件类型 -->
			<el-form-item prop="cardtype" label="证件类型 :">
				<el-select v-model="registerForm2.cardtype" placeholder="请选择证件类型" style="width:300px">
					<el-option label="身份证" value="1"></el-option>
					<el-option label="护照" value="2"></el-option>
				</el-select>
			</el-form-item>
			<!-- 居住地址 -->
			<el-form-item prop="addr" label='证件号码 :'>
				<el-input
					ref="addr"
					v-model="registerForm2.addr"
					placeholder="证件号码"
					name="addr"
					style="width:500px"
				/>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	name: 'Step2',
	data() {
		return {
			registerForm2: {
				tel:'',
                sex:'',
                mail:'',
                cardtype:'',
                addr:'',
            },
		}
	}
}
</script>

<style lang="scss">
.regStep2 {
	.el-form {
		margin-left: 70px;
		margin-top: 60px;
	}
}
</style>
