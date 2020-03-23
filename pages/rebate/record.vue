<template>
	<view class="content">
		<view class="top flex justify-between">
			<view class="top-left flex">
				<view class="icon flex align-items justify-center">
					<text class="iconfont iconyichenggongyaoqinghaoyoushuicon-yaoqingjiluye"></text>
				</view>
				<view class="top-left-text flex flex-column justify-between">
					<text class="number">108</text>
					<text class="tips">已成功邀请好友数</text>
				</view>
			</view>
			<view class="top-left flex">
				<view class="icon two flex align-items justify-center">
					<text class="iconfont iconyixiadanhaoyoushuicon-yaoqingjiluye"></text>
				</view>
				<view class="top-left-text flex flex-column justify-between">
					<text class="number">108</text>
					<text class="tips">已下单好友数</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #F9FAFB;
	}
	.top{
		background-color: #ffffff;
		padding: 30rpx 32rpx 30rpx 40rpx;
		.top-left{
			height: 80rpx;
			.icon{
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				background-color: #FFEECB;
				&.two{background-color: #CBFFD3;  .iconfont{ color: rgb(30, 234, 60);}}
				.iconfont{
					color: rgb(255, 170, 0);
					font-size: 40rpx;
				}
			}
			.top-left-text{
				margin-left: 20rpx;
				.number{font-size: 40rpx;color: #F23D3D;font-weight: bold;line-height: 48rpx;}
				.tips{line-height: 40rpx;font-size: 28rpx;}
			}
		}
	}
</style>
