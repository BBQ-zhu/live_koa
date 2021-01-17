<template>
	<view>
		<swiper class="screen-swiper round-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
		 duration="500">
			<swiper-item v-for="(item,index) in 4" :key="index">
				<image :src="'https://ossweb-img.qq.com/images/lol/web201310/skin/big3900'+index+ '.jpg'" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="VerticalBox">
			<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop" style="height:calc(100vh - 375upx)">
				<view class="cu-item" :class="(item.id) == tabCur?'text-green cur':''" v-for="(item,index) in list" :key="item.id" @tap="TabSelect"
				 :data-id="item.id">
					{{item.device_name}}
				</view>
				<view class="cu-item" v-if="uniId">
					<button @click="createdev(1,null)" style="margin-top:10px;margin-right:5px;" size="mini" class=" newBgColor blackColor">
						增加
					</button>
				</view>
			</scroll-view>
			<scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height:calc(100vh - 375upx)"
			 :scroll-into-view="'main-'+mainCur" @scroll="VerticalMain">
				<view  class="padding-top padding-lr" v-for="(item,index) in list" :key="item.id" :id="'main-'+item.id">
					<view class="cu-bar solid-bottom bg-white">
						<view class="action">
							<text class="cuIcon-title text-green"></text> {{item.device_name}}
							
						</view>
						<view class="action" v-if="uniId">
							<view class="Devies" @click="delatedev(1,item)"> - </view>
							<view class="ml10 Devies" @click="createdev(2,item)"> + </view>
						</view>
					</view>
					<view class="cu-list menu-avatar" >
						<view class="cu-item " @click="uniId && delatedev(2,val)" v-for="(val,ind) in item.devices_twos" :key="val.id" >
							<view class="cu-avatar round lg" :style="MathRandomImg(ind)"></view>
							<view class="content">
								<view><text class="text-cut">{{val.device_name}}</text></view>
								<view class="text-gray text-sm flex"> <text class="text-cut">{{val.updatedAt.split('T')[0]}}</text></view>
							</view>
							<view class="action">
								<view class="text-grey text-xs" v-if="uniId">￥:{{val.device_price}}</view>
								<view class="cu-tag round bg-red sm">{{val.devices_number}}</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	
	<!-- 弹出框 -->
	<chunLei-modal 
		:type="modalType" 
		v-model="modalValue" 
		:mData="inputData" 
		@onConfirm="onConfirm" 
		@cancel="cancel" navMask>
	</chunLei-modal>
	
	</view>
</template>

