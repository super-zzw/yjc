<template>
	<view class="container">
		<view class="top">
			<image :src="config.MALL_LOGO_URL" mode=""></image>
			<text class="txt">欢迎来到易聚财</text>
		</view>
		<view class="wrapper">
			<view class="input-content">
				<view class="input-item">
					<!-- <text >手机号码</text> -->
					<image src="../../static/mobile.png" mode="" class="icon"></image>
					<input type="number" v-model="mobile" placeholder="请输入手机号" maxlength="11" />
				</view>
			</view>
			<view class="input-content">
				<view class="input-item input-item1">
					<view class="left">
						<image src="../../static/code.png" mode="" class="icon"></image>
						<input type="password" placeholder="请输入验证码" placeholder-class="input-empty" maxlength="6" v-model="code" />
					</view>
					<text class="stext" @tap="getCode">{{codeText}}</text>
				</view>
				<!-- <image src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/wxhy.png" mode="" @tap="oAuth" class="oAuthIcon"
				data-logintype="weixin"></image>
				<image src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/pyq.png" mode="" @tap="oAuth" class="oAuthIcon"
				data-logintype="qq"></image> -->
				<!-- 	<view class="forget-section forget-section2"  @tap="toPage('/pages/public/logincode')">
					<view>
						没有账户?
						<text class="register" @click="toPage('/pages/public/register')">立即注册</text>
					</view>
					<text class="forget" @click="toPage('/pages/public/forgetpwd')" v-if="tab==1">忘记密码</text>
				</view>
				 -->
			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">登录</button>
		</view>
		<!-- <view class="suibian" @tap="toIndex">随便逛逛</view>
		<view class="register-section">
			<text @click="toPage('/pages/public/forgetpwd')">忘记密码</text>
			<text class="rscen">|</text>
			<text @click="toPage('/pages/public/register')">马上注册</text>
		</view> -->
		<!-- #ifdef APP-PLUS -->
		<view class="wxLogin" @click="oAuth" data-logintype="weixin" v-if="showWx">
			<image src="../../static/wx.png" mode="" class="wxIcon"></image>
			<text>微信登录</text>
		</view>
		<!-- #endif -->
		
		<view class="mask" v-if="sModal"></view>
		<view class="tipBox" v-if="sModal">
			<text class="txt">该手机号已绑定其他微信号</text>
			<view class="back" @tap="sModal=false">返回登录</view>
		</view>
	</view>
