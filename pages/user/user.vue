<template>  
    <view class="container">  
		<!-- <tabBar :current="3"></tabBar> -->
		<!-- #ifdef MP-WEIXIN -->
		<wxTabbar :showSearch="-1" :topbgk="topbgk"></wxTabbar>
		<!-- #endif -->
		<view class="user-section" v-if="config">
			<image class="bg" src="https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/user-bg.png"></image>
			<view class="user-section-asd">
				<view class="user-info-box">
					<view class="user-info-box-left">
						<view class="portrait-box">
							<!-- <image class="portrait" :src="userInfo.portrait || 'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/missing-face.png'"></image> -->
							<image v-if="hasLogin" class="portrait" :src="userInfo.icon"></image>
							<image v-else class="portrait" src="https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/missing-face.png"></image>
						</view>
						<view class="info-box" @tap="toUserInfo('/pages/userinfo/userinfo')">
							<view v-if="hasLogin" class="username">{{userInfo.wusername}} <text class="iconfont iconright"></text></view>
							<view v-else class="username">游客 <text class="iconfont iconright"></text></view>
							
							<view class="user-star" v-if="hasLogin">
								<image src="https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/star.png" mode="widthFix" v-for="item in userInfo.level" :key="item"></image>
							</view>
						</view>
					</view>
					<!-- #ifndef APP-PLUS -->
					<view class="signIn"  v-if="hasLogin && hasSigin" @tap="navTo(`/pages/integral/integral`)">每日签到</view>
					<!-- #endif -->
					
				</view>
<!-- 				<view class="user-more" >
					
				</view> -->
			</view>
		</view>
		
		<view class="cover-container"  v-if="config">
			<image class="arc" src="https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/arc.png"></image>
			
			<view class="tj-sction" @tap="navTo('/pages/order/order?state=0')">
				<view class="tj-sction-title">我的订单</view>
				<view class="tj-sction-icon">
					查看全部
					<text class="iconfont iconchakanquanbu"></text>
				</view>
			</view>
			<!-- 订单 -->
			<view class="order-section">
				<view class="order-item" @click="navTo('/pages/order/order?state=1')" hover-class="common-hover"  :hover-stay-time="50">
					
					<image src="../../static/user/daifukuan.png" mode="" class="icon"></image>
					<text>待付款</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=2')"  hover-class="common-hover" :hover-stay-time="50">
					<image src="../../static/user/daifahuo.png" mode="" class="icon"></image>
					<text>待发货</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=3')" hover-class="common-hover"  :hover-stay-time="50">
					<image src="../../static/user/yifahuo.png" mode="" class="icon"></image>
					<text>已发货</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=4')" hover-class="common-hover"  :hover-stay-time="50">
					<image src="../../static/user/shouhou.png" mode="" class="icon"></image>
					<text>退款/售后</text>
				</view>
			</view>
			
			<view class="my-section" @tap="navTo('/pages/account/index?type=0')" v-if="hasLogin">
				<text class="left">我的账户</text>
				<view class="right">
					<text class="txt1">账户余额</text>
					<text class="txt2">¥{{userInfo.yjcBalance}}</text>
					<image src="../../static/user/arrow.png" mode="" class="txt3"></image>
				</view>
			</view>
			
			<view class="my-section sec1" @tap="navTo('/pages/account/index?type=1')" v-if="hasLogin">
				<text class="left">我的聚财卡</text>
				<view class="right">
					<text class="txt1">账户余额</text>
					<text class="txt2">¥{{userInfo.yjcCardBalance}}</text>
					<image src="../../static/user/arrow.png" mode="" class="txt3"></image>
				</view>
			</view>
			
			<!-- 浏览历史 -->
			<view class="history-section icon">
				<view class="hsitem" @tap="navTo('/pages/address/address?source=2')">
					<!-- <text class="iconfont icondizhi"></text> -->
					<image src="../../static/user/address.png" class="icon"></image>
						<text class="itemBoxText">地址管理</text>
						
					
				</view>
				<view class="hsitem" @tap="navTo('/pages/collect/collect')">
						<image src="../../static/user/collect.png" class="icon"></image>
						<text class="itemBoxText">我的收藏</text>
						
					
				</view>
				<view class="hsitem" @tap="navTo('/pages/history/history')">
					<image src="../../static/user/history.png" class="icon"></image>
						<text class="itemBoxText">浏览历史</text>
						
				</view>
				<view class="hsitem" @tap="navTo('/pages/myBill/index')" v-if="hasScore">
					<image src="../../static/user/zhangdan.png" class="icon"></image>
						<text class="itemBoxText">我的账单</text>
						
				</view>
				<view class="hsitem" @tap="navTo('/pages/order/myAssess')">
				  <image src="../../static/user/myAssess.png" class="icon"></image>
						<text class="itemBoxText">我的评价</text>
						
				</view>
				<!-- <view class="hsitem" @tap="navTo('/pagesC/invite/invite')" v-if="hasScore">
					 <image src="../../static/user/invite.png" class="icon"></image>
						<text class="itemBoxText">邀请好友</text>
						
				</view> -->
			<!-- 	<view class="hsitem" @tap="navTo('/pagesF/myStore/index')">
				    <image src="../../static/user/chuzhi.png" class="icon"></image>
						<text class="itemBoxText">我的储值</text>
					
				</view> -->
				<view class="hsitem" @tap="navTo('/pages/account/accountSel')">
			        <image src="../../static/user/bank.png" class="icon"></image>
						<text class="itemBoxText">银行卡</text>
					
				</view>
				<view class="hsitem" @tap="navTo('/pages/coupons/index')"
				v-if="config.USERINFO_VIEW_MENU.couponFlag">
				    <image src="../../static/user/youhuijuan.png" class="icon"></image>
						<text class="itemBoxText">优惠券</text>
					
				</view>
			<!-- 	<view class="hsitem" @tap="navTo('/pagesE/distribution/index')">
				    <image src="../../static/user/fenxiao.png" class="icon"></image>
						<text class="itemBoxText">分销中心</text>
					
				</view>
				<view class="hsitem" @tap="navTo('/pagesF/myStore/index')">
				    <image src="../../static/user/chuzhi.png" class="icon"></image>
						<text class="itemBoxText">我的储值</text>
					
				</view> -->
			</view>
			<view class="submit" v-if="hasLogin" @tap="loginOut">退出登录</view>
		</view>
    </view>  
