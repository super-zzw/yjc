<template>
	<view class="sWrap">
		<view class="rpg-title">订单编号：{{orderSn}}</view>
		<view class="" v-if="!loadData && prgs.length > 0">
			<view class="rgp-box1" v-for="(item,index) in prgs" :key="index">
				<view class="box-line"></view>
				<view class="">
					<view class="swb2-item" v-for="(good,gIndex) in item.orderItems" :key="gIndex">
						<view class="swb2-item1">
							<image class="swb2-item-img" :src="good.picUrl" mode=""></image>
						</view>
						<view class="swb2-item3">
							<view class="swb2-item2">
								<view class="swb2-item2-title">{{good.productName}}</view>
								<view class="swb2-item2-cont">
									<text class="swb2-item2-text1" v-if="payType != 3">￥{{good.promotionPrice}}</text>
									<text class="swb2-item2-text2">
										<text v-for="(aitem,akey,aindex) of item.specificationsMap" :key="aindex">{{akey}}:{{aitem}};</text>
									</text>
								</view>
							</view>
							<view class="swb2-item4">{{good.productQuantity}}件</view>
						</view>
					</view>
				</view>
				<view class="rgp1-order rgp1-order2">物流公司：{{item.deliveryCompany}}</view>
				<view class="rgp1-order">快递单号：{{item.deliverySn}}</view>
				<view class="rgp1-liuc">
					<view class="rgp1l-title">物流进度：</view>
					<view class="rgp1l-cont" v-if="item.result.length > 0">
						<view class="" v-for="(item2,index2) in item.result" :key="index2">
							<view class="rgp1l-cont-item">
								<view class="rgp1l-cont-itembox">
									<view class="rgp1l-cont-itembox2">
										<view class="rgp1lcit-num">{{item.result.length - index2}}</view>
										<view class="rgp1lcit-text">{{item2.time}}</view>
									</view>
								</view>
								<view class="rgp1l-cont-itemboxtype2">
									<image class="rgp1l-cont-line" src="https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/line.png" mode=""></image>
									<view class="rgp1lcit-text2">{{item2.context}}</view>
								</view>
							</view>
							<view class="rgp1l-cont-item" v-if="item.result.length - 1 == index2">
								<view class="rgp1l-cont-itembox">
									<view class="rgp1l-cont-itembox2">
										<view class="rgp1lcit-num"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="rgp1l-title" v-else>{{item.msg}}</view>
				</view>
				
			</view>
		</view>
		<view class="rpg-title rpg-title2" v-else>
			{{prgs}}
		</view>
	</view>
</template>

<script>
import utils from '@/utils/method.js'
export default{
	data(){
		return {
			orderId:"",  //订单id
			prgs:"物流查询中...",
			loadData:true,
			orderSn:"",
			payType:""
		}
	},
	methods:{
		async getData(){
			await this.$http({
				apiName:"getOrderDetail",
				data:{orderId:this.orderId}
			}).then(res => {
				this.orderSn = res.data.order.orderSn;
				this.payType = res.data.order.payType
			}).catch(_ => {})
		},
		async getPrgs(){
			await this.$http({
				apiName:"getGoodDeliver",
				data:{orderId:this.orderId}
			}).then(res => {
				if(res.data.length == 0){
					this.prgs = "暂无物流信息"
				}else{
					this.prgs = res.data
					this.loadData = false
					this.prgs.map(item => {
						if(item.result){
							item["result"] = JSON.parse(item.result)
						}else{
							item["result"] = []
							item["msg"] = "暂无物流信息"
						}
						
					})
				}
			}).catch(_ => {
				this.prgs = "物流查询失败，请稍后再试"
			})
		},
	},
	onLoad(opt) {
		this.orderId = opt.id
		this.getData()
		this.getPrgs()
	}
}
</script>

