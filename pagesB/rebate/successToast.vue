<template>
	<view class="content flex  flex-column align-items">
		<view class="imgs flex align-items justify-center">
			<image src="https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/success.png" mode="widthFix"></image>
		</view>
		<view class="title">提交成功</view>
		<text class="tips">你的提现申请将在客服审核通过后打款，请耐心等待</text>
		<button class="backBtn" @tap="backIndex">返回首页</button>
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
			}
		}
	}
</script>

<style scoped lang="scss">
	
	.imgs{
		width: 140rpx;
		height: 140rpx;
		background-image: linear-gradient(180deg,#FA7070,#F23D3D);
		border-radius: 50%;
		margin: 148rpx 0 24rpx 0;
		image{
			width: 72rpx;
			height: 52rpx;
		}
	}
	.title{
		font-size: 32rpx;
		color: #464748;
		line-height: 44rpx;
		font-weight: bold;
	}
	.tips{
		font-size: 28rpx;
		color: #909399;
		margin: 16rpx 0 72rpx 0;
		line-height: 40rpx;
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
	}
</style>
