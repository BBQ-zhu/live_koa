<template>
	<view>
		<view style="background-color: #FFFFFF">
			<uni-collapse>
				<view class="red_border"></view>
				<uni-collapse-item title="查询条件" thumb="true">
					<view class="content">
						<view class="listDetail">
							<label>开始时间：</label>
							<view style="width:70%;height:30px;line-height: 30px; border-bottom: 1px dashed #F1F1F1;">
								<e-picker @change="changeStart">{{start_time||'请输入开始时间'}}</e-picker>
							</view>
						</view>
						<view class="listDetail">
							<label>结束时间：</label>
							<view style="width:70%;height:30px;line-height: 30px; border-bottom: 1px dashed #F1F1F1;">
								<e-picker @change="changeEnd">{{end_time||'请输入结束时间'}}</e-picker>
							</view>
						</view>
						<view class="listDetail">
							<label>公司名称：</label>
							<input v-model="company_name" class="uni-input" placeholder="请输入公司名称" />
						</view>
						<view class="listDetail" style="margin-bottom: 10px;">
							<label>活动地点：</label>
							<input v-model="active_place" class="uni-input" placeholder="请输入活动地点" />
						</view>
					</view>
				</uni-collapse-item>
			</uni-collapse>
			<view style="border-top: 1px solid #333;">
				<button @click="findTasks()" style="margin-top:10px;margin-left:31%" size="mini" class="newBgColor blackColor">
					查询
				</button>
				<button @click="downLoadTasks()" style="margin-top:10px;margin-left:10px" size="mini" class="newBgColor blackColor">
					下载
				</button>
			</view>
			<view style="display: flex;width:95%;margin:10px auto;margin-bottom: 10px;">
				<view style="width: 70px;height:25px;text-align: center; border-bottom:1px solid #d81e06;">
					查询结果
				</view>
			</view>
			<navList :navListInfo="allTaskList"> </navList>
		</view>
		<wyb-modal ref="modal" title="提示" :content="cancelText" cancel-text="取消" confirm-text="确定" @cancel="onConCancel"
		 @confirm="onConfirm" />
	</view>
</template>

