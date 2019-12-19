import Api from './api.js'
var test = true;
var _baseUrl = '';
if (test) {
	_baseUrl = 'http://192.168.1.25:9502/api';  //测试地址
} else {
	_baseUrl = '';  //正式地址
}
var baseUrl = _baseUrl;
// 请求loading交给页面处理
// 页面中第一个需要使用登录的请求需要加await,若同一个页面多个请求需要避免多次loading
let systemInfo = uni.getSystemInfoSync();
let systemType = systemInfo.platform;

// 单次请求
export function http(opt){
	return new Promise((resolve, reject)=>{
		uni.request({
			header:{
				"Content-Type":"application/x-www-form-urlencoded",
				"MallChain-ClientType":systemType,
				"Mall-sessionId":uni.getStorageSync("abc") || "",
			},
			url: baseUrl + Api[opt.apiName],
			method:opt.type || 'GET',
			data:opt.data || '',
			success:res => {
				if(res.statusCode == 200 && res.data.code){
					if(res.data.code == 200000){
						resolve(res.data)
					}else{
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: res.data.message,
							duration: 1500
						});
						reject(res.data.message)
						setTimeout(function() {
							//处理没登录跳转等
						}, 1600);
					}
				}else{
					//服务器响应如404等
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: '请求失败,请稍后重试02',
						duration: 2000
					});
					reject('请求失败,请稍后重试02')
				}
			},
			fail:err => {
				uni.hideLoading()
				uni.showToast({
					icon: 'none',
					title: '请求失败,请稍后重试01',
					duration: 2000
				});
				reject('请求失败,请稍后重试01')
			}
		})
	})
}
//并发请求
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