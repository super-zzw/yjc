<template>
	<view class="container">
		<view class="list-cell b-b m-t" @click="toPage('/pages/userinfo/userinfo?from=set',true)" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">个人资料</text>
			<text class="cell-more iconfont iconchakanquanbu"></text>
		</view>
		<view class="list-cell b-b " @click="toPage('/pages/address/address?from=set',true)" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">收货地址</text>
			<text class="cell-more iconfont iconchakanquanbu"></text>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="list-cell b-b m-t" @click="bindWx" hover-class="cell-hover" :hover-stay-time="50" v-if="hasLogin">
			<text class="cell-tit">绑定微信</text>
			<view class="cell-more" >
				<text>{{userInfo.appBindExFlag?'解绑':'未绑定'}}</text>
				<text class="cell-more iconfont iconchakanquanbu"></text>
			</view>
		</view>
		<!-- #endif -->
		
		
		<view class="list-cell b-b " @click="toPage('/pages/set/payPwd',true)" hover-class="cell-hover" :hover-stay-time="50" v-if="hasLogin">
			<text class="cell-tit">支付密码</text>
			<view class="cell-more">
				<text>{{userInfo.payPwdFlag?'重置密码':'未设置'}}</text>
				<text class=" iconfont iconchakanquanbu"></text>
			</view>
		</view>
		<view class="list-cell b-b m-t" @click="clearCache" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">清除缓存</text>
			<text class="cell-tip">{{cache}}</text>
			<text class="cell-more iconfont iconchakanquanbu"></text>
		</view>
		<view class="list-cell b-b " @click="toAbout" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">关于 易聚财</text>
			<text class="cell-more iconfont iconchakanquanbu"></text>
		</view>
		<!-- <view class="list-cell b-b" @click="toPage('/pages/set/changePwd',true)" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">修改密码</text>
			<text class="cell-more iconfont iconchakanquanbu"></text>
		</view>
		<view class="list-cell b-b" @click="toPage('/pages/set/changePhone',true)" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">修改绑定手机号</text>
			<text class="cell-more iconfont iconchakanquanbu"></text>
		</view>
		<view class="list-cell b-b" @click="toAbout" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">关于{{config.MALL_APP_NAME}}</text>
			<text class="cell-more iconfont iconchakanquanbu"></text>
		</view> -->
		<!-- #ifdef APP-PLUS -->
		<view class="list-cell" @tap="updateV">
			<text class="cell-tit">检查更新</text>
			<text class="cell-tip" v-if="version">当前版本 {{version}}</text>
			<text class="cell-more iconfont iconchakanquanbu"></text>
		</view>
		<!-- #endif -->
		<view class="list-cell log-out-btn" @click="loginOut" v-if="hasLogin">
			<text class="cell-tit">退出登录</text>
		</view>
		<view class="list-cell log-out-btn" @click="toPage('/pages/public/login')" v-else>
			<text class="cell-tit">账号登录</text>
		</view>
	</view>
</template>