<style lang="scss" scoped>
	.sWrap{
		min-height: calc(100vh - 88rpx);
		background-color: #fff;
		.rpg-title{
			padding-left: 32rpx;
			padding-right: 32rpx;
			color: #000;
			font-size: 28rpx;
			font-weight: bold;
		}
		.rpg-title2{
			font-weight: normal;
		}
		.rgp-box1{
			background-color: #fff;
			padding: 32rpx;
			padding-top: 0;
			.box-line{
				height: 2rpx;
				background-color: #DBDBDB;
				margin-top: 30rpx;
			}
			.swb2-item{
				padding-top: 20rpx;
				padding-bottom: 20rpx;
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
							font-size: 26rpx;
						}
						.swb2-item2-cont{
							margin-top: 6rpx;
							.swb2-item2-text1{
								color: #F23D3D;
								font-size: 28rpx;
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
			.rgp1-order{
				padding-bottom: 10rpx;
				color: #606266;
				font-size: 28rpx;
			}
			.rgp1-order2{
				border-bottom: none;
				padding-bottom: 10rpx;
			}
			.rgp1-liuc{
				.rgp1l-title{
					// margin-top: 6rpx;
					margin-bottom: 10rpx;
					color: #606266;
					font-size: 28rpx;
				}
				.rgp1l-cont{
					.rgp1l-cont-item{
						.rgp1l-cont-itembox{
							display: flex;
							justify-content: space-between;
							align-items: center;
							.rgp1l-cont-itembox2{
								display: flex;
								align-items: center;
								.rgp1lcit-num{
									text-align: center;
									line-height: 36rpx;
									width: 36rpx;
									height: 36rpx;
									background-color: #F23D3D;
									border-radius: 50%;
									color: #fff;
									font-size: 20rpx;
									margin-right: 10rpx;
								}
								.ractive{
									background-color: #CDD0D7;
									color: #fff;
								}
								.rgp1lcit-text{
									color: #606266;
									font-size: 30rpx;
								}
							}
							.rgp1lcit-time{
								color: #909399;
								font-size: 26rpx;
							}
							.rgp1lcit-time2{
								border: 2rpx solid #F23D3D;
								color: #F23D3D;
								font-size: 26rpx;
								padding: 0 16rpx;
								border-radius: 32rpx;
							}
						}
						.rgp1l-cont-itemboxtype2{
							display: flex;
							.rgp1lcit-text2{
								flex: 1;
								padding-top: 4rpx;
								color: #606266;
								font-size: 24rpx;
								padding-bottom: 10rpx;
							}
						}
						.rgp1l-cont-line{
							width: 4rpx;
							height: 120rpx;
							margin-left: 18rpx;
							margin-right: 20rpx;
						}
					}
				}
			}
		}
		.rgp-box2{
			padding: 32rpx;
			display: flex;
			justify-content: space-between;
			font-size: 28rpx;
			background-color: #fff;
			margin-top: 20rpx;
			.rgpb2-text1{
				color: #303133;
			}
			.rgpb2-text2{
				color: #909399;
			}
		}
		.rgp-box3{
			font-size: 28rpx;
			padding: 32rpx;
			margin-top: 20rpx;
			background-color: #fff;
			.rgpb3-text1{
				color: #303133;
			}
			.rgpb3-text2{
				color: #909399;
			}
		}
		.rgp-box4{
			background-color: #fff;
			margin-top: 20rpx;
			.sor-item-tile{
				padding: 24rpx 32rpx;
				border-bottom: 2rpx solid #DBDBDB;
				color: #909399;
				font-size: 28rpx;
			}
			.sor-item-cont{
				padding-left: 32rpx;
				padding-right: 32rpx;
				.sor-item-cont2{
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 2rpx solid #DBDBDB;
				}
				.sori-left{
					padding-top: 32rpx;
					padding-bottom: 32rpx;
					display: flex;
					align-items: center;
					.soril-img{
						width: 120rpx;
						height: 120rpx;
						border-radius: 8rpx;
						background-color: #C0C4CC;
						margin-right: 20rpx;
						image{
							width: 120rpx;
							height: 120rpx;
							border-radius: 8rpx;
						}
					}
					.soril-info{
						.soril-info1{
							color: #303133;
							font-size: 30rpx;
						}
						.soril-info2{
							margin-top: 20rpx;
							display: flex;
							align-items: center;
							.soril-info-text1{
								color: #F23D3D;
								font-size: 32rpx;
								margin-right: 20rpx;
							}
							.soril-info-text2{
								color: #909399;
								font-size: 24rpx;
							}
						}
					}
				}
				.sori-right{
					color: #909399;
					font-size: 26rpx;
				}
			}
			.sor-item-cont:last-child{
				border-bottom:none;
			}
			.sor-total{
				text-align: right;
				margin-top: 20rpx;
				padding: 0 32rpx 32rpx 32rpx;
				.sor-total-text1{
					color: #909399;
					font-size: 24rpx;
				}
				.sor-total-text2{
					color: #F23D3D;
					font-size: 36rpx;
				}
			}
		}
	}
</style>
