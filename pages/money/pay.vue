<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{money}}</text>
		</view>

		<view class="pay-type-list">
			<!-- 1=支付宝；2=微信 4=货到付款, -->
			<view class="" v-for="(item,index) in payTypes" :key="index">
				<view class="type-item b-b" @click="changePayType(1)" v-if="item.payType === 2">
					<text class="icon iconfont iconweixin"></text>
					<view class="con">
						<text class="tit">微信支付</text>
						<text v-if="item.payDefault == 1">推荐使用微信支付</text>
					</view>
					<label class="radio">
						<radio value="" color="#F23D3D" :checked='payType == 1' />
						</radio>
					</label>
				</view>
				<!-- 小程序和微信h5没有支付宝支付 -->

				<view class="type-item b-b" @click="changePayType(2)" v-if="item.payType === 1">
					<text class="icon iconfont iconzhifubao"></text>
					<view class="con">
						<text class="tit">支付宝支付</text>
						<text v-if="item.payDefault == 1">推荐使用支付宝支付</text>
					</view>
					<label class="radio">
						<radio value="" color="#F23D3D" :checked='payType == 2' />
						</radio>
					</label>
				</view>

				<view class="type-item b-b" @click="changePayType(3)" v-if="item.payType === 4 && group != 1">
					<text class="icon iconfont iconhuodaofukuan"></text>
					<view class="con">
						<text class="tit">货到付款</text>
					</view>
					<label class="radio">
						<radio value="" color="#F23D3D" :checked='payType == 3' />
						</radio>
					</label>
				</view>
			</view>
		</view>
		<text>{{err}}</text>
		<text class="mix-btn" @click="confirm">
			<text v-if="payType == 3">确定</text>
			<text v-else>确认支付</text>
		</text>
	</view>
</template>

