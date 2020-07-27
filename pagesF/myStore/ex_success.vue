<template>
	<view class="container">
		<text class="iconfont iconchenggong"></text>
		<text class="txt1">储值卡兑换成功</text>
		<text class="txt2">储值卡已充值到我的储值余额</text>
		<navigator url="./index" hover-class="none" class="nav">查看我的储值</navigator>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
    .container{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 76rpx;
		.iconfont{
			font-size: 160rpx;
			color: #F23D3D;
			margin-top: 150rpx;
		}
		.txt1{
			font-size:32rpx;
			font-family:PingFangSC-Semibold,PingFang SC;
			font-weight:600;
			color:rgba(70,71,72,1);
			margin-top: 20rpx;
		}
		.txt2{
			font-size:28rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(144,147,153,1);
			margin-top: 16rpx;
		}
		.nav{
			width: 100%;
			height:80rpx;
			font-size:32rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(255,255,255,1);
			background:rgba(242,61,61,1);
			border-radius:40px;
			display: flex;
			justify-content: center;align-items: center;
			margin-top: 70rpx;
		}
	}
	
</style>
