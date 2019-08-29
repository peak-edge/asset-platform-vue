<template>
	<div class="regStep3">
		<el-form
			ref="registerForm"
			:model="registerForm3"
			class="register-form"
			auto-complete="on"
			label-position="right"
			label-width="100px"
			size="small">
			<el-form-item prop="avater" label="用户头像 :">
				<br>
				<el-upload
					class="avatar-uploader"
					action="https://jsonplaceholder.typicode.com/posts/"
					width="400px"
					:limit="1"
                    :on-exceed="handleExceed"
					:on-success="handleAvatarSuccess"
					:before-upload="beforeAvatarUpload">
				<img v-if="imageUrl" :src="imageUrl" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	name: 'Step3',
	data() {
        return {
            registerForm3: {
                avater: ''
			},
			imageUrl: ''
        }
	},
	methods: {
		handleAvatarSuccess(res, file) {
				this.imageUrl = URL.createObjectURL(file.raw);
		},
		beforeAvatarUpload(file) {
			const isJPG = file.type === 'image/jpeg';
			const isLt2M = file.size / 1024 / 1024 < 2;
			if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG 格式!');
			}
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
			}
			return isJPG && isLt2M;
		},
		handleExceed(files, fileList) {
            this.$message.warning(`仅能上传一张图片`);
        },
	}
}
</script>

<style lang="scss">
.regStep3 {
	.el-form {
		margin-left: 80px;
		margin-top: 40px;
		.avatar-uploader .el-upload {
			border: 1px dashed #d9d9d9;
			border-radius: 6px;
			cursor: pointer;
			position: relative;
			overflow: hidden;
		}
		.avatar-uploader .el-upload:hover {
			border-color: #409EFF;
		}
		.avatar-uploader-icon {
			font-size: 28px;
			color: #8c939d;
			width: 178px;
			height: 178px;
			line-height: 178px;
			text-align: center;
		}
		.avatar {
			width: 178px;
			height: 178px;
			display: block;
		}
	}
}
</style>
<style>
.regStep3 .el-upload-list__item {
	width: 75%;
}
</style>

