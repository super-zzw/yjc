import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let _session = uni.getStorageSync('yzhloginSession')
const store = new Vuex.Store({
	state: {
		server:1,  //1第三方客服，2，小程序自带客服，仅限小程序
		hasLogin: !!_session,
		userInfo:{},
		afterLoginUrl:"",  //用于存储登录之后跳转的页面
		afterLoginIsTab:false,  //登录之后跳转的页面是否是tab
		order:[],  //直接购买临时存储的商品
		selectAddr:null,  //购买时选中的地址
		msgNms:0,  //未读消息总数
		paddingTop:"",
		config:null,
		groupProductId:"",
		iCode:"",
		hasScore:-1,  //积++分模块
		hasSigin:-1,  //签到模块
		cartNms:0,  //购物车数量
	},
	mutations: {
		setCartNms(state,data){
			state.cartNms = data
		},
		setHasScore(state,data){
			state.hasScore = data
		},
		setHasSigin(state,data){
			state.hasSigin = data
		},
		setICode(state,data){
			state.iCode = data
		},
		setGroupProductId(state,data){
			state.groupProductId = data
		},
		setConfig(state,data){
			state.config = data
		},
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
