<template>
	<view class="content">
		<text class="success-icon iconfont iconchaping"></text>
		<text class="tit">支付失败</text>
		
		<view class="btn-group">
			<navigator url="/pages/order/order?state=0" open-type="redirect" class="mix-btn">重新支付</navigator>
			<!-- <navigator url="/pages/index/index" open-type="switchTab" class="mix-btn hollow">返回首页</navigator> -->
			<navigator url="/pages/index/index" open-type="reLaunch" class="mix-btn hollow">返回首页</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		onBackPress(e){
			// uni.switchTab({
			uni.reLaunch({
				url:"/pages/order/order"
			})
			return true
		}
	}
</script>

<style lang='scss'>
	.content{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.success-icon{
		font-size: 160rpx;
		color: #fa436a;
		margin-top: 100rpx;
	}
	.tit{
		font-size: 38rpx;
		color: #303133;
	}
	.btn-group{
		padding-top: 100rpx;
	}
	.mix-btn {
		margin-top: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600rpx;
		height: 80rpx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10rpx;
		&.hollow{
			background: #fff;
			color: #303133;
			border: 1px solid #ccc;
		}
	}
</style>
