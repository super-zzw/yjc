<template>
	<view class="sWrap">
		<view class="rgp-box1">
			<view class="rgp1-order">售后单号：{{applySn}}（仅退款）</view>
			<view class="rgp1-liuc">
				<view class="rgp1l-title">退款流程</view>
				<view class="rgp1l-cont" v-if="applyStatus == -1">
					<view class="" v-for="(item,index) in prgs" :key="index">
						<view class="rgp1l-cont-item" v-if="item.status != 3 || item.status != 4">
							<view class="rgp1l-cont-itembox">
								<view class="rgp1l-cont-itembox2">
									<view class="rgp1lcit-num" v-if="index == 0" :class="{ractive:item.status > applyStatus}">{{index + 1}}</view>
									<view class="rgp1lcit-num" v-else :class="{ractive:item.status > applyStatus}">{{index -2}}</view>
									<view class="rgp1lcit-text">{{item.cont}}</view>
								</view>
							</view>
							<image v-if="index != prgs.length - 1" class="rgp1l-cont-line" src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/line.png" mode=""></image>
						</view>
					</view>
				</view>
				<view class="rgp1l-cont" v-else>
					<view class="" v-for="(item,index) in prgs" :key="index">
						<view class="rgp1l-cont-item" v-if="item.status != -1">
							<view class="rgp1l-cont-itembox">
								<view class="rgp1l-cont-itembox2">
									<view class="rgp1lcit-num" v-if="index == 0" :class="{ractive:item.status > applyStatus}">{{index + 1}}</view>
									<view class="rgp1lcit-num" v-else :class="{ractive:item.status > applyStatus}">{{index}}</view>
									<view class="rgp1lcit-text">{{item.cont}}</view>
								</view>
							</view>
							<image v-if="index != prgs.length - 1" class="rgp1l-cont-line" src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/line.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="rgp-box2">
			<view class="rgpb2-text1">售后申请原因</view>
			<view class="rgpb2-text2">{{type}}</view>
		</view>
		<view class="rgp-box3">
			<view class="rgpb3-text1">售后申请备注</view>
			<view class="rgpb3-text2">{{desc}}</view>
		</view>
		<view class="rgp-box4">
			<view class="sor-item-tile">订单{{orderSn}}内的商品</view>
			<view class="sor-item-cont" v-for="(item,index) in dataList" :key="index">
				<view class="sor-item-cont2">
				<view class="sori-left">
					<view class="soril-img">
						<image :src="item.picUrl" mode=""></image>
					</view>
					<view class="soril-info">
						<view class="soril-info1">{{item.productName}}</view>
						<view class="soril-info2">
							<text class="soril-info-text1 nm-font">￥{{item.payAmount}}</text>
							<text class="soril-info-text2">
								<text :key="sindex" v-for="(sval,skey,sindex) of item.specificationsMap">{{skey}}:{{sval}};</text>
							</text>
						</view>
					</view>
				</view>
				<view class="sori-right nm-font">
					{{item.productQuantity}}件
				</view>
				</view>
			</view>
			<view class="sor-total">
				<text class="sor-total-text1">合计金额：</text>
				<text class="sor-total-text2 nm-font">￥{{total}}</text>
			</view>
		</view>
	</view>
</template>

<script>
import utils from '@/utils/method.js'
export default{
	data(){
		return {
			orderId:"",  //订单id
			prgsId:"",  //售后id
			
			prgs:[
				{
					cont:"提交售后申请",
					status:0
				},
				{
					cont:"售后拒绝",
					status:-1
				},
				{
					cont:"待退款",
					status:3
				},
				{
					cont:"退款中",
					status:4
				},
				{
					cont:"已完成",
					status:5
				}
			],
			dataList:[],
			total:"",
			orderSn:"",
			applySn:"",  //售后单号
			
			applyStatus:"",  //售后状态
			desc:"",
			type:"",  //售后原因
		}
	},
	methods:{
		async getData(){
			await this.$http({
				apiName:"getOrderDetail",
				data:{orderId:this.orderId}
			}).then(res => {
				this.total = res.data.order.payAmount
				this.orderSn = res.data.order.orderSn
				this.dataList = res.data.orderItems
				this.applySn = res.data.applySn
			}).catch(_ => {})
		},
		async getPrgs(){
			await this.$http({
				apiName:"getPrgs",
				data:{applyId:this.prgsId}
			}).then(res => {
				this.type = res.data.reason
				this.desc = res.data.description
				this.applyStatus = res.data.status
			}).catch(_ => {})
		},
		logistics(id){
			uni.navigateTo({
				url:"/pagesA/afterSale/logistics"
			})
		}
	},
	onLoad(opt) {
		this.prgsId = opt.prgsId
		this.orderId = opt.orderId
		this.getData()
		this.getPrgs()
	}
}
</script>

<style lang="scss" scoped>
	.sWrap{
		min-height: calc(100vh - 88rpx);
		background-color: #F9FAFB;
		.rgp-box1{
			background-color: #fff;
			padding: 32rpx;
			.rgp1-order{
				padding-bottom: 24rpx;
				color: #606266;
				font-size: 28rpx;
				border-bottom: 2rpx solid #DBDBDB;
			}
			.rgp1-liuc{
				.rgp1l-title{
					margin-top: 24rpx;
					margin-bottom: 24rpx;
					color: #303133;
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
									font-size: 22rpx;
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
						.rgp1l-cont-line{
							width: 4rpx;
							height: 50rpx;
							margin-left: 18rpx;
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
			word-wrap:break-word;
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
					min-width: 60rpx;
					text-align: right;
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
