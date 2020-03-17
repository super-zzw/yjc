<template>  
    <view class="container">  
		<!-- #ifdef MP-WEIXIN -->
		<wxTabbar :showSearch="-1" :topbgk="topbgk"></wxTabbar>
		<!-- #endif -->
		<view class="user-section">
			<image class="bg" src="/static/user-bg.png"></image>
			<view class="user-section-asd">
				<view class="user-info-box">
					<view class="portrait-box">
						<!-- <image class="portrait" :src="userInfo.portrait || '/static/missing-face.png'"></image> -->
						<image class="portrait" :src="userInfo.icon || '/static/missing-face.png'"></image>
					</view>
					<view class="info-box">
						<text class="username">{{userInfo.wusername || '游客'}}</text>
						<view class="user-star" v-if="hasLogin">
							<image src="/static/star.png" mode="widthFix" v-for="item in userInfo.level" :key="item"></image>
						</view>
					</view>
				</view>
				<view class="user-more" @tap="toUserInfo('/pages/userinfo/userinfo')">
					<text class="iconfont iconright"></text>
				</view>
			</view>
		</view>
		
		<view class="cover-container" >
			<image class="arc" src="/static/arc.png"></image>
			
			<view class="tj-sction" @tap="navTo('/pages/order/order?state=0')">
				<view class="tj-sction-title">我的订单</view>
				<view class="tj-sction-icon">
					查看全部
					<text class="iconfont iconright"></text>
				</view>
			</view>
			<!-- 订单 -->
			<view class="order-section">
				<view class="order-item" @click="navTo('/pages/order/order?state=1')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="iconfont icondaifukuan2 icon1"></text>
					<text>待付款</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=2')"  hover-class="common-hover" :hover-stay-time="50">
					<text class="iconfont iconfahuo icon2"></text>
					<text>待发货</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=3')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="iconfont iconyunshu icon3"></text>
					<text>待收货</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=4')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="iconfont icontuikuan icon4"></text>
					<text>退款/售后</text>
				</view>
			</view>
			<!-- 浏览历史 -->
			<view class="history-section icon">
				<view class="" @tap="navTo('/pages/address/address?source=2')">
					<list-cell iconfont="iconfont icondizhi" iconColor="#5ECDA2" title="地址管理" tips=" "></list-cell>
				</view>
				<view class="" @tap="navTo('/pages/collect/collect')">
					<list-cell iconfont="iconfont iconshoucang2" iconColor="#53B4EF" title="我的收藏"  tips=" "></list-cell>
				</view>
				<view class="" @tap="navTo('/pages/history/history')">
					<list-cell iconfont="iconfont iconlishi" iconColor="#5DBA8F" title="浏览历史"  tips=" "></list-cell>
				</view>
				<view class="" @tap="navTo('/pages/integral/integral')">
					<list-cell iconfont="iconfont iconjifen" iconColor="#EE883B" title="我的积分"  tips=" "></list-cell>
				</view>
				<view class="" @tap="navTo('/pages/order/myAssess')">
					<list-cell iconfont="iconfont iconpingjia" iconColor="#F852C3" title="我的评价"  tips=" "></list-cell>
				</view>
				<view class="" @tap="navTo('/pages/integral/record')">
					<list-cell iconfont="iconfont iconduihuan" iconColor="#F7CA20" title="积分兑换记录"  tips=" "></list-cell>
				</view>
				<view class="" @tap="navTo('/pages/invite/invite')">
					<list-cell class="last-list" iconfont="iconfont iconyaoqinghaoyou" iconColor="#9689F7" title="邀请好友"  tips=" "></list-cell>
				</view>
			</view>
			<!-- <view class="submit" v-if="hasLogin" @tap="loginOut">退出登录</view> -->
		</view>
    </view>  
</template>  
<script>  
	import listCell from '@/components/mix-list-cell';
    import {  
        mapState,mapMutations
    } from 'vuex';
	import utils from 'utils/method.js'
    export default {
		components: {
			listCell
		},
		data(){
			return {
				topbgk:"transparent"
			}
		},
		async onShow(){
			if(this.hasLogin){
				await this.getUserInfo()
				this.getCartNms();  //获取购物车数量
			}
			utils.setBadgeText(0,this.msgNms)
		},
        computed: {
			...mapState(['hasLogin','userInfo','msgNms']),
		},
        methods: {
			...mapMutations(['setUserInfo','setAfterLoginUrl','setAfterLoginIsTab']),
			getCartNms(){
				this.$http({
					apiName:"getCartNms"
				}).then(res => {
					if(res.data > 0){
						uni.setTabBarBadge({
						  index: 2,
						  text: String(res.data)
						})
					}else{
						uni.removeTabBarBadge({
							index: 2,
						})
					}
				}).catch(_ => {})
			},
			//获取用户信息
			async getUserInfo(){
				await this.$http({
					apiName:"getUserInfo"
				}).then(res => {
					this.setUserInfo(res.data)
				}).catch(_ => {})
			},
			// //退出登录
			// async loginOut(){
			// 	await this.$http({
			// 		apiName:"logOut"
			// 	}).then(res => {
			// 		utils.rmData()
			// 		uni.showToast({
			// 			title:"退出成功"
			// 		})
			// 	}).catch(_ => {})
			// },
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url){
				if(!this.hasLogin){
					this.setAfterLoginUrl(url)
					// #ifdef MP-WEIXIN
					url = "/pages/wxlogin/index"
					// #endif
					// #ifndef MP-WEIXIN
					url = '/pages/public/login';
					// #endif
				}
				uni.navigateTo({  
					url
				})  
			}, 
			toUserInfo(url){
				if(!this.hasLogin){
					this.setAfterLoginUrl('/pages/index/index')
					this.setAfterLoginIsTab(true)
					// #ifdef MP-WEIXIN
					uni.navigateTo({
						url:"/pages/wxlogin/index"
					})
					// #endif
					// #ifndef MP-WEIXIN
					uni.navigateTo({
						url:"/pages/public/login"
					})
					// #endif
					
				}else{
					uni.navigateTo({
						url
					})
				}
				
			}
        },
		onNavigationBarButtonTap(e) {
			const index = e.index;
			// #ifdef APP-PLUS
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			const currentWebview = page.$getAppWebview();
			currentWebview.hideTitleNViewButtonRedDot({
				index
			});
			// #endif
			if (index === 0) {
				uni.navigateTo({
					url: '/pages/notice/index'
				})
			}else if(index === 1){
				uni.navigateTo({
					url: '/pages/set/set'
				})
			}
		},
		onPageScroll(e){
			if(e.scrollTop > 10){
				this.topbgk = "#f23d3d"
			}else{
				this.topbgk = "transparent"
			}
		}
    }  
