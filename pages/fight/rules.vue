<template>
	<view class="ptRule">
		<view class="ptrItem" v-for="(item,index) in data" :key="index">
			<view class="ptrTitle">
				STEP{{index + 1}}
			</view>
			<view class="ptrText">
				{{item.text}}
			</view>
			<view class="ptrImg">
				<image class="img" :src="item.img_url" mode="widthFix"></image>
			</view>
		</view>
		<view class="ptrBoo">
			<view class="ptrBoo1">
				其他说明
			</view>
			<view class="ptrBoo2">
				1.在<text class="ptrBooText">个人中心-我的订单</text>中，可以查看自己的拼团订单；
			</view>
			<view class="ptrBoo3">
				2.在拼团有效时间内，不允许取消已支付的拼团订单
			</view>
		</view>
	</view>
</template>

<script>
	import {
	   mapState
	} from 'vuex';
	export default{
		data(){
			return{
				data:[]
			}
		},
		computed:{
			...mapState(['config'])
		},
		onLoad() {
			this.data = [
					{
						text:"进入对应拼团商品页面，点击“我要参团”按钮",
						img_url:this.config.MALL_IMG_DEFAULT.groupR1
					},
					{
						text:"提交并成功支付订单",
						img_url:this.config.MALL_IMG_DEFAULT.groupR2
					},
					{
						text:"点击“邀请好友参团”按钮并成功分享",
						img_url:this.config.MALL_IMG_DEFAULT.groupR3
					},
					{
						text:"在开团有效时间内，凑齐人数即可拼团成功；未凑齐人数则拼团失败，平台将原路退款到付款账户",
						img_url:this.config.MALL_IMG_DEFAULT.groupR4
					}
				]
		}
	}
</script>

<style lang="scss" scoped>
.ptRule{
	border-top: 2rpx solid #DBDBDB;
	.ptrItem{
		padding-top: 24rpx;
		.ptrTitle{
			background:linear-gradient(90deg,#FA7070 0%,#F23D3D 100%);
			padding-left: 40rpx;
			padding-right: 30rpx;
			height: 60rpx;
			display: inline-block;
			border-radius: 0 200rpx 200rpx 0;
			color: #fff;
			font-size: 30rpx;
			line-height: 60rpx;
		}
		.ptrText{
			text-align: center;
			margin-top: 32rpx;
			color: #303133;
			font-size: 30rpx;
			padding-left: 32rpx;
			padding-right: 32rpx;
		}
		.ptrImg{
			font-size: 0;
			margin-top: 40rpx;
			text-align: center;
			.img{
				width: 600rpx;
			}
		}
	}
	.ptrBoo{
		padding: 40rpx 32rpx;
		box-sizing: border-box;
		.ptrBoo1{
			color: #303133;
			font-weight: bold;
			font-size: 36rpx;
			margin-bottom: 20rpx;
		}
		.ptrBoo2,.ptrBoo3{
			line-height: 50rpx;
			color: #606266;
			font-size: 30rpx;
			.ptrBooText{
				color: #F23D3D;
			}
		}
	}
}
</style>
