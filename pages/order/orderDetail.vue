<template>
	<view class="sWrap">
		<view class="swrap-box1">
			<view class="swb1-left">
				<view class="swrap-box1c">
					<image class="swb1-img" src="/static/location.png" mode=""></image>
				</view>
			</view>
			<view class="swb1-right">
				<view class="swb1-right-top">
					<text class="swb1-rit1">{{order.receiverName}}</text>
					<text class="swb1-rit2">{{order.receiverPhone}}</text>
				</view>
				<view class="swb1-right-boo">
					<text class="swb1-right-boo-item">{{order.receiverProvince}}</text>
					<text class="swb1-right-boo-item">{{order.receiverCity}}</text>
					<text class="swb1-right-boo-item">{{order.receiverRegion}}</text>
					<text class="swb1-right-boo-item">{{order.receiverDetailAddress}}</text>
				</view>
			</view>
		</view>
		<view class="swrap-box2">
			<view class="swb2-item" v-for="(item,index) in orderItems" :key="index">
				<view class="swb2-item1">
					<image class="swb2-item-img" :src="item.picUrl" mode=""></image>
				</view>
				<view class="swb2-item3">
					<view class="swb2-item2">
						<view class="swb2-item2-title">{{item.productName}}</view>
						<view class="swb2-item2-cont">
							<text class="swb2-item2-text1" v-if="order.payType != 3">￥{{item.promotionPrice}}</text>
							<text class="swb2-item2-text2">
								<text v-for="(aitem,akey,aindex) of JSON.parse(item.specifications)" :key="aindex">{{aitem}}</text>
							</text>
						</view>
					</view>
					<view class="swb2-item4">{{item.productQuantity}}件</view>
				</view>
			</view>
			<view class="swb-total">
				<text class="swb-total-text1" v-if="order.payType != 3">订单总价：</text>
				<text class="swb-total-text2" v-if="order.payType == 3">消耗{{order.payAmount}}积分</text>
				<text class="swb-total-text2" v-else>￥{{order.payAmount}}</text>
			</view>
			<view class="swb2-foot">
				<view class="swb2f-btn1" @tap="callService">联系客服</view>
				<view class="swb2f-btn1" @tap="afterSale()" v-if="(order.status == 1 || order.status == 2) && order.payType != 3 && order.payType != 4">申请售后</view>
				<view class="swb2f-btn1" v-if="order.status == 0" @tap="toPay">去付款</view>
				<view class="swb2f-btn1" v-if="order.status == 2" @click="toDelivery">查看物流</view>
			</view>
		</view>
		<view class="swrap-box3">
			<view class="swrap-box3-title">订单信息</view>
			<view class="swrap-box3-cont">
				<view class="swrap-box3-item">订单编号：{{order.orderSn}}</view>
				<view class="swrap-box3-item">创建时间：{{order.createTime | dealTime}}</view>
				<!-- 支付方式0未支付，1支付宝，2微信，3积分 -->
				<view class="swrap-box3-item">
					<text v-if="order.payType == 1">支付方式：支付宝</text>
					<text v-if="order.payType == 2">支付方式：微信支付</text>
					<text v-if="order.payType == 3">支付方式：积分兑换</text>
				</view>
				<view class="swrap-box3-item" v-if="order.status == 2 || order.status == 3 ||order.status == 4 ||order.status == 5">物流公司：{{order.deliveryCompany}}</view>
				<view class="swrap-box3-item" v-if="order.status == 2 || order.status == 3 ||order.status == 4 ||order.status == 5">物流单号：
					<text class="swrap-box3-text1">{{order.deliverySn}}</text>
					<text class="iconfont iconfuzhi" @tap="copyOrderSn(order.deliverySn)"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import utils from '@/utils/method.js'