<script>
	import chunLeiModal from '@/components/chunLei-modal/chunLei-modal.vue'
	import TabMask from '@/components/chunLei-modal/tabMask'
	export default {
		components: {
			chunLeiModal,
			TabMask
		},
		data() {
			return {
				CorD:'',
				lev:0,
				devId:0,
				inputData:{}, //弹框值
				modalValue:false, //是否显示弹框
				modalType:'input', //弹窗类型 默认（default）， 单选（select），广告（advert），分享（share），输入框（input），插槽（custom），通知（notify），多选（multiSelect）
				imgList: [
					'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg',
					'https://ossweb-img.qq.com/images/lol/img/champion/Taric.png',
					'https://ossweb-img.qq.com/images/lol/web201310/skin/big81007.jpg',
					'https://ossweb-img.qq.com/images/lol/web201310/skin/big81020.jpg',
					'https://ossweb-img.qq.com/images/lol/img/champion/Morgana.png',
				],
				list: [],
				tabCur: 0,
				mainCur: 0,
				verticalNavTop: 0,
				load: true,
				uniId:false
			};
		},
		onLoad() {
			this.findAllDevices()
			//弹出框组件初始化
			this.tabMask = new TabMask({opacity:0.6})
			this.tabMask.show(300)
			this.tabMask.hide()
			var login = uni.getStorageSync('uniId')
			if(this.$superBoss.username == login.username && this.$superBoss.password == login.password){
				this.uniId = true
			}else{
				this.uniId = false
			}
		},
		onReady() {
			uni.hideLoading()
		},
		methods: {
			delatedev(lev,val){ //删除设备
				this.CorD = 'delate'
				this.modalValue = true
				this.modalType = 'default'
				this.lev = lev //保存弹窗级别
				this.devId = val.id //一级或二级设备id
				console.log(this.lev,this.devId,val)
				if(this.lev == 1){ //删除一级设备
					if(val.devices_twos.length>0){
						this.modalType = 'select'
						this.inputData = [
							{title:'该一级类目下存在二级类目，请先删除二级类目！',content:'',icon:''}
						]
					}else{
						this.inputData = {
							title:'提示',
							content:'确定删除该一级类目？',
							cancelText:'取消',confirmColor:'#d81e06'
						}
					}
				}else if(this.lev == 2){
					this.inputData = {
						title:'提示',
						content:'确定删除该二级类目？',
						cancelText:'取消',confirmColor:'#d81e06'
					}
				}
			},
			createdev(lev,val){  //创建设备
				this.CorD = 'create'
				this.modalValue = true
				this.modalType = 'input'
				this.lev = lev //保存弹窗级别
				this.devId = val ? val.id : null //一级设备id
				if(this.lev == 1){ //添加一级设备
					this.inputData = {
					  title:'一级类目',
					  content:[
					  {title:'名称:',content:'',type:'text',placeholder:'请输入一级类目名称'}
					  ]
					}
				}else if(this.lev == 2){
					this.inputData = {
					  title:'二级类目',
					  content:[
					  {title:'名称:',content:'',type:'text',placeholder:'请输入名称'},
					  {title:'价格:',content:'',type:'number',placeholder:'请输入价格'},
					  {title:'数量:',content:'',type:'number',placeholder:'请输入数量'}
					  ]
					}
				}
			},
			onConfirm(val){ //弹框确认
			console.log(this.devId)
			if(this.CorD == 'delate'){ //删除
				if(this.lev == 1){
					var arr = {
						lev:this.lev,
						id:this.devId
					}
				}else if(this.lev == 2){
					var arr = {
						lev:this.lev,
						id:this.devId
					}
				}
				console.log(arr)
				this.$myAjax('/delateDevices', arr, ).then(res => {
					if (res.code == 200) {
						this.findAllDevices()  //从新刷新列表
					}else if(res.code == 400){
						this.modalValue = true
						this.modalType = 'select'
						this.inputData = [
							{title:'有订单正在使用该设备，不可删除！',content:'',icon:''}
						]
					}
					console.log(res)
				})
			}else{ //新增
				if(this.lev == 1){
					var arr = {
						lev:this.lev,
						device_name: val[0].content,
					}
				}else if(this.lev ==2){
					var arr ={
						lev:this.lev,
						devices_id: this.devId, //一级设备id
						device_name: val[0].content,
						device_price: parseInt(val[1].content),
						devices_number: parseInt(val[2].content),
					}
				}
				this.$myAjax('/createdevices', arr, ).then(res => {
					if (res.code == 200) {
						this.findAllDevices()  //从新刷新列表
					}
					console.log(res)
				})
			}
			this.modalValue = false
			},
			cancel(){ //弹框取消
				this.modalValue = false
			},
			//添加设备
			createdevices(arr){
				
			},
			//随机数
			MathRandomImg(ind) {
				var num = ind%this.imgList.length
				var url = "background-image:url(" + this.imgList[num] + ")"
				return url
				// var num = Math.floor(Math.random() * 5) //0~3随机数
				// var url = "background-image:url(" + this.imgList[num] + ")"
				// return url
			},
			//获取所有设备
			findAllDevices() {
				this.$myAjax('/devices', {}, ).then(res => {
					if (res.code == 200) {
						this.list = res.data
					}
					console.log(res.data)
				})
			},
			TabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.mainCur = e.currentTarget.dataset.id;
				this.verticalNavTop = (parseInt(e.currentTarget.dataset.id)-1 ) * 50
				console.log(this.tabCur,this.mainCur,this.verticalNavTop)
			},
			VerticalMain(e) {
				// #ifdef MP-ALIPAY
				return false //支付宝小程序暂时不支持双向联动 
				// #endif
				let that = this;
				let tabHeight = 0;
				if (this.load) {
					for (let i = 0; i < this.list.length; i++) {
						let view = uni.createSelectorQuery().select("#main-" + this.list[i].id);
						console.log(view)
						view.fields({
							size: true
						}, (data) => {
							this.list[i].top = tabHeight;
							tabHeight = tabHeight + data.height;
							this.list[i].bottom = tabHeight;
						}).exec();
					}
					this.load = false
				}
				let scrollTop = e.detail.scrollTop + 10;
				for (let i = 0; i < this.list.length; i++) {
					if (scrollTop > this.list[i].top && scrollTop < this.list[i].bottom) {
						this.verticalNavTop = (this.list[i].id -1) * 50
						this.tabCur = this.list[i].id-1  //此处不减去1
						console.log(this.tabCur)
						return false
					}
				}
			}
		},
	}
</script>
