<template>
	<view class="sWrap">
		<view class="as-box">
			<view class="as-item as-item1" @tap="refundgood">
				<view class="asi-left">
					<image class="asi-icon" src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/s1.png"></image>
					<view class="asi-text">
						<view class="asi-text1">退货退款</view>
						<view class="asi-text2">因质量、错发等问题需要退货退款</view>
					</view>
				</view>
				<view class="asi-right">
					<image src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/right.png" mode=""></image>
				</view>
			</view>
			<view class="as-item" @tap="refund">
				<view class="asi-left">
					<image class="asi-icon" src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/s2.png"></image>
					<view class="asi-text">
						<view class="asi-text1">仅退款</view>
						<view class="asi-text2">未收到货品</view>
					</view>
				</view>
				<view class="asi-right">
					<image src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/right.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId:""
			}
		},
		methods: {
			refund(){
				uni.navigateTo({
					url:"/pages/afterSale/onlyRefund?id=" + this.orderId
				})
			},
			refundgood(){
				uni.navigateTo({
					url:"/pages/afterSale/reGoodfund?id=" + this.orderId
				})
			}
		},
		onLoad(opt) {
			if(opt.id){
				this.orderId = opt.id
			}
		}
	}
</script>

<style lang="scss" scoped>
.sWrap{
	min-height: 100vh;
	background-color: #F9FAFB;
	.as-box{
		background-color: #fff;
		padding-left: 32rpx;
		padding-right: 32rpx;
		.as-item{
			padding: 32rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.asi-left{
				display: flex;
				align-items: center;
				.asi-icon{
					width: 72rpx;
					height: 72rpx;
					margin-right: 20rpx;
				}
				.asi-text{
					.asi-text1{
						color: #303133;
						font-size: 30rpx;
					}
					.asi-text2{
						color: #909399;
						font-size: 28rpx;
						margin-top: 8rpx;
					}
				}
			}
			.asi-right{
				width: 60rpx;
				height: 100%;
				text-align: right;
				image{
					width: 14rpx;
					height: 26rpx;
				}
			}
		}
		.as-item1{
			border-bottom: 2rpx solid #DBDBDB;
		}
	}
	
}
</style>
