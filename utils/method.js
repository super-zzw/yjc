import store from '../store'
import Md5 from './md5/index.js'
import {getMsgNms} from './request.js'
import {http} from './request.js'
// #ifdef H5
let jweixin = require('jweixin-module')  
// #endif
export default{
	wxLogin(){
		return new Promise((resolve,reject) => {
			uni.login({
			  provider: 'weixin',
			  success: function (res) {
				if (res.code) {
					// resolve(res.code);
				    uni.getUserInfo({
				    	provider: 'weixin',
				    	success: function(infoRes) {
							resolve(res.code);
				    	},
				    	fail(res) {
							resolve(false)
						}
				    });
				}else{
					resolve(false)
				}
			  },
			  fail:function(res){
				  resolve(false)
				}
			})
		})
	},
	//数据校验
	judgeData(arr) {
		let res = true;
		for (let item of arr) {
			if (item.data.length == 0||item.data==false) {
				res = false;
				uni.showToast({
					icon: 'none',
					title: item.info,
					duration: 2000
				});
				break
			}
		}
		return res
	},
	md5(data){
		return Md5(data)
	},
	//登录成功设置session
	setSesion(data){
		store.commit('setLogin',true)
		uni.setStorageSync('yzhexpireTime',data.expireTime)
		uni.setStorageSync('yzhloginSession',data.loginSession)
		uni.setStorageSync('yzhrefreshSession',data.refreshSession)
		getMsgNms()
	},
	//退出登录清除session
	rmData(){
		store.commit('setLogin',false)
		store.commit('setUserInfo',{})
		store.commit('setOrder',[])
		store.commit('setCartNms',0)
	
		uni.removeStorageSync('yzhexpireTime');
		uni.removeStorageSync('yzhloginSession');
		uni.removeStorageSync('yzhrefreshSession');
		uni.removeStorageSync('wxJsdkLogin');
	},
	//登录之后的跳转
	afterLoginJump(){
		if(store.state.afterLoginIsTab){
			uni.switchTab({
			// uni.reLaunch({
				url:store.state.afterLoginUrl || '/pages/index/index'
			})
		}else{
			if(store.state.afterLoginUrl){
				uni.redirectTo({
					url:store.state.afterLoginUrl
				})
			}else{
				uni.switchTab({
				// uni.reLaunch({
					url:'/pages/index/index'
				})
			}
		}
		store.commit('setAfterLoginUrl',"")
		store.commit('setAfterLoginIsTab',false)
	},
	//将时间戳转化为格式化日期和时间
	unixToDatetime(unix,x=1){
		  var date = null;
		  if(unix){
		    date = new Date(unix);
		  }else {
		    date = new Date;
		  }
		  let Y = date.getFullYear() + '-';
		  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
		  let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
		  let h = date.getHours() < 10 ? '0' + date.getHours()  + ':' : date.getHours() + ':';
		  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
		  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
		  if(x === 1){return (Y+M+'-'+D+h+m);}//2017-09-29 21:30
		  if(x === 4){return (Y+M+'-'+D+h+"00");}//2017-09-29 21:00
		  if(x === 2){return (Y+M+'-'+D+"00"+":"+"00");}//2019-09-29 00:00
		  if(x === 3){return (Y+M+'-'+D);}//2019-09-29
		  if(x === 5){return (Y+M+'-'+"01");}//2019-09-01
		  if(x === 6){return (Y+M);}//2019-09
		  if(x === 7){return (Y+M+'-'+D+h+m+':'+s);}//精确到秒
		  if(x === 8){return (M+'-'+D+h+m);}//2017-09-29 21:30
		  if(x==9){return (date.getFullYear()+'.'+M+'.'+D)}
		  if(x === 0){//取上一个月
		    var Y2 = date.getFullYear(); //获取当前日期的年份
		    var M2 = parseInt(date.getMonth());
		    if (M2 === 1) {//如果是1月份，则取上一年的12月份
		      Y2 = parseInt(Y2) - 1;
		      month2 = 12;
		    }
		    return (Y2+'-'+M2);
		  }
	},
	//设置消息小红点
	setBadgeText(btnIndex,Nm){
		if(!uni.getStorageSync("yzhrefreshSession")){
			return
		}else{
			if(Nm <= 0){
				return
			}else{
				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
			
				// #ifdef APP-PLUS
				let currentWebview = page.$getAppWebview();
				currentWebview.setTitleNViewButtonBadge({index:btnIndex,text:Nm})
				// #endif
			}
		}
	},
	//咨询客服前的必要参数处理
	//用户uid，游客则设置为"游客"
	//商品pid,没有则设置为空字符串
	//订单oid,没有则设置为空字符串
	//oid和pid不会同时都有值
	getService(data){
		let _url = '/pages/service/service'
		let _data = data
		_data["uid"] = store.state.userInfo.id || "游客"
		uni.navigateTo({
			url:`/pages/service/service?uid=${_data.uid}&pid=${_data.pid}&oid=${_data.oid}`
		})
	},
	transToDate(data) {
		var days = parseInt(data / (1000 * 60 * 60 * 24));
		var hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = (data % (1000 * 60)) / 1000;
		return {
			d:days,
			h:hours,
			m:minutes,
			s:seconds
		};
	},
	wxShare({name,type,gid,path="pages/fight/productDetail"}){
		//分享到小程序
		if(store.state.aboutShare == 1){
			uni.share({
				provider: "weixin",
				scene: name,
				type:5,  //5是小程序
				title: `${store.state.config.MALL_APP_NAME}汇聚了海内外优质商品，快来嗨购吧！`,
				imageUrl: store.state.config.MALL_IMG_DEFAULT.groupShare,
				miniProgram:{  //小程序的配置信息
					id: 'gh_a6c9030a00ac', // 公众开发平台原始ID//辰悠++优品汇
					path: path+'?id='+gid, 
					type: 2,  //0-正式版； 1-测试版； 2-体验版
					webUrl: store.state.config.MALL_WEB_URL,  //辰悠++优品汇
				},
				success(res) { 
					console.log(res);
				},
				fail(err){
					console.log(err);
				}
			})
		}
		//分享到注册
		if(store.state.aboutShare == 2){
			let _self = this;
			uni.share({
				provider: "weixin",
				scene: name,
				type:0,
				title: `${store.state.config.MALL_APP_NAME}汇聚了海内外优质商品`,
				imageUrl: _self.config.MALL_IMG_DEFAULT.groupShare,
				summary: "快来嗨购吧！",
				href: `${store.state.config.MALL_WEB_URL}/register.html?inviteCode=${code}&id=${0}`,
				success(res) {
					console.log(res);
				},
				fail(err){
					console.log(err);
				}
			})
		}
		
	},
	setClip({code,id}){
		uni.setClipboardData({
			data: `http://web.vyunmall.com/register.html?inviteCode=${code}&id=${id}`,
			success(res) {
				uni.hideToast();
				uni.showToast({
					title: "复制成功，请前往浏览器打开",
					icon: "none"
				})
			}
		});
	},
	homeShare({imageUrl,path}){
		return {
			title:`${store.state.config.MALL_APP_NAME}汇聚了海内外优质商品，快来嗨购吧！`,
			path:path || '/pages/index/index',
			imageUrl:imageUrl || store.state.config.MALL_IMG_DEFAULT.groupShare
		}
	},
	//判断是否是微信浏览器
	isWxBrowser(){
		if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger"){
			return true
		}else{
			return false
		}
	},
	//jdk配置
	async configWeiXin(callback) {
		//获取公众号配置
		let resConfig = await http({
			apiName: "wxJsdkConfig",
			type:"POST",
			data:{
				url: encodeURIComponent(window.location.href),  //后台通过域名进行授权
			}
		})
		if (resConfig) {
			let apiList = [ // 可能需要用到的能力
				'onMenuShareAppMessage',
				'onMenuShareTimeline',
				'hideOptionMenu',
				'showOptionMenu',
				'chooseWXPay'
			];
			let info = {
				// debug: true, // 调试，发布的时候改为false
				appId: resConfig.data.appId,
				nonceStr: resConfig.data.nonceStr,
				timestamp: resConfig.data.timestamp,
				signature: resConfig.data.signature,
				jsApiList: apiList
			};
			jweixin.config(info);
			jweixin.error(err => {
				console.log('config fail:', err);
			});
			jweixin.ready(res => {
				if (callback) callback(jweixin,resConfig.data.appId); // 配置成功回调
			});
		}
	},
	//公众号授权
	async wxJsdkAuthorize(_appid){
		let link = window.location.href;
		let _code = ''
		if(link.includes("code=")){
			_code = link.split("code=")[1].split('&')[0]
		}
		// 如果拿到_code，调用授权接口，没有拿到就跳转微信授权链接获取
		if (_code) {
			await http({ apiName:"wxJsdkLogin", data:{ code:_code }});  //code传到后台关联账户
			uni.setStorageSync("wxJsdkLogin",true)
		} else {
			let appid = _appid;
			let uri = encodeURIComponent(link);
			let authURL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${uri}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
			window.location.href = authURL;
		}
	},
	jsApiCall(data ,callback_succ_func ,callback_error_func){  
		//使用原生的，避免初始化appid问题  
		WeixinJSBridge.invoke('getBrandWCPayRequest', {  
			appId:data['appId'],  
			timeStamp: data['timeStamp'],  
			nonceStr: data['nonceStr'], // 支付签名随机串，不长于 32 位  
			package: data['package'], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）  
			signType: data['signType'], // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'  
			paySign: data['paySign'], // 支付签名  
		},  
		function(res) {  
			var msg = res.err_msg ?res.err_msg :res.errMsg;  
			//WeixinJSBridge.log(msg);  
			switch (msg) {  
				case 'get_brand_wcpay_request:ok': //支付成功时  
					if(callback_succ_func){  
						callback_succ_func(res);  
					}  
					break;  
				default: //支付失败时  
					WeixinJSBridge.log('支付失败!'+msg+',请返回重试.');  
					if(callback_error_func){  
						callback_error_func({msg:msg});  
					}  
					break;  
			}  
		})  
	}, 
	//WeixinJSBridge判断
	wxJsPay(data ,callback_succ_func ,callback_error_func){
		if (typeof WeixinJSBridge == "undefined") {  
			if (document.addEventListener) {  
				document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);  
			} else if (document.attachEvent) {  
				document.attachEvent('WeixinJSBridgeReady', this.jsApiCall);  
				document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall);  
			}  
		} else {  
			this.jsApiCall(data ,callback_succ_func ,callback_error_func);  
		}  
	},
	async getUserInfo(){
		await http({
			apiName:'getUserInfo',
		}).then(res=>{
			console.log(res)
			store.commit('setUserInfo',res.data)
		}).catch(err=>{
			
		})
	}
}