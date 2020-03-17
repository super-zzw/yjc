import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let _session = uni.getStorageSync('yzhloginSession')
const store = new Vuex.Store({
	state: {
		hasLogin: !!_session,
		userInfo:{},
		afterLoginUrl:"",  //用于存储登录之后跳转的页面
		afterLoginIsTab:false,  //登录之后跳转的页面是否是tab
		order:[],  //直接购买临时存储的商品
		selectAddr:null,  //购买时选中的地址
		msgNms:0,  //未读消息总数
		paddingTop:""
	},
	mutations: {
		setPaddingTop(state,data){
			state.paddingTop = data;
		},
		setMsgNms(state,data){
			state.msgNms = data
		},
		setLogin(state,data){
			state.hasLogin = data
		},
		setUserInfo(state,data){
			state.userInfo = data
		},
		setAfterLoginUrl(state,data){
			state.afterLoginUrl = data
		},
		setAfterLoginIsTab(state,data){
			state.afterLoginIsTab = data
		},
		setOrder(state,data){
			state.order = data
		},
		setSelectAddr(state,data){
			state.selectAddr = data
		}
	},
	actions: {
	
	}
})

export default store
