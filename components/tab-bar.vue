<template>
	<view class="tabBar">
		<view class="tabItem" @tap="toPath('/pages/index/index',0)" v-if="config && config.MALL_HOMW_SWAITCH.navHomeFlag == 1">
			<image class="tabImg" src="/static/tab-home-current.png" mode="" v-if="current == 0"></image>
			<image class="tabImg" src="/static/tab-home.png" mode="" v-else></image>
			<view class="tiText" :class="current == 0 ? 'activeText' : ''">首页</view>
		</view>
		<view class="tabItem" @tap="toPath('/pages/category/category',1)" v-if="config && config.MALL_HOMW_SWAITCH.navSubjectFlag == 1">
			<image class="tabImg" src="/static/tab-cate-current.png" mode="" v-if="current == 1"></image>
			<image class="tabImg" src="/static/tab-cate.png" mode="" v-else></image>
			<view class="tiText" :class="current == 1 ? 'activeText' : ''">分类</view>
		</view>
		<view class="tabItem tabItem2" @tap="toPath('/pages/cart/cart',2)" v-if="config && config.MALL_HOMW_SWAITCH.navCartFlag == 1">
			<image class="tabImg" src="/static/tab-cart-current.png" mode="" v-if="current == 2"></image>
			<image class="tabImg" src="/static/tab-cart.png" mode="" v-else></image>
			<view class="tiText" :class="current == 2 ? 'activeText' : ''">购物车</view>
			<text class="cartNm" v-if="cartNms > 0 && cartNms < 10">{{cartNms}}</text>
			<text class="cartNm" v-if="cartNms > 9">9+</text>
		</view>
		<view class="tabItem" @tap="toPath('/pages/user/user',3)" v-if="config && config.MALL_HOMW_SWAITCH.navUserFlag == 1">
			<image class="tabImg" src="/static/tab-my-current.png" mode="" v-if="current == 3"></image>
			<image class="tabImg" src="/static/tab-my.png" mode="" v-else></image>
			<view class="tiText" :class="current == 3 ? 'activeText' : ''">个人</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default{
		props:{
			current:{
				default:0,
				type:Number
			}
		},
		computed:{
			...mapState(['config','cartNms'])
		},
		methods:{
			toPath(url,tab){
				if(tab == this.current){
					return
				}else{
					uni.reLaunch({
						url
					})
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.tabBar{
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	display: flex;
	background-color: #fafafa;
	display: flex;
	z-index: 9999;
	justify-content: space-around;
	height: 100rpx;
	box-sizing: border-box;
	border-top: 2rpx solid rgba(0, 0, 0, 0.33);
	.tabItem{
		display: block;
		text-decoration: none!important;
		text-align: center;
		margin-top: 10rpx;
		.tabImg{
			width: 48rpx;
			height: 48rpx;
		}
		.tiText{
			font-size: 20rpx;
			margin-top: -6rpx;
			color: #909399;
		}
		.activeText{
			color: #f23d3d;
		}
	}
	.tabItem2{
		position: relative;
		.cartNm{
			position: absolute;
			right: -20rpx;
			top: -6rpx;
			background-color: #f23d3d;
			color: #fff;
			font-size: 20rpx;
			display: inline-block;
			padding: 2rpx 8rpx;
			border-radius: 20rpx;
			transform: scale(0.8);
			width: 40rpx;
			height: 40rpx;
			text-align: center;
			line-height: 40rpx;
		}
	}
}
</style>
