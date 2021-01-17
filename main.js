import Vue from 'vue'
import App from './App'

// Vue.prototype.$baseUrl="http://localhost:3000"   //线下接口  
Vue.prototype.$baseUrl="http://kk.zjmy.live"  //线上接口

Vue.prototype.$superBoss = { //测试超级权限人
	username:'朱海军',
	password:13778111709
}
//请求接口封装
Vue.prototype.$myAjax = function(url,data){
	return uni.request({
		url: this.$baseUrl + url,
		method: 'POST', //get、post、delete
		data: data || [],
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	}).then((res) => {
		if(!res[0]){
			return res[1].data.data
		}else{
			return res[0]
		}
		// result将返回一个数组[error,{NativeData}]
	})
	
}

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
