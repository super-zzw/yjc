import store from '../store'
import Md5 from './md5/index.js'
import {getMsgNms} from './request.js'
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
			if (item.data.length == 0) {
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
		store.commit('setSelectAddr',null)
		uni.removeStorageSync('yzhexpireTime');
		uni.removeStorageSync('yzhloginSession');
		uni.removeStorageSync('yzhrefreshSession');
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
		var hours = parseInt(data / (60 * 60 * 1000));  //小时数
		var minutes = parseInt((data - hours * 60 * 60 * 1000) / (60 * 1000));  //剩余分钟
		var seconds = parseInt((data - hours * 60 * 60 * 1000 - minutes * 60 * 1000) / 1000);  //剩余秒
		return {
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
					webUrl: store.config.MALL_WEB_URL,  //辰悠++优品汇
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
				title: `${store.config.MALL_APP_NAME}汇聚了海内外优质商品`,
				imageUrl: _self.config.MALL_IMG_DEFAULT.groupShare,
				summary: "快来嗨购吧！",
				href: `${store.config.MALL_WEB_URL}/register.html?inviteCode=${code}&id=${0}`,
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
	}
}