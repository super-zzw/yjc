<template>
	<view class="empty-content">
		<image class="empty-content-image" src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/empty.png" mode="aspectFit"></image>
		<view class="empty-text">{{desc}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			desc: {
				type: String,
				default: '暂无数据'
			},
		},

		data() {
			return{
				
			}
		}
	}
</script>

<style lang="scss">
	.empty-content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: $page-color-base;
		padding-bottom: 120rpx;

		&-image {
			width: 200rpx;
			height: 200rpx;
		}
		.empty-text{
			color: #C0C4CC;
			font-size: 28rpx;
			margin-top: 20rpx;
		}
	}
</style>