<script>
	import navList from '@/components/nav-list/nav-list'
	import wybModal from '@/components/wyb-modal/wyb-modal.vue'
	import LbPicker from '@/components/lb-picker'
	import gUpload from "@/components/g-upload/g-upload.vue"
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	export default {
		components: {
			uniCollapse,
			uniCollapseItem,
			gUpload,
			LbPicker,
			wybModal,
			navList
		},
		data() {
			return {
				cancelText: '',
				contValue: 0,
				listDetail: {},
				limit: 10,
				offset: 0,
				allTaskList: [], //所有任务
				start_time: '',
				end_time: '',
				company_name: '',
				active_place: '',
				allTaskList2: [],
				deviesList:[],
				uniId:false
			}
		},
		onLoad() {
			this.limit = 10
			this.offset = 0
			this.allTaskList = [] //所有任务
			this.allTask()
			this.findAllDevices() //查询所有设备
			
			var login = uni.getStorageSync('uniId')
			if(this.$superBoss.username == login.username && this.$superBoss.password == login.password){
				this.uniId = true
			}else{
				this.uniId = false
			}
		},
		methods: {
			downLoadTasks() { //下载
			if(!this.uniId){
				uni.showToast({ title: "暂无权限。。。", icon: "none", duration: 2000 }); //弹出框
				return
			}
				let arr = {
					statistics: "2", //是否是统计界面(0:首页分页查询,1:统计页多条件查询,2:下载excel)
					limit: this.limit,
					offset: this.limit * this.offset,
					startTime: this.start_time,
					endTime: this.end_time,
					company_name: this.company_name,
					active_place: this.active_place
				};
				this.$myAjax('/allTask', arr, ).then(res => {
					console.log(res)
					if (res.code == 200) {
						this.allTaskList2 = res.data
						this.refactor();
					}
				})
			},
			refactor() {
				
				if(this.start_time && this.end_time){
					var tableName = (this.company_name || '统计数据') + '(' + this.start_time + '~' + this.end_time + ')'
				}else{
					var tableName = (this.company_name || '统计数据')
				}
				var tableData = []; //数据初始化
				var headerName = "名称,时间,地点,"; //拼接表头名称初始化 active_all_price
				var jsonList = {
					company_name: "",
					active_time: "",
					active_place: ""
				};
				this.deviesList.forEach(item => {
					//遍历所有一级设备添加输出字段
					headerName = headerName + item.device_name + ",";
					jsonList["deviceId_" + item.id] = "";
				});
				headerName = headerName + "合计(元)\n";
				jsonList.active_all_price = 0;
				var activeAllPrice = 0
				for (let item of this.allTaskList2) {
					var dataJson = JSON.parse(JSON.stringify(jsonList));
					dataJson.company_name = item.company_name;
					dataJson.active_time = item.active_time;
					dataJson.active_place = item.active_place;
					dataJson.active_all_price = item.active_all_price;
					activeAllPrice += item.active_all_price;
					if (item.task_medium_tables.length) {
						for (var val of item.task_medium_tables) {
							if (
								val.device_two_name &&
								val.device_one_name.indexOf("桁架") != -1
							) {
								let allValue = 0;
								let allMini = "";
								for (let value of val.device_two_name) {
									allValue +=
										parseFloat(value.device_name) * value.devices_two_num;
									allMini +=
										 value.device_name + "x" + value.devices_two_num + "、" ;
								}
								dataJson["deviceId_" + val.devices_one_id] =
									"共" + allValue + "米" +'('+allMini+')' ;
							} else if (
								val.device_two_name &&
								val.device_one_name.indexOf("舞台") != -1
							) {
								let allValue = 0;
								let allMini = "";
								for (let value of val.device_two_name) {
									if (parseFloat(value.device_name) == 0.6) {
										//0.6米的小板子特殊处理
										allValue +=
											parseFloat(value.device_name) *
											parseFloat(value.device_name) *
											0.5 *
											value.devices_two_num;
									} else {
										allValue +=
											parseFloat(value.device_name) *
											parseFloat(value.device_name) *
											value.devices_two_num;
									}
									allMini +=
										 value.device_name + "x" + value.devices_two_num+'、' ;
								}
								dataJson["deviceId_" + val.devices_one_id] =
									"共" + allValue + "平方" +'('+allMini+')';
							} else {
								let allValue = "";
								for (let value of val.device_two_name) {
									allValue +=
										 value.device_name + "x" + value.devices_two_num+'、' ;
								}
								dataJson["deviceId_" + val.devices_one_id] = allValue;
							}
						}
					}
					// console.log(dataJson);
					
					tableData.push(dataJson);
				}
				console.log(tableData);
				var dataJson2 = JSON.parse(JSON.stringify(jsonList));
				dataJson2.company_name = '总计'
				dataJson2.active_all_price = activeAllPrice
				tableData.push(dataJson2);
				this.downLoadExcel(tableData, headerName, tableName)
			},
			downLoadExcel(tableData, headerName, tableName) {
				// var str = "ID,年纪,姓名\n"; headerName
				for (let i = 0; i < tableData.length; i++) {
					for (let item in tableData[i]) {
						headerName += `${tableData[i][item] + "\t,"}`;
					}
					headerName = headerName + "\n";
				}
				if ("download" in document.createElement("a")) {
					// 非IE下载
					var blob = new Blob([headerName], {
						//解决中文乱码问题
						type: "text/plain;charset=utf-8"
					});
					blob = new Blob([String.fromCharCode(0xfeff), blob], {
						type: blob.type
					});
					var object_url = window.URL.createObjectURL(blob);
					var link = document.createElement("a");
					link.href = object_url;
					link.download = tableName + ".xls";
					document.body.appendChild(link);
					link.click();
					URL.revokeObjectURL(link.href); // 释放URL 对象
					document.body.removeChild(link);
				} else {
					// IE10+下载
					let blob = new Blob([headerName], {
						//解决中文乱码问题
						type: "text/plain;charset=utf-8"
					});
					blob = new Blob([String.fromCharCode(0xfeff), blob], {
						type: blob.type
					});
					const fileName = tableName + ".xls";
					navigator.msSaveBlob(blob, fileName);
				}
			},
			findAllDevices(){
				this.$myAjax('/devices', {}, ).then(res => {
					if (res.code == 200) {
						this.deviesList = res.data
					}
				})
			},
			findTasks() { //按条件查询
				this.limit = 10
				this.offset = 0
				this.allTaskList = [] //所有任务
				this.allTask()
			},
			onReachBottom() {
				// 触底的时候请求数据，即为上拉加载更多
				this.allTask()
			},
			//查询所有任务 分页
			allTask() {
				let arr = {
					statistics: "1", //是否是统计界面(0:首页分页查询,1:统计页多条件查询,2:下载excel)
					limit: this.limit,
					offset: this.limit * this.offset,
					startTime: this.start_time,
					endTime: this.end_time,
					company_name: this.company_name,
					active_place: this.active_place
				};
				this.$myAjax('/allTask', arr, ).then(res => {
					console.log(res)
					if (res.code == 200) {
						this.allTaskList = this.allTaskList.concat(res.data)
						this.offset += 1;
						console.log(this.offset)
					}
				})
			},
			onConCancel() { //取消
				this.$refs.modal.hideModal()
			},
			onConfirm() { //确认
			},
			//时间控件
			changeStart(e) {
				this.start_time = e
			},
			changeEnd(e) {
				this.end_time = e
			},
		}
	}
</script>

<style scoped>
	.nav-list {
		width: 100%;
		height: 40px;
		position: fixed;
		bottom: 0px;
		background-color: #333333;
		/* background-color:rgb(255, 162, 0); */
	}
	.nav-bottom {
		width: 100%;
		position: flex;
		align-items: center;
		justify-content: space-between;
	}
	.nav_text {
		width: 40px;
		height: 40px;
		line-height: 40px;
		color: #F1F1F1;
		float: left;
		margin-left: 2px;
		text-align: center;
		/* border-radius: 10px; */
		/* background-color: #007AFF; */
	}
	.nav-input {
		float: left;
		width: 70%;
		font-size: 20px;
		margin-top: 6px;
		margin-left: 4px;
		/* border:none; */
		color: rgb(255, 162, 0);
		/* color:#d81e06; */
	}
	.save {
		width: 100px;
		height: 40px;
		line-height: 38px;
		text-align: center;
	}
	.content {
		width: 98%;
		margin: 0 auto;
		margin: 10px 0 0 20px;
	}
	.listDetail {
		display: flex;
		justify-content: left;
		align-items: center;
		width: 100%;
	}
	.listDetail>label {
		font-weight: 600;
	}
	.uni-input {
		width: 70%
	}
</style>
