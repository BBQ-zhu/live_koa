<template>
	<view class="content">


		<form >
			<view>
				<view class="title">登录</view>
				<view class="inputRow">
					<label>账号：</label>
					<input v-model="username" class="uni-input" focus placeholder="请输入账号"  />
				</view>
				<view class="inputRow">
					<label class="">密码：</label>
					<input v-model="password" class="uni-input" password type="text" placeholder="请输入密码" />
				</view>
				<view class="inputRow" >
					<button type="primary" @click="loginBtn()" style="background: #333;width: 30%;margin-top: 20px;">登录</button>
				</view>
			</view>
		</form>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				username:'',
				password:''
			};
		},
		onLoad() {
			

		},
		methods: {
			loginBtn() {
				var _this = this
				var arr = {
					username:_this.username,
					password:_this.password
				}
				console.log(arr)
				uni.setStorageSync('uniId', arr)
				uni.showModal({
					content: '登录成功！',
					showCancel: false
				})
				setTimeout(()=>{
					uni.reLaunch({
						url: '../tabbar/tabbar-5/tabbar-5',
					});
				},2000)
			},
		}
	};
</script>

<style>
	.content {
		/* background:#C0C0C0 */
		font-size: 18px;
		line-height: 18px;
	}

	.title {
		font-size: 30px;
		text-align: center;
		line-height: 100px;

	}

	.inputRow {
		line-height: 40px;
		margin-top: 20px;
		display: flex;
		justify-content: center;
	}

	.uni-input {
		width: 50%;
		height: 40px;
		/* border-radius: 5px; */
		padding-left: 4px;
		border-bottom: 1px solid #333;
	}

	.uni-input-placeholder {
		left: 4px
	}
</style>
