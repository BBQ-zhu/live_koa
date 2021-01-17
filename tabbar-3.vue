<template>
	<view class="content" :class="{'active':active}">
		<view class="text" style="top:18%;left:48%">世</view>
		<view class="text" style="top:29%;left:38%">纪</view>
		<view class="text" style="top:40%;left:48%">鼎</view>
		<view class="text" style="top:51%;left:38%">尚</view>
		<view class="tabbar-box-wrap">
			<view class="tabbar-box">
				<view class="tabbar-box-item" @click="goToPage('/pages/tabbar-3-detial/tabbar-3-release/tabbar-3-release')">
					<image class="box-image" src="../../../static/img/release.png" mode="aspectFit"></image>
					<text class="explain">发布订单</text>
				</view>
				<view class="tabbar-box-item" @click="gotoTitle()">
					<image class="box-image" src="../../../static/img/video.png" mode="aspectFit"></image>
					<text class="explain">发布公告</text>
				</view>
				<view class="tabbar-box-item" @click="gotoTitle()">
					<image class="box-image" src="../../../static/img/qa.png" mode="aspectFit"></image>
					<text class="explain">学习资料</text>
				</view>
			</view>
		</view>
	</view>
</template> 

<script>
export default {
	data() {
		return {
			active: false,
			uniId:false
		};
	},
	onLoad() {
		var login = uni.getStorageSync('uniId')
		if(this.$superBoss.username == login.username && this.$superBoss.password == login.password){
			this.uniId = true
		}else{
			this.uniId = false
		}
	},
	onShow() {
		// setTimeout(() => {
		this.active = true;
		// }, 500);
	},
	onHide() {
		this.active = false;
	},
	methods: {
		gotoTitle(){
			uni.showToast({ title: "开发中。。。", icon: "none", duration: 2000 }); //弹出框
		},
		goToPage(url) {
			if(!this.uniId){
				uni.showToast({ title: "暂无权限。。。", icon: "none", duration: 2000 }); //弹出框
				return
			}
			var arr = {
				active_all_price: 0,
				active_place: '活动地点',
				active_time: '2021-01-01',
				company_name: '公司名称',
				remarks: ''
			}
			this.$myAjax('/createTask', arr, ).then(res => {
				console.log(res)
				if(res.code == 200){
				uni.navigateTo({
				    url: '/pages/detail/detail?data=' + encodeURIComponent(JSON.stringify(res.data))
				});
				}
			})

		}
	}
};
</script>

<style lang="scss" scoped>
.titleFont{
	font-size:50px;
	color: #fff;
	font-weight: 600;
	// font-family:"Trebuchet MS", Arial, Helvetica, sans-serif;
	text-shadow: #ff00de 1px 1px, #2addfd 1px 1px;
}
.titleRed{
	font-size:12px;
	color: #d81e06;
}
.text{
	position: absolute;
	display: block;
	// writing-mode:vertical-rl;  //垂直方向，从右向左
    background-image: -webkit-linear-gradient(left,#2addfd,#66ffff 10%,#cc00ff 20%,#ff00de 30%, #CCCCFF 40%, #00FFFF 50%,#CCCCFF 60%,#CC00CC 70%,#CC00FF 80%,#66FFFF 90%,#2addfd 100%);
    -webkit-text-fill-color: transparent;/* 将字体设置成透明色 */
    -webkit-background-clip: text;/* 裁剪背景图，使文字作为裁剪区域向外裁剪 */
    -webkit-background-size: 200% 100%; 
    -webkit-animation: masked-animation 4s linear infinite;
	font-size: 50px;
	font-weight: 800;
	box-shadow: #ff00de -2px 1px, #2addfd 2px -1px;
}
@keyframes masked-animation {
    0% {
        background-position: 0  0;
    }
    100% {
        background-position: -100%  0;
    }
}
.content {
	background: #333;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	/* #ifdef H5 */
	height: calc(100vh - var(--window-bottom) - var(--window-top));
	/* #endif */
	/* #ifndef H5 */
	height: 100vh;
	/* #endif */
	transition: opacity 0.3s;
	// background: #999;
	opacity: 0;
	&.active {
		opacity: 1;
	}
	.logo {
		position: relative;
		margin-top: -400upx;
		width: 200upx;
		height: 200upx;
		// z-index: -1;
		opacity: 0;
		transition: opacity 0.3s;
		&.active {
			opacity: 1;
		}
	}
}
.tabbar-box-wrap {
	position: absolute;
	width: 100%;
	padding: 50upx;
	box-sizing: border-box;
	bottom: 0;
	left: 0;
	.tabbar-box {
		position: relative;
		display: flex;
		width: 100%;
		background: #fff;
		border-radius: 20upx;
		padding: 15upx 20upx;
		box-sizing: border-box;
		z-index: 2;
		box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.1);
		&:after {
			content: '';
			position: absolute;
			bottom: -16upx;
			left: 0;
			right: 0;
			margin: auto;
			width: 50upx;
			height: 50upx;
			transform: rotate(45deg);
			background: #fff;
			z-index: 1;
			box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.1);
			border-radius: 2px;
		}
		&:before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: #ffffff;
			border-radius: 20upx;
			z-index: 2;
		}
		.tabbar-box-item {
			// position: relative;
			width: 100%;
			z-index: 3;
			margin: 10upx;
			color: $uni-color-subtitle;
			text-align: center;
			font-size: $uni-font-size-base;
			.box-image {
				width: 100%;
				height: $uni-img-size-lg;
			}
		}
	}
}
</style>
