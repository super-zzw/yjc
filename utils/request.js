import Api from './api.js'
import store from '../store'
import utils from "./method.js"
var test = true;
var _baseUrl = '';
if (test) {
	// _baseUrl = 'http://192.168.1.25:9502/api';  //测试地址日强
	_baseUrl = 'http://192.168.1.17:9502/api';  //测试地址亮
	// _baseUrl = 'http://cymall-api.dev.gzcyou.com/api';  //内网测试地址
	// _baseUrl = 'http://t.api.youmall.vip/api';  //线上测试
} else {
	_baseUrl = 'http://api.youmall.vip/api';  //正式地址
	// #ifdef MP-WEIXIN
	_baseUrl = 'http://youmall.gzcyou.com/api' 
	// #endif
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
						uni.showToast({
							icon: 'none',
							title: res.data.message,
							duration: 1500
						});
						reject(res.data.message)
					}
				}else{
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: '请求失败,请稍后重试01',
						duration: 2000
					});
					reject('请求失败,请稍后重试01')
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
				uni.hideLoading()
				uni.showToast({
					icon: 'none',
					title: '请求失败,请稍后重试02',
					duration: 2000
				});
				reject('请求失败,请稍后重试02')
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
		utils.setBadgeText(0,res.data)
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
		if (!!res.data && res.data.versionCode > _version) {
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
			if(isAlert){
				uni.showModal({
					title: '提示',
					content: '已是最新版本',
					showCancel: false
				});
			}
			
		}
	}).catch(_ => {})
}
