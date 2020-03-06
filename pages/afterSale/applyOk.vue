<template>
	<view class="sWrap">
		<view class="sak-box">
			<text class="success-icon iconfont iconchenggong"></text>
			<view class="sak-box-text1">申请成功</view>
			<view class="sak-box-text2">请等待客服处理</view>
		</view>
		<view class="sor-btn">
			<view class="sor-btn-cont" @tap="toOrder4">查看售后订单</view>
		</view>
	</view>
</template>

<script>
export default{
	methods:{
		toOrder4(){
			uni.navigateTo({
				url:"/pages/order/order?state=4"
			})
		}
	},
	onBackPress(e){
		uni.navigateTo({
			url:"/pages/order/order?state=4"
		})
		return true
	}
}
</script>

<style lang="scss" scoped>
.sWrap{
	min-height: calc(100vh - 88rpx);
	background-color: #fff;
	.sak-box{
		text-align: center;
		padding: 100rpx;
		.iconchenggong{
			font-size: 160rpx;
			color: #F23D3D;
		}
		.sak-box-text1{
			font-size: 38rpx;
			color: #303133;
		}
		.sak-box-text2{
			margin-top: 20rpx;
			color: #303133;
			font-size: 30rpx;
		}
	}
	.sor-btn{
		background-color: #F9FAFB;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 40rpx 32rpx;
		.sor-btn-cont{
			line-height: 80rpx;
			background-color: #F23D3D;
			text-align: center;
			color: #fff;
			border-radius: 40rpx;
			font-size: 30rpx;
		}
	}
}
</style>
