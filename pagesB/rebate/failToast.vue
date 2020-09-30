<template>
	<view class="content flex  flex-column align-items">
		<image src="https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/fail.png" mode=""></image>
		<view class="title">提交失败</view>
		
		<button class="backBtn" @tap="back" >重新提交</button>
		<button class="again" @tap="backIndex">返回首页</button>
	</view>
</template>

<script>
	export default{
		data(){
			return{}
		},
		methods:{
			backIndex(){
				uni.switchTab({
				// uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			back(){
				uni.navigateBack();
			}
		}
	}
</script>

<style scoped lang="scss">
	
	image{
		margin: 148rpx 0 24rpx 0;
		width: 140rpx;
		height: 140rpx;
	}
	.title{
		font-size: 32rpx;
		color: #464748;
		line-height: 44rpx;
		font-weight: bold;
	}
	.backBtn{
		width: 600rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		background: #F23D3D;
		color: #ffffff;
		font-size: 30rpx;
		font-weight: 400;
		margin: 128rpx 0 40rpx 0;
	}
	.again{
		width: 600rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		border:2rpx solid rgba(151,151,151,1);
		color: #606266;
		font-size: 30rpx;
		font-weight: 400;
		background-color: #FFFFFF;
		box-sizing: border-box;
		outline: 0;
	}
</style>
