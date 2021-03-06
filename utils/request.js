import Api from './api.js'
import store from '../store'
import utils from "./method.js"
var test =false ;
var _baseUrl = '';
if (test) {
	// _baseUrl = "/api"; // 代理时使用
	_baseUrl = 'http://192.168.1.25:9522/api';  //测试地址日强0
	// _baseUrl = 'http://192.168.1.17:9502/api';  //测试地址亮
	// _baseUrl = 'http://cymall-api.dev.gzcyou.com/api';  //内网测试地址
	// _baseUrl = 'http://yjc-api.dev.gzcyou.com/api';  //易聚财内网
} else {
	_baseUrl = 'https://api.gz01.net/api';  //易聚财正式地址
	// _baseUrl = 'http://api.youmall.vip/api';  //i&m商，只对app，微信支付：wx4c4af1149bf6832e
	// _baseUrl = 'https://api.vyunmall.com/api';  //辰悠++优品汇，只对app和小程序，微信支付：wx3e2043f6604d1b94，小程序appid wx869ea006d7b72f96
	// _baseUrl = 'https://www.zmhstem.com.cn/api'  //迈智汇小程序appid	wxa75ea180e9fc8015
	// _baseUrl = 'https://api.mrtht.newideafuture.com/api'  //每日特惠团小程序appid wx0dffc4bfc45653d2
	// _baseUrl='http://cymall-api.dev.gzcyou.com/api'  //商城1.2.7测试接口
}
var baseUrl = _baseUrl;
// 请求loading交给页面处理
// 页面中第一个需要使用登录的请求需要加await,若同一个页面多个请求需要避免多次loading
let systemInfo = uni.getSystemInfoSync();
let systemType = systemInfo.platform;

// 单次请求
export function http(opt){
	let _data = Object.assign({},opt.data || {},{from:2})
	return new Promise((resolve, reject)=>{
		uni.request({
			header:{
				"Content-Type":"application/x-www-form-urlencoded",
				// #ifdef MP-WEIXIN
				"MallChain-ClientType":"miniapp",
				// #endif
				// #ifndef MP-WEIXIN
				"MallChain-ClientType":systemType,
				// #endif
				"MallChain-SessionId":uni.getStorageSync("yzhloginSession") || "",
			},
			url: baseUrl + Api[opt.apiName],
			method:opt.type || 'GET',
			data:_data,
			success:res => {
				if(res.statusCode == 200 && res.data.code){
					//300003,300000
					
					if(res.data.code == 200000){
						
						resolve(res.data)
					}else if(res.data.code == 300003 || res.data.code == 300000){
						// uni.hideLoading()
						// uni.showToast({
						// 	icon: 'none',
						// 	title: "登录已过期,请重新登录01"
						// });
						utils.rmData()
						reject(res.data.message)
					}else{
						uni.hideLoading()
						if(res.data.code==500087){
							uni.setStorageSync('showWx',res.data.data)
						}else{
							uni.showToast({
								icon: 'none',
								title: res.data.message,
								duration: 1500
							});
						}
						
						reject(res.data)
					}
				}else{
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: '请求失败,请稍后重试01',
						duration: 2000
					});
					reject('请求失败,请稍后重试01')
					// utils.rmData()
					// uni.hideLoading()
					// uni.showToast({
					// 	icon: 'none',
					// 	title: "登录已过期,请重新登录02"
					// });
					// setTimeout(function() {
					// 	utils.rmData()
					// 	uni.reLaunch({
					// 		url:"/pages/public/login"
					// 	})
					// }, 2000);
				}
			},
			fail:err => {
				console.log(1111,err)
				// utils.rmData()
				
				uni.hideLoading()
				uni.showToast({
					icon: 'none',
					title: '网络信号差，请重试',
					duration: 2000,
				});
				reject('网络信号差，请重试');
				
			}
		})
	})
}
//上传文件
export function upLoadImg(opt){
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: baseUrl + Api[opt.apiName],
			filePath: opt.filePath,
			name: opt.name,
			header: {
				"MallChain-SessionId":uni.getStorageSync("yzhloginSession") || "",
			},
			success: (res) => {
				let _res = JSON.parse(res.data)
				if(_res.code == 200000){
					resolve(_res)
				}else{
					uni.showToast({
						title: '上传失败',
						icon: 'none'
					})
					reject("上传图片失败02")
				}
			},
			fail: () => {
				uni.showToast({
					title: '上传失败',
					icon: 'none'
				})
				reject("上传图片失败01")
			}
		})
	})
}
//并发请求举例
// let req1 = {
// 	apiName:"getBanner",
// 	data:{type:0}
// };
// let req2 = {
// 	apiName:"getBanner",
// 	data:{type:0}
// }
// let resAll = await this.$httpAll([req1,req2])
// try{
// 	ret.map((res,index) => {
// 		if(res.code == 200000){
// 		  if(index == 0){
// 			//
// 		  }else if(index == 1){
// 			//
// 		  }else if (index == 2){
// 			//
// 		  }
// 		}
// 	  })
// }catch(e){
// 	console.log(e)
// }
export function httpAll(opts){
	let promiseList = [];
	for (let i = 0; i < opts.length; i++) {
		let opt = opts[i];
		promiseList.push(http(opt,true))
	}
	var ret = Promise.all(promiseList);
	// ret.then(e => {
	// 	let needLogin = false;
	// 	needLogin = e.some(v => {
	// 		return v.code == 300000
	// 	})
	// 	if (needLogin) {
	// 		console.log("需要登录")
	// 	}
	// });
	return ret;
}
//获取项目配置
export function getConfig(){
	http({
		apiName:"getConfig",
	}).then(res => {
		store.commit('setConfig',res.data)
	}).catch(_ => {})
}
//获取未读消息总数
export function getMsgNms(){
	if(!store.state.hasLogin){
		return
	}
	http({
		apiName:"msgNum",
		type:"POST"
	}).then(res => {
	
		store.commit('setMsgNms',res.data)
		if(store.state.isHome != 1){
			utils.setBadgeText(0,res.data)
		}
	}).catch(_ => {})
}

