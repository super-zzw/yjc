<template>
	<view class="sWrap">
		<view
			class="iconfont iconchenggong checkbox"
		></view>
		<view class="ssuccess">注册成功</view>
		<view class="tinde" @tap="toPage('/pages/public/login')">去登录</view>
		<view class="tlogin" @tap="toTab('/pages/index/index')">返回首页</view>
	</view>
</template>

<script>
	export default{
		methods:{
			toPage(url){
				uni.navigateTo({
					url:url
				})
			},
			toTab(url){
				uni.switchTab({
					url:url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sWrap{
		min-height: 100vh;
		background-color: #fff;
		text-align: center;
		padding-left: 32rpx;
		padding-right: 32rpx;
		.iconfont{
			padding-top: 120rpx;
			color:#F23D3D;
			font-size: 180rpx;
		}
		.ssuccess{
			
		}
		.tinde{
			line-height: 88rpx;
			background-color: #F23D3D;
			color: #Fff;
			font-size: 30rpx;
			border-radius: 44rpx;
			margin-top: 120rpx;
			text-align: center;
		}
		.tlogin{
			line-height: 88rpx;
			font-size: 30rpx;
			border-radius: 44rpx;
			margin-top: 30rpx;
			text-align: center;
			border: 2rpx solid gray;
		}
	}
</style>