<script>
	import {  
	    mapMutations,mapState
	} from 'vuex';
	import utils from 'utils/method.js'
	export default {
		data() {
			return {
				cache:0,
				version:""
			};
		},
		computed:{
			...mapState(['hasLogin','config','userInfo'])
		},
		onLoad() {
			// #ifdef APP-PLUS
			this.version = plus.runtime.version
			// #endif
		},
		methods:{
			...mapMutations(['setLogin','setAfterLoginUrl']),
			updateV(){
				// #ifdef APP-PLUS
				this.$checkUpdate(true);
				// #endif
			},
			toAbout(){
				uni.navigateTo({
					url:"/pages/public/about"
				})
			},
			toPage(url,needLogin){
				if(needLogin && !this.hasLogin){
					this.setAfterLoginUrl(url);
					url = "/pages/public/login"
				} 
				uni.navigateTo({
					url:url
				})
			},
			bindWx(){
				// console.log(this.userInfo.payPwdFlag)
				if(!this.hasLogin){
					// this.setAfterLoginUrl(url);
					uni.navigateTo({
						url:"/pages/public/login"
					})
				}else{
					if(this.userInfo.appBindExFlag){
						uni.showModal({
							title:'提示',
							content:'确定解绑微信号?',
							success:(res)=>{
								if(res.confirm){
									this.$http({
										apiName:'removeWx',
										type:'POST'
									}).then(res=>{
										uni.showToast({
											title:'解绑成功'
										})
										utils.getUserInfo()
									}).catch(err=>{})
								}
							}
						})
						return
					}else{
					
						uni.login({
							provider: 'weixin',
							success: (res) => {
								uni.getUserInfo({
									provider: 'weixin',
									success: (info) => {
										uni.setStorageSync('appInfo', info.userInfo)
										console.log(info.userInfo)
										this.$http({
											apiName: 'appWxLogin',
											type: 'POST',
											data: {
												appOpenId: info.userInfo.openId,
												headUrl: info.userInfo.avatarUrl,
												wuserName: info.userInfo.nickName
											}
										}).then(res => {
											console.log(res)
											uni.showToast({
												title: '绑定成功',
												mask: false,
												duration: 1500,
												
											});
											utils.getUserInfo()
											uni.navigateTo({
												url:'/pages/set/set'
											})
											
										}).catch(err => {
											
											if(err.code==500070){
												uni.redirectTo({
												       url:'../public/bindMobile'
											   })
											}else{
												uni.redirectTo({
										              url:'../set/loginPwd'
												})
											}
											
										})
									}
								})
							}
						})
					}
				}
			},
			loginOut(){
				var that = this
				uni.showModal({
					title: '提示',
					content: '确认退出登录？',
					success: function (res) {
						if (res.confirm) {
							that.loginOutOk()
						}
					}
				})
			},
			//确认退出登录
			async loginOutOk(){
				await this.$http({
					apiName:"logOut"
				}).then(res => {
					utils.rmData()
					uni.showToast({
						title:"退出成功"
					})
					setTimeout(_ => {
						uni.switchTab({
						// uni.reLaunch({
							url:"/pages/index/index"
						})
					},2000)
				}).catch(_ => {})
			},
			toArticle(id){
				uni.navigateTo({
					url:"/pages/article/article?id=" + id
				})
			},
			//计算缓存大小
			caching(){
				if (window.plus) {  
					plusReady();  
				}else {  
					document.addEventListener('plusready', plusReady, false);  
				}
				function plusReady(){
					plus.cache.calculate( function ( size ) {
						if (size == 0) {
							fileSizeString = "0B";
						} else if (size < 1024) {
							fileSizeString = size + "B";
						} else if (size < 1048576) {
							fileSizeString = (size / 1024).toFixed(2) + "KB";
						} else if (size < 1073741824) {
							fileSizeString = (size / 1048576).toFixed(2) + "MB";
						} else {
							fileSizeString = (size / 1073741824).toFixed(2) + "GB";
						}
						this.cache = fileSizeString
					});
				}
			},
			//清除缓存
			clearCache(){
				if (window.plus) {  
					plusReady();  
				}else {  
					document.addEventListener('plusready', plusReady, false);  
				}
				
				function plusReady(){
					plus.cache.clear(function () {
						uni.showToast({
							title:"清除成功"
						})
					});
				}
			},
			//检查更新
			
		},
		onBackPress(e){
			uni.switchTab({
			// uni.reLaunch({
				url:"/pages/user/user"
			})
			return true
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20rpx $page-row-spacing;
		line-height:60rpx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40rpx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30rpx;
		}
		&.m-t{
			margin-top: 16rpx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10rpx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2rpx;
			color: $font-color-dark;
			margin-right:10rpx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16rpx) scale(.84);
		}
	}
</style>