</template>  
<script> 
    import {  
        mapState,mapMutations
    } from 'vuex';
	import utils from 'utils/method.js'
	import tabBar from "@/components/tab-bar.vue"
    export default {
		onShareAppMessage(){
			return utils.homeShare({})
		},
		components: {
			tabBar
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
	            this.$getMsgNms()
			}
			// utils.setBadgeText(0,this.msgNms)
			
		},
        computed: {
			...mapState(['hasLogin','userInfo','msgNms','hasScore','hasSigin','config']),
		},
        methods: {
			...mapMutations(['setUserInfo','setAfterLoginUrl','setAfterLoginIsTab','setCartNms','setMsgNms']),
			getCartNms(){
				this.$http({
					apiName:"getCartNms"
				}).then(res => {
					if(res.data > 0){
						uni.setTabBarBadge({
						  index: 2,
						  text: String(res.data)
						})
						this.setCartNms(res.data)
					}else{
						this.setCartNms(0)
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
			//退出登录
			async loginOut(){
				this.$showModal({
				                concent: '确认退出登录吗?',
				                delCancel: false,
				                // confirmVal: '知道了',
				                align: 'center'
				            }).then(res => {
				                  this.$http({
				                  				apiName:"logOut"
				                  			}).then(res => {
				                  				utils.rmData()
				                  				this.setCartNms(0)
				                  				utils.setBadgeText(0,'')
				                  				this.setMsgNms(0)
				                  				// this.$getMsgNms()
				                  				uni.removeTabBarBadge({
				                  					index: 2,
				                  				})
				                  				uni.showToast({
				                  					title:"退出成功"
				                  				})
				                  			}).catch(_ => {})
				            })
				
				
			},
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url,needInfo){
				if(!this.hasLogin){
					this.setAfterLoginUrl(url)
					if(needInfo){
						this.setAfterLoginIsTab(true)
						this.setAfterLoginUrl("/pages/user/user");
					}
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
					url: '/pagesD/notice/index'
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
<style lang='scss' scoped>
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
		/* background: #F9FAFB; */
	}
	.container{
		/* min-height: calc(100vh - 0); */
		background: #F9FAFB;
		box-sizing: border-box;
	}
	.user-section{
	height: 420rpx;
			padding: 180rpx 32rpx 0 56rpx;
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
			left: -2rpx;
			top: 0;
			width: 101%;
			height: 100%;
		}
	}
	.user-info-box{
		height: 180rpx;
		display:flex;
		align-items:center;
		justify-content: space-between;
		position:relative;
		width: 100%;
		z-index: 1;
		.user-info-box-left{
			display: flex;
			align-items: center;
		}
		.signIn{
			width: 176rpx;
			height: 60rpx;
			background: #F2A43D;
			border-radius: 200rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 30rpx;
			color: #FFFFFF;
		}
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
			.iconfont{
				margin-left: 14rpx;
			}
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
			.iconchakanquanbu{
				font-size: 10rpx;
				margin-left: 10rpx;
			}
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
		.icon{
			margin-bottom: 10rpx;
			height: 60rpx;
			width: 60rpx;
		}
		/* .iconfont{
			color: #f23d3d;
			margin-bottom: 20rpx;
			height: 50rpx;
		}
		.iconfont,
		.icon1{
			font-size: 60rpx;
		}
		.icon2{
			font-size: 60rpx;
		}
		.icon3{
			font-size: 60rpx;
		}
		.icon4{
			font-size: 60rpx;
		}
		.icon-shouhoutuikuan{
			font-size:44rpx;
		} */
	}
	.my-section{
		margin-top: 30rpx;
		background: #fff;
		padding:35rpx 28rpx 25rpx 32rpx;
		display: flex;
		justify-content: space-between;
		.left{
			font-size:28rpx;
			font-weight:600;
			color:rgba(48,49,51,1);
		}
		.right{
			display: flex;
			align-items: center;
			.txt1{
				font-size:24rpx;
				font-weight:600;
				color:rgba(74,75,76,1);
				margin-right: 20rpx;
			}
			.txt2{
				font-size:28rpx;
				font-weight:500;
				color:rgba(242,61,61,1);
				margin-right: 16rpx;
			}
			.txt3{
				width: 14rpx;
				height: 22rpx;
			}
		}
	}
	.my-section.sec1{
		margin-top: 0;
	}
	.history-section{
		margin-top: 20rpx;
		background: #fff;
		border-radius:10rpx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 20rpx 0;
		.hsitem{
			display: flex;
			width: 170rpx;
			height: 150rpx;
		    align-items: center;
			margin-right: 2rpx;
			.icon{
				width: 56rpx;
				height: 56rpx;
				margin-bottom: 12rpx;
			}
			
				/* flex: 1; */
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.itemBoxText{
					font-size: 28rpx;
					color: #4A4B4C;
				}
				
			
			
		}
		.hsitem:last-child .itemBox{
			border: none;
		}
		.icondizhi{
			color: #5ECDA2;
		}
		.iconshoucang2{
			color: #53B4EF;
		}
		.iconlishi{
			color: #5DBA8F;
		}
		.iconjifen{
			color: #EE883B;
		}
		.iconpingjia{
			color: #F852C3;
		}
		.iconduihuan{
			color: #F7CA20;
		}
		.iconyaoqinghaoyou{
			color: #9689F7;
		}
		.iconyaoqingfanliicon-gerenye{
			color: #ff488f;
		}
	}
	.submit{
		margin-top: 40rpx;
		border: 2rpx solid #F23D3D;
		border-radius: 40rpx;
		text-align: center;
		line-height: 80rpx;
		color: #F23D3D;
		font-size: 28rpx;
	}
	
</style>