<script>
	import utils from '../../utils/method.js'
	import _AP from './ap.js'
	import {
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				money: 0,
				orderId: "",
				payType: 1,
				orderInfo: {},
				payTypes: [],
				err: "",
				group: ""
			};
		},
		computed: {

		},
		async onLoad(opt) {
		
			//公众号中进入授权
			// #ifdef H5
			//判断微信浏览器

			var that = this;
			if (utils.isWxBrowser()) {
				uni.showLoading({
					title: "授权中...",
					mask: true
				})
				await this.wxJsdkLogin();
				uni.hideLoading()
			} else {
				// uni.showModal({
				// 	title:"提示",
				// 	content:"请使用微信打开进行支付",
				// 	showCancel:false
				// })
			}
			// #endif

			this.money = opt.money;
			this.orderId = opt.orderid; //
			this.group = opt.group; //拼团订单
			this.getPayType();

		},

		methods: {
			...mapMutations(['setSelectAddr']),
			//获取支付方式
			async getPayType() {
				await this.$http({
					apiName: "payType"
				}).then(res => {
					this.payTypes = res.data
				}).catch(e => {

				})
			},
			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
			//确认支付
			confirm: async function() {
				if (this.payType == 1) {
					await this.wxPay()
				} else if (this.payType == 2) {
					await this.aliPay()
				} else if (this.payType == 3) {
					let _self = this;
					uni.showModal({
						title: '提示',
						content: '为确保您能及时收到商品，请确认您的收货信息准确无误！',
						success: function(res) {
							if (res.confirm) {
								_self.afterSale()
							} else if (res.cancel) {

							}
						}
					});
				}
			},
			async afterSale() {
				let that = this;
				await this.$http({
					apiName: "payAfter",
					type: "POST",
					data: {
						orderNo: this.orderId
					}
				}).then(res => {
					that.setSelectAddr(null); //支付成功后清除选中的地址（测试要求的）
					if (this.group == 1) {

					} else {
						uni.redirectTo({
							url: "/pages/money/paySuccess?isDh=2"
						})
					}
				}).catch(err => {

				})
			},
			async wxJsdkLogin(jweixin, _appid) {
				//授权配置
				if (!uni.getStorageSync("wxJsdkLogin")) {
					utils.configWeiXin((jweixin, _appid) => {
						try {
							utils.wxJsdkAuthorize(_appid)
						} catch (e) {
							console.log("授权失败:", e)
						}
					})
				} else {
					return
				}
			},
			async wxPay() {
				var _wxPayType = "APP";
				// #ifdef APP-PLUS
				_wxPayType = "APP";
				// #endif
				// #ifdef MP-WEIXIN
				_wxPayType = "JSAPI";
				// #endif
				// #ifdef H5
				_wxPayType = "WEB";
				if (!utils.isWxBrowser()) {
					uni.showModal({
						title: "提示",
						content: "请使用微信打开进行支付",
						showCancel: false
					})
				}
				// #endif
				var that = this;

				await this.$http({
					apiName: "wxPay",
					type: "POST",
					data: {
						orderNo: this.orderId,
						wxPayType: _wxPayType,
					}
				}).then(res => {
					//判断是否是公众号
					// #ifdef H5
					//判断微信浏览器
					// if(utils.isWxBrowser()){
					let obj = {
						appId: res.data.appId, //示例wxd678efh567hg6787
						timeStamp: res.data.timeStamp, //时间戳
						nonceStr: res.data.nonceStr, //示例1900000109	
						package: res.data.packageValue, // 固定值
						signType: res.data.signType,
						paySign: res.data.paySign,
					}
					let callback_succ_func = function() {
						that.setSelectAddr(null); //支付成功后清除选中的地址（测试要求的）
						uni.redirectTo({
							url: "/pages/money/paySuccess"
						})
					};
					let callback_error_func = function() {
						uni.redirectTo({
							url: "/pages/money/payFail"
						})
					};
					//方法一：使用WeixinJSBridge支付
					utils.wxJsPay(obj, callback_succ_func, callback_error_func)
					//方法二：使用jssdk支付
					// jweixin.chooseWXPay({
					// 	...obj,
					// 	success: () => {
					// 		callback_succ_func()
					// 	},
					// 	fail: err => {
					// 		callback_error_func()
					// 	},
					// 	cancel: err => {
					// 		callback_error_func()
					// 	}
					// });
					// }else{
					// 	uni.showModal({
					// 		title:"提示",
					// 		content:"请使用微信打开进行支付",
					// 		showCancel:false
					// 	})
					// }
					// #endif

					// #ifdef APP-PLUS
					let obj1 = {
						appid: res.data.appId, //示例wxd678efh567hg6787
						partnerid: res.data.partnerId, //示例WX1217752501201407033233368018
						prepayid: res.data.prepayId, //示例WX1217752501201407033233368018
						package: res.data.packageValue, // 固定值
						noncestr: res.data.nonceStr, //示例1900000109	
						timestamp: res.data.timeStamp, //时间戳
						sign: res.data.sign, //签名C380BEC2BFD727A4B6845133519F3AD6
					}
					// let orderInfo = JSON.stringify(obj1)
					uni.requestPayment({
						provider: 'wxpay',
						orderInfo: obj1, //微信、支付宝订单数据
						success: function(res) {
							that.setSelectAddr(null); //支付成功后清除选中的地址（测试要求的）
							uni.redirectTo({
								url: "/pages/money/paySuccess"
							})
						},
						fail: function(err) {
							// console.log(err)
							// this.err = JSON.stringify(err)
							uni.redirectTo({
								url: "/pages/money/payFail"
							})
						}
					});
					// #endif

					// #ifdef MP-WEIXIN
					let obj2 = {
						nonceStr: res.data.nonceStr,
						timeStamp: res.data.timeStamp,
						package: res.data.packageValue,
						signType: res.data.signType,
						paySign: res.data.paySign,
						appId: res.data.appId
					}
					uni.requestPayment({
						provider: 'wxpay',
						...obj2,
						success: function(res) {
							that.setSelectAddr(null); //支付成功后清除选中的地址（测试要求的）
							uni.redirectTo({
								url: "/pages/money/paySuccess"
							})
						},
						fail: function(err) {
							console.log(err);
							uni.redirectTo({
								url: "/pages/money/payFail"
							})
						}
					});
					// #endif
				}).catch(_ => {})

			},
			async aliPay() {
				var that = this;
				var _wxPayType = "APP";
				var _returnUrl = ''
				// #ifdef APP-PLUS
				_wxPayType = "APP";
				// #endif
				// #ifdef H5
				_wxPayType = "WEB";
				_returnUrl = window.location.origin + '/pages/money/paySuccess'
				// #endif
				await this.$http({
					apiName: "aliPay",
					type: "POST",
					data: {
						orderNo: this.orderId,
						aliPayType: _wxPayType,
						returnUrl: _returnUrl
					}
				}).then(res => {
				
					// #ifdef H5
						this.getMask(res)
					// #endif

					uni.requestPayment({
						provider: 'alipay',
						orderInfo: res.data, //微信、支付宝订单数据
						success: function(data) {
							that.setSelectAddr(null); //支付成功后清除选中的地址（测试要求的）
							uni.redirectTo({
								url: "/pages/money/paySuccess"
							})
						},
						fail: function(err) {
							uni.redirectTo({
								url: "/pages/money/payFail"
							})
						}
					})
				}).catch(err => {
					console.log(err)
				})

			},
		
		onBackPress() {
			let _res = true
			uni.showModal({
				title: '提示',
				content: '确认要放弃付款？订单会保留一段时间，请尽快支付',
				confirmText: '继续支付',
				cancelText: '确认离开',
				confirmColor: '#F23D3D',
				success: function(res) {
					if (!res.confirm) {
						uni.redirectTo({
							url: "/pages/order/order?state=1"
						})
					}
				}
			});
			return true
		},
		getMask(res) {
			var form = res.data;
			const div = document.createElement('div') //创建div
			div.innerHTML = form //此处form就是后台返回接收到的数据
			document.body.appendChild(div) //document.forms[0].submit()
			document.forms[0].acceptCharset = 'utf-8';
			var queryParam = '';
			Array.prototype.slice.call(document.querySelectorAll("input[type=hidden]")).forEach(function(ele) {
				queryParam += '&' + ele.name + "=" + encodeURIComponent(ele.value);
			});
			var gotoUrl = document.querySelector("form").getAttribute('action') + '&' + queryParam;
			_AP.pay(gotoUrl,this.orderId);
		},
}

	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #909399;

		.price {
			font-size: 50rpx;
			color: #303133;
			margin-top: 12rpx;

			&:before {
				content: '￥';
				font-size: 40rpx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20rpx;
		background-color: #fff;
		padding-left: 60rpx;

		.type-item {
			height: 120rpx;
			padding: 20rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60rpx;
			font-size: 30rpx;
			position: relative;
		}

		.icon {
			width: 100rpx;
			font-size: 52rpx;
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.iconweixin {
			color: #36cb59;
		}

		.iconzhifubao {
			color: #01aaef;
		}

		.iconhuodaofukuan {
			color: #0FCE8D;
		}

		.tit {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4rpx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630rpx;
		height: 80rpx;
		margin: 80rpx auto 30rpx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10rpx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