//检查更新
export function checkUpdate(isAlert){
	// #ifdef MP-WEIXIN
	return
	// #endif
	
	let _version = "1"
	// #ifdef APP-PLUS
	_version = plus.runtime.versionCode
	// #endif
	http({
		apiName:"checkUpdate",
		type:"POST",
		data:{versionCode: _version}
	}).then(res => {
		if (!!res.data &&res.data.versionCode > _version) {
			console.log(1)
			uni.showModal({
				title: '版本更新' + res.data.versionCode,
				content: res.data.description,
				confirmText: "更新",
				showCancel: res.data.forceUpdate == 1 ? false : true,
				success: function(e) {
					if (e.confirm) {
						if (plus.os.name.toLowerCase() == 'ios') {
							// 跳转到下载页面
							plus.runtime.openURL(res.data.upgradeUrl)
						} else {
							var dtask = plus.downloader.createDownload(
								res.data.upgradeUrl, {},
								function(d, status) {
									uni.showToast({
										title: '下载完成',
										mask: false,
										duration: 1000
									});
									// 下载完成
									if (status == 200) {
										plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, e => e, function(error) {
											uni.showToast({
												title: '安装失败-01',
												mask: false,
												duration: 1500
											});
										})
									} else {
										uni.showToast({
											title: '更新失败-02',
											mask: false,
											duration: 1500
										});
									}
								});
							 try {
								dtask.start(); // 开启下载的任务
								var prg = 0;
								var showLoading = plus.nativeUI.showWaiting("正在下载");  //创建一个showWaiting对象 
								dtask.addEventListener('statechanged', function(
								  task,
								  status
								) {
								  // 给下载任务设置一个监听 并根据状态  做操作
								  switch (task.state) {
									case 1:
									  showLoading.setTitle("正在下载");
									  break;
									case 2:
									  showLoading.setTitle("已连接到服务器");
									  break;
									case 3:
									  prg = parseInt(
										(parseFloat(task.downloadedSize) /
										  parseFloat(task.totalSize)) *
										  100
									  );
									  showLoading.setTitle("  正在下载" + prg + "%  ");
									  break;
									case 4:
									   plus.nativeUI.closeWaiting();
										//下载完成
									  break;
								  }
								});
							  } catch (err) {
								  plus.nativeUI.closeWaiting();
								  uni.showToast({
								  	title: '更新失败-03',
								  	mask: false,
								  	duration: 1500
								  });
							  }
						}
		
					} else {
						//取消
					}
				}
			});
		} else {
		}
	}).catch(_ => {
		if(_.code==500087&&isAlert){
			uni.showModal({
				title: '提示',
				content: '已是最新版本',
				showCancel: false
			});
		}
	})
}
