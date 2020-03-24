import Vue from 'vue'
import store from './store'
import App from './App'
import {http,upLoadImg,httpAll,getMsgNms,checkUpdate,getConfig} from './utils/request.js'


const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}


Vue.config.productionTip = false
// Vue.prototype.$fire = new Vue();  //未找到使用的地方
Vue.prototype.$store = store;
Vue.prototype.$http = http;
Vue.prototype.$upLoadImg = upLoadImg;
Vue.prototype.$httpAll = httpAll;
Vue.prototype.$getMsgNms = getMsgNms;
Vue.prototype.$checkUpdate = checkUpdate;
Vue.prototype.$getConfig = getConfig;
Vue.prototype.$api = {prePage};

import wxTabbar from '@/components/wx-tabbar.vue'
Vue.component('wxTabbar',wxTabbar)

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()