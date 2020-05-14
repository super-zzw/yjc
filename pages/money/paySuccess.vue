<template>
	<view class="content">
		<text class="iconfont iconchenggong"></text>
		<text class="tit" v-if="isDh == 0">支付成功</text>
		<text class="tit" v-if="isDh == 1">兑换成功</text>
		<text class="tit" v-if="isDh == 2">提交成功</text>
		<view class="btn-group">
			<navigator open-type="redirect" url="/pages/order/order?state=0" class="mix-btn">查看订单</navigator>
			<!-- <navigator open-type="switchTab" url="/pages/index/index" class="mix-btn hollow">返回首页</navigator> -->
			<navigator open-type="reLaunch" url="/pages/index/index" class="mix-btn hollow">返回首页</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isDh:0
			}
		},
		methods: {
			getCartNms(){
				this.$http({
					apiName:"getCartNms"
				}).then(res => {
					if(res.data > 0){
						uni.setTabBarBadge({
						  index: 2,
						  text: String(res.data)
						})
						this.setCartNms(res.data)
					}else{
						this.setCartNms(0)
						uni.removeTabBarBadge({
							index: 2,
						})
					}
				}).catch(_ => {})
			},
		},
		onLoad(opt) {
			this.isDh = opt.isDh
			if(this.isDh == 1){
				uni.setNavigationBarTitle({
					title:"兑换成功"
				})
			}
			this.getCartNms()
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
		.iconfont{
			padding-top: 120rpx;
			color:#F23D3D;
			font-size: 180rpx;
		}
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