</script>  
<style lang='scss'>
	%flex-center {
	 display:flex;
	 flex-direction: column;
	 justify-content: center;
	 align-items: center;
	}
	%section {
	  display:flex;
	  justify-content: space-around;
	  align-content: center;
	  background: #fff;
	}
	page{
		background: #F9FAFB;
	}
	.container{
		min-height: calc(100vh - 0);
		background: #F9FAFB;
		box-sizing: border-box;
	}
	.user-section{
		height: 420rpx;
		padding: 180rpx 30rpx 0;
		padding-bottom: 80rpx;
		position:relative;
		box-sizing: border-box;
		.user-section-asd{
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.user-more{
			padding: 40rpx;
			box-sizing: border-box;
			z-index: 9;
			.iconright{
				color: #f97d7a;
				font-size: 40rpx;
				font-weight: bold;
			}
		}
		.bg{
			position:absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
		}
	}
	.user-info-box{
		height: 180rpx;
		display:flex;
		align-items:center;
		position:relative;
		z-index: 1;
		.info-box{
			margin-left: 20rpx;
		}
		.portrait{
			width: 130rpx;
			height: 130rpx;
			border-radius: 50%;
		}
		.username{
			font-size: $font-lg + 6rpx;
			color: #fff;;
		}
		.user-star{
			margin-top: 12rpx;
			image{
				width: 28rpx;
				height: auto;
			}
		}
	}

	.vip-card-box{
		display:flex;
		flex-direction: column;
		color: #f7d680;
		height: 240rpx;
		background: linear-gradient(to left, rgba(0,0,0,.7), rgba(0,0,0,.8));
		border-radius: 16rpx 16rpx 0 0;
		overflow: hidden;
		position: relative;
		padding: 20rpx 24rpx;
		.card-bg{
			position:absolute;
			top: 20rpx;
			right: 0;
			width: 380rpx;
			height: 260rpx;
		}
		.b-btn{
			position: absolute;
			right: 20rpx;
			top: 16rpx;
			width: 132rpx;
			height: 40rpx;
			text-align: center;
			line-height: 40rpx;
			font-size: 22rpx;
			color: #36343c;
			border-radius: 20px;
			background: linear-gradient(to left, #f9e6af, #ffd465);
			z-index: 1;
		}
		.tit{
			font-size: $font-base+2rpx;
			color: #f7d680;
			margin-bottom: 28rpx;
		}
		.e-b{
			font-size: $font-sm;
			color: #d8cba9;
			margin-top: 10rpx;
		}
	}
	.cover-container{
		background: #F9FAFB;
		margin-top: 0;
		padding: 0 30rpx;
		position:relative;
		padding-bottom: 20rpx;
		.arc{
			position:absolute;
			left: 0;
			top: -34rpx;
			width: 100%;
			height: 36rpx;
		}
	}
	.tj-sction{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		border-bottom: 2rpx solid #DBDBDB;
		padding: 28rpx;
		border-radius: 10rpx 10rpx 0 0;
		.tj-sction-title{
			color: #303133;
			font-weight: bold;
			font-size: 28rpx;
		}
		.tj-sction-icon{
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: #C0C4CC;
		}
	}
	.order-section{
		@extend %section;
		padding: 28rpx 0;
		border-radius: 0 0 10rpx 10rpx;
		.order-item{
			@extend %flex-center;
			width: 120rpx;
			height: 120rpx;
			border-radius: 10rpx;
			font-size: $font-sm;
			color: $font-color-dark;
		}
		.iconfont{
			color: #f23d3d;
			margin-bottom: 20rpx;
			height: 50rpx;
		}
		.iconfont,
		.icon1{
			font-size: 50rpx;
		}
		.icon2{
			font-size: 42rpx;
		}
		.icon3{
			font-size: 54rpx;
		}
		.icon4{
			font-size: 48rpx;
		}
		.icon-shouhoutuikuan{
			font-size:44rpx;
		}
	}
	.history-section{
		padding: 30rpx 0 0;
		margin-top: 20rpx;
		background: #fff;
		border-radius:10rpx;
		.sec-header{
			display:flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40rpx;
			margin-left: 30rpx;
		}
		.h-list{
			white-space: nowrap;
			padding: 30rpx 30rpx 0;
			image{
				display:inline-block;
				width: 160rpx;
				height: 160rpx;
				margin-right: 20rpx;
				border-radius: 10rpx;
			}
		}
		.last-list{
			/deep/ .mix-list-cell:after{
				border-bottom: none;
			}
		}
	}
	.submit{
		margin-top: 16rpx;
		border: 2rpx solid #F23D3D;
		border-radius: 10rpx;
		text-align: center;
		line-height: 64rpx;
		color: #F23D3D;
		font-size: 28rpx;
	}
	
</style>