export default{
	data(){
		return {
			orderId:"",
			orderItems:[],
			order:{},
		}
	},
	methods:{
		toDelivery(id){
			uni.navigateTo({
				url:`/pages/order/delivery?id=${this.order.id}`
			})
		},
		toPay(){
			uni.redirectTo({
				url: `/pages/money/pay?money=${this.order.payAmount}&orderid=${this.orderId}`
			})
		},
		callService(){
			// uni.showToast({
			// 	icon:"none",
			// 	title:"客服系统努力开发中..."
			// })
			uni.navigateTo({
				url:"/pages/service/service"
			})
		},
		async getData(){
			await this.$http({
				apiName:"getOrderDetail",
				data:{orderId:this.orderId}
			}).then(res => {
				this.orderItems = res.data.orderItems;
				this.order = res.data.order
			}).catch(_ => {})
		},
		//售后
		afterSale(){
			uni.navigateTo({
				url:`/pages/afterSale/afterSale?id=${this.orderId}`
			})
		},
		//复制订单号
		copyOrderSn(order) {
			let _self = this
			uni.setClipboardData({
				data: order,
				success() {
					uni.showToast({
						title:"复制成功",
						icon: 'none'
					})
				}
			});
		},
	},
	onLoad(opt) {
		if(opt.id){
			this.orderId = opt.id
			this.getData()
		}
	},
	filters:{
		dealTime(val){
			return utils.unixToDatetime(val) || ""
		}
	}
}
</script>

<style lang="scss" scoped>
	.sWrap{
		.swrap-box1{
			display: flex;
			padding: 32rpx;
			align-items: center;
			.swb1-left{
				padding-top: 20rpx;
				padding-bottom: 20rpx;
				.swrap-box1c{
					width: 88rpx;
					height: 88rpx;
					border-radius: 50%;
					text-align: center;
					background-color: #F23D3D;
					margin-right: 24rpx;
					.swb1-img{
						width: 36rpx;
						height: 44rpx;
						margin-top: 22rpx;
					}
				}
			}
			.swb1-right{
				flex: 1;
				color: #303133;
				font-size: 28rpx;
				.swb1-right-top{
					margin-bottom: 10rpx;
					.swb1-rit1{
						margin-right: 42rpx;
					}
				}
				.swb1-right-boo{
					.swb1-right-boo-item{
						margin-right: 10rpx;
					}
				}
			}
		}
		.swrap-box2{
			border-top: 20rpx solid #F9FAFB;
			padding: 32rpx;
			.swb2-item{
				padding-bottom: 30rpx;
				border-bottom: 2rpx solid #DBDBDB;
				display: flex;
				.swb2-item1{
					width: 120rpx;
					height: 120rpx;
					border-radius: 8rpx;
					background: #C0C4CC;
					margin-right: 20rpx;
					.swb2-item-img{
						width: 120rpx;
						height: 120rpx;
						border-radius: 8rpx;
					}
				}
				.swb2-item3{
					flex: 1;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.swb2-item2{
						.swb2-item2-title{
							color: #303133;
							font-size: 30rpx;
						}
						.swb2-item2-cont{
							margin-top: 24rpx;
							.swb2-item2-text1{
								color: #F23D3D;
								font-size: 32rpx;
								margin-right: 20rpx;
							}
							.swb2-item2-text2{
								color: #909399;
								font-size: 24rpx;
							}
						}
					}
					.swb2-item4{
						width: 30%;
						color: #909399;
						font-size: 26rpx;
						text-align: right;
					}
				}
			}
			.swb2-item:last-child{
				border-bottom: none;
			}
			.swb-total{
				text-align: right;
				margin-top: 20rpx;
				.swb-total-text1{
					color: #909399;
					font-size: 24rpx;
				}
				.swb-total-text2{
					color: #F23D3D;
					font-size: 36rpx;
				}
			}
			.swb2-foot{
				margin-top: 20rpx;
				.swb2f-btn1{
					display: inline-block;
					border: 2rpx solid #E4E4E4;
					padding: 10rpx 20rpx;
					color: #4A4B4C;
					font-size: 26rpx;
					border-radius: 30rpx;
					margin-right: 20rpx;
				}
				.swb2f-btn2{
					border-color: #F23D3D;
					color: #F23D3D;
				}
			}
		}
		.swrap-box3{
			padding: 32rpx;
			border-top: 20rpx solid #F9FAFB;
			.swrap-box3-title{
				font-size: 30rpx;
				color: #606266;
			}
			.swrap-box3-cont{
				margin-top: 10rpx;
				.swrap-box3-item{
					line-height: 40rpx;
					color: #909399;
					font-size: 26rpx;
					.swrap-box3-text1{
						color: #477CE5;
					}
					.iconfuzhi{
						margin-left: 20rpx;
					}
				}
			}
		}
	}
</style>