</template>
<script>
	import {  
	       mapState 
	   } from 'vuex';
	import utils from '../../utils/method.js'
	export default {
		data() {
			return {
				mobile: '',
				code: '',
				logining: false,
				tab: 1,
				sModal: false,
				coding: false, //是否处于发送验证码的状态
				timer: "",
				codeText: "获取验证码",
				timeLeft: 120,
				showWx:true
			}
		},
		onLoad(opt) {
			//返回跳转过来的
			this.showWx=uni.getStorageSync('showWx')==1?true:false 
			// console.log(uni.getStorageSync('showWx'))
		},
		computed:{
			...mapState(['config'])
			// showWx(){
			// 	return uni.getStorageSync('showWx')
			// }
		},
		methods: {
			// ...mapMutations(['login']),
			toIndex() {
				uni.switchTab({
					// uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			toPage(url) {
				uni.navigateTo({
					url: url
				})
			},
			navBack() {
				uni.navigateBack();
			},
			async getCode() {
				if (this.coding) {
					return
				}
				uni.showLoading({
					title: "获取验证码...",
					mask: true
				})
				let _data = [{
						data: this.mobile.trim(),
						info: '手机号不能为空'
					},
					{
						data: /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/.test(this.mobile.trim()) ? "1" : "",
						info: '手机号格式不正确'
					}
				]
				let jres = await utils.judgeData(_data)
				if (jres) {
					this.coding = true;
					this.countDown();
					await this.$http({
						apiName: "getCode",
						type: "POST",
						data: {
							phoneNumber: this.mobile,
						}
					}).then(res => {
						uni.hideLoading();
					}).catch(_ => {
						this.clearCountDown();
						uni.hideLoading();
					})
				} else {
					uni.hideLoading()
				}
			},
			countDown() {
				this.timer = setInterval(() => {
					this.codeText = "请稍后" + this.timeLeft + 's'
					this.timeLeft -= 1;
					if (this.timeLeft == 0) {
						this.clearCountDown();
					}
				}, 1000)
			},
			clearCountDown() {
				clearInterval(this.timer);
				this.coding = false
				this.timeLeft = 120
				this.codeText = "发送验证码"
			},
			async toLogin() {
				if (this.logining) {
					return
				}
				this.logining = true;
				let _data, apiName, formdata
				_data = [{
						data: this.mobile.trim(),
						info: '手机号不能为空'
					},
					{
						data: /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/.test(this.mobile.trim()) ? "1" : "",
						info: '手机号格式不正确'
					},
					{
						data: this.code,
						info: '验证码不能为空'
					},
				]
				apiName = 'codeLogin'
				formdata = {
					authCode: this.code,
					phoneNumber: this.mobile,
				}
				let jres = await utils.judgeData(_data)
				if (jres) {
					await this.$http({
						apiName: apiName,
						type: "POST",
						data: formdata
					}).then(res => {
						console.log(res)
						utils.setSesion(res.data)
						utils.getUserInfo()
						utils.afterLoginJump()
					}).catch(_ => {})
				}
				this.logining = false;
			},
			oAuth(e) {
				var type = e.currentTarget.dataset.logintype
				uni.login({
					provider: type,
					success: (res) => {
						uni.getUserInfo({
							provider: type,
							success: (info) => {
								uni.setStorageSync('appInfo', info.userInfo)
								console.log(info.userInfo)
								this.$http({
									apiName: 'appWxLogin',
									type: 'POST',
									data: {
										appOpenId: info.userInfo.openId,
										headUrl: info.userInfo.avatarUrl
									}
								}).then(res => {
									console.log(res)
									uni.showToast({
										title: '登录成功',
										mask: false,
										duration: 1500
									});
									utils.setSesion(res.data)
									utils.getUserInfo()
									utils.afterLoginJump()
								}).catch(err => {
									console.log(err)
									if (err.code === 500082) {
										uni.redirectTo({
											url: '/pages/public/bindMobile'
										})
									}
									 else {
										uni.redirectTo({
											url: '/pages/set/payPwd'
										})
									}
								})
							}
						})
					}
				})
			}
		},
	}
</script>
<style lang='scss' scoped>
	page {
		background: #fff;
	}
	.container {
		/* padding-top: 115px; */
		position: relative;
		width: 100vw;
		/*#ifdef APP-PLUS*/
		/* 	height: 100vh; */
		/* #endif */
		/* #ifdef H5 */
		/* height: calc(100vh - 88rpx); */
		/* #endif */
		/* 	overflow: hidden;
		background: #fff;
		box-sizing: border-box; */
		/*  #ifdef APP-PLUS || H5 */
		/* background-image: url('https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/loginbgk.png'); */
		/*  #endif */
		/*  #ifdef MP-WEIXIN */
		background-image: url(data:image/png;base64,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AIBgBwAAwQ4AAAh2AABAsAMAgGAHAAAEOwAACHYAAECwAwAAgh0AAAQ7AAAg2AEAQLADAACCHQAAEOwAACDYAQAAwQ4AAIIdAAAQ7AAAgGAHAADBDgAACHYAABDsAACAYAcAAAQ7AAAIdgAAQLADAIBgBwAABDsAACDYAQBAsAMAAIIdAAAEOwAAINgBAADBDgAAgh0AABDsAAAg2AEAAMEOAAAIdgAAEOwAAIBgBwAAwQ4AAAh2AABAsAMAgGAHAAAEOwAACHYAAECwAwAAgh0AAAQ7AAAg2AEAQLADAACCHQAAEOwAACDYAQAAwQ4AAIIdAAAQ7AAAgGAHAADBDgAACHYAABDsAACAYAcAAAQ7AAAIdgAAQLADAIBgBwAABDsAACDYAQBAsAMAAIIdAAAEOwAAINgBAADBDgAAgh0AABDsAAAg2AEAAMEOAAAIdgAAEOwAAIBgBwAAwW4FAAAQ7AAAgGAHAADBDgAACHYAABDsgh0AAAQ7AAAg2AEAQLADAACCHQAABLtgBwAAwQ4AAAh2AAAQ7AAAgGAHAADBLtgBAECwAwAAgh0AAAQ7AAAg2AEAAMEOAACCHQAAEOwAACDYAQAAwQ4AAAh2AAAQ7AAAgGAHAADBDgAACHYAAECwAwCAYAcAAAQ7AAAIdgAAQLADAACCHQAABDsAACDYAQBAsAMAAIIdAAAQ7AAAINgBAADBDgAAgh0AABDsAACAYAcAAMEOAAAIdgAAEOwAAIBgBwAABDsAAAh2AABAsAMAgGAHAAAEOwAAINgBAECwAwAAgh0AAAQ7AAAg2AEAAMEOAACCHQAAEOwAACDYAQAAwQ4AAAh2AAAQ7AAAgGAHAADBDgAACHYAAECwAwCAYAcAAAQ7AAAIdgAAQLADAACCHQAABDsAACDYAQBAsAMAAIIdAAAQ7AAAINgBAADBDgAAgh0AABDsAACAYAcAAMEOAAAIdgAAEOwAAIBgBwAABDsAAAh2AABAsAMAgGAHAAAEOwAAINgBAECwAwAAgh0AAAQ7AAAg2AEAAMEOAACCHQAAEOwAACDYAQAAwQ4AAAh2AAAQ7AAAgGAHAADBDgAACHYAAECwAwCAYAcAAAQ7AAAIdgAAQLADAACCHQAABDsAACDYAQBAsAMAAIIdAAAQ7AAAINgBAADBDgAAgh0AABDsAACAYAcAAMEOAAAIdgAAEOwAAIBgBwAABDsAAAh2AABAsAMAgGAHAAAEOwAAINgBAECwAwAAgh0AAAQ7AAAg2AEAAMEOAACCHQAAEOwAACDYAQAAwQ4AAAh2AAAQ7AAAgGAHAADBDgAACHYAAECwAwCAYAcAAAQ7AAAIdgAAQLADAACCHQAABDsAACDYAQBAsAMAAIIdAAAQ7AAAINgBAADBDgAAgh0AABDsAACAYAcAAMEOAAAIdgAAEOwAAIBgBwAABDsAAAh2AABAsAMAgGAHAAAEOwAAINgBAECwAwAAgh0AAAQ7AAAg2AEAAMEOAACCHQAAEOwAACDYAQAAwQ4AAAh2AAAQ7AAAgGAHAADBDgAACHYAAECwAwCAYAcAAAQ7AAAIdgAAQLADAACCHQAABDsAACDYAQBAsAMAAIIdAAAQ7AAAINgBAADBDgAAgh0AABDsAACAYAcAAMEOAAAIdgAAEOwAAIBgBwAABDsAAAh2AABAsAMAgGAHAAAEOwAAINgBAECwAwAAgh0AAAQ7AAAg2AEAAMEOAACCHQAAEOwAACDYAQAAwQ4AAAh2AAAQ7AAAgGAHAADBDgAACHYAAECwAwCAYAcAAAQ7AAAIdgAAQLADAACCHQAABDsAACDYAQBAsAMAAIIdAAAQ7AAAINgBAADBDgAAgh0AABDsAACAYAcAAMEOAAAIdgAAEOwAAIBgBwAABDsAAAh2AABAsAMAgGAHAAAEOwAAINgBAECwAwAAgh0AAAS7FQAAQLADAACCHQAABDsAACDYAQBAsAt2AAAQ7AAAgGAHAADBDgAACHYAABDsgh0AAAQ7AAAg2AEAQLADAACCHQAABLtgBwAAwQ4AAAh2AAAQ7AAAgGAHAAAEOwAACHYAAECwAwCAYAcAAAQ7AAAg2AEAQLADAACCHQAABDsAACDYAQAAwQ4AAIIdAAAQ7AAAINgBAADBDgAACHYAABDsAACAYAcAAMEOAAAIdgAAQLADAIBgBwAABDsAAAh2AABAsAMAAIIdAAAEOwAAINgBAECwAwAAgh0AABDsAAAg2AEAAMEOAACCHQAAEOwAAIBgBwAAwQ4AAAh2AAAQ7AAAgGAHAAAEOwAACHYAAECwAwCAYAcAAAQ7AAAg2AEAQLADAACCHQAABDsAACDYAQAAwQ4AAIIdAAAQ7AAAINgBAADBDgAACHYAABDsAACAYAcAAMEOAAAI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);
		/*  #endif */
		background-repeat: no-repeat;
		background-size: 100% 100%;
		.suibian {
			font-size: 12px;
			color: #4399fc;
			margin-top: 60rpx;
			text-align: center;
		}
	}
	.top {
		margin-top: 90rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		image {
			width: 96rpx;
			height: 96rpx;
		}
		.txt {
			font-size: 32rpx;
			font-weight: 500;
			color: rgba(144, 147, 153, 1);
			margin-top: 20rpx;
		}
	}
	.wrapper {
		position: relative;
		z-index: 90;
		/* padding-bottom: 40rpx; */
		margin-top: 80rpx;
		.tabbar {
			padding-top: 22rpx;
			display: flex;
			border-bottom: 2rpx solid #DBDBDB;
			.tab {
				flex: 1;
				display: flex;
				justify-content: center;
				text {
					font-size: 32rpx;
					color: rgba(144, 147, 153, 1);
					font-weight: 400;
					line-height: 88rpx;
				}
				text.active {
					color: rgba(48, 49, 51, 1);
					border-bottom: 4rpx solid #F23D3D;
				}
			}
		}
	}
	.back-btn {
		position: absolute;
		left: 40rpx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40rpx;
		font-size: 40rpx;
		color: $font-color-dark;
	}
	.left-top-sign {
		font-size: 80rpx;
		font-weight: bold;
		color: $page-color-base;
		position: relative;
		left: 60rpx;
	}
	.right-top-sign {
		position: absolute;
		top: 80rpx;
		right: -30rpx;
		z-index: 95;
		&:before,
		&:after {
			display: block;
			content: "";
			width: 400rpx;
			height: 80rpx;
			background: #b4f3e2;
		}
		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
		&:after {
			position: absolute;
			right: -198rpx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	.left-bottom-sign {
		position: absolute;
		left: -270rpx;
		bottom: -320rpx;
		border: 100rpx solid #d0d1fd;
		border-radius: 50%;
		padding: 180rpx;
	}
	.welcome {
		position: relative;
		left: 50rpx;
		top: -90rpx;
		font-size: 46rpx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}
	.input-content {
		/* margin-top: 80rpx; */
		padding: 0 48rpx 0;
		.oAuthIcon {
			width: 80rpx;
			height: 80rpx;
		}
	}
	.input-item {
		display: flex;
		align-items: center;
		/* flex-direction: column; */
		/* align-items:flex-start;
		justify-content: center; */
		/* padding: 25rpx; */
		/* background:$page-color-light; */
		height: 120rpx;
		
		margin-bottom: 50rpx;
		border-bottom: 4rpx solid #DBDBDB;
		.stext {
			color: #F23D3D;
			border: 2rpx solid #F23D3D;
			border-radius: 30rpx;
			font-size: 24rpx;
			min-width: 200rpx;
			margin: 0;
			text-align: center;
			padding: 10rpx 16rpx;
		}
		&:last-child {
			margin-bottom: 0;
		}
		.icon {
			/* height: 50rpx; */
			/* line-height: 56rpx; */
			height: 48rpx;
			width: 48rpx;
			margin-right: 14rpx;
			/* font-size: $font-sm+2rpx;
			color: $font-color-base; */
		}
		input {
			height: 60rpx;
			font-size: $font-base + 2rpx;
			color: $font-color-dark;
			width: 100%;
		}
	}
	.input-item.input-item1 {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		.left {
			display: flex;
			align-items: center;
			/* flex-direction: column; */
		}
	}
	.confirm-btn {
		width: 630rpx;
		height: 76rpx;
		line-height: 76rpx;
		border-radius: 50px;
		margin-top: 90rpx;
		background: #F23D3D;
		color: #fff;
		font-size: $font-lg;
		&:after {
			border-radius: 100px;
		}
	}
	.forget-section {
		font-size: $font-sm+2rpx;
		color: #C0C4CC;
		text-align: center;
		margin-top: 40rpx;
	}
	.forget-section2 {
		display: flex;
		justify-content: space-between;
		margin-top: -20rpx;
		.register {
			color: #F23D3D;
			margin-left: 10rpx;
		}
		.forget {
			text-align: right;
			color: #F23D3D
		}
	}
	.register-section {
		position: absolute;
		left: 0;
		bottom: 50rpx;
		width: 100%;
		font-size: $font-sm+2rpx;
		color: $font-color-base;
		text-align: center;
		text {
			color: $font-color-spec;
			margin-left: 10rpx;
		}
		.rscen {
			margin-left: 20rpx;
			margin-right: 20rpx;
		}
	}
	.tipBox {
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		padding: 0 75rpx;
		z-index: 101;
		.txt {
			margin: 116rpx 0 50rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 600;
			color: rgba(48, 49, 51, 1);
		}
		.back {
			height: 80rpx;
			border-radius: 40px;
			border: 2rpx solid rgba(242, 61, 61, 1);
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 500;
			color: rgba(242, 61, 61, 1);
			width: 100%;
			margin-bottom: 110rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.wxLogin {
		margin-top: 180rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		.wxIcon {
			width: 90rpx;
			height: 90rpx;
		}
		text {
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(144, 147, 153, 1);
			margin-top: 16rpx;
		}
	}
</style>