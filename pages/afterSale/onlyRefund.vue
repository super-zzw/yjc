<template>
	<view class="sWrap">
		<view class="sor-top">
			<text class="text1">流程指引:</text>
			<text>提交申请</text>
			<text>>></text>
			<text>客服受理</text>
			<text>>></text>
			<text>完成退款</text>
		</view>
		<picker mode="selector" :range="config.MALL_ORDER_REFUND" @change="bindPickerChange">
			<view class="sor-cont">
				<view class="sor-cleft">
					<view class="sor-cleft-text1">申请类型：</view>
					<view class="sor-cleft-text2">{{type}}</view>
				</view>
				<view class="right-cont">
					<image src="/static/right.png" mode=""></image>
				</view>
			</view>
		</picker>
		<view class="sor-desc">
			<textarea rows=4 class="sor-desc-area" v-model="desc" placeholder-style="color:#C0C4CC;font-size:28rpx;" placeholder="为尽快处理你的售后申请，请填写详细描述...(140字以内)" />
		</view>
		<view class="sor-items">
			<view class="sor-item-tile">订单{{orderSn}}内的商品</view>
			<view class="sor-item-cont" v-for="(item,index) in dataList" :key="index" :class="{active:index == (dataList.length - 1)}">
				<view class="sor-item-cont1">
					<view class="sori-left">
						<view class="soril-img">
							<image :src="item.picUrl" mode="" ></image>
						</view>
						<view class="soril-info">
							<view class="soril-info1">{{item.productName}}</view>
							<view class="soril-info2">
								<text class="soril-info-text1 nm-font">￥{{item.payAmount}}</text>
								<text class="soril-info-text2">
									<text :key="sindex" v-for="(sitem,sindex) in JSON.parse(item.specifications)">{{sitem.vlaue}}</text>
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
		<view class="sor-btn">
			<view class="sor-btn-cont" @tap="submit">提交申请</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default{
	data(){
		return {
			orderId:"",
			type:"",
			dataList:[],
			total:"",
			orderSn:"",
			desc:""
		}
	},
	computed:{
		...mapState(['config'])
	},
	methods:{
		bindPickerChange(e){
			this.type = this.config.MALL_ORDER_REFUND[e.detail.value]
		},
		async getData(){
			await this.$http({
				apiName:"getOrderDetail",
				data:{orderId:this.orderId}
			}).then(res => {
				this.total = res.data.order.payAmount
				this.orderSn = res.data.order.orderSn
				this.dataList = res.data.orderItems
			}).catch(_ => {})
		},
		async submit(){
			if(this.desc){
				await this.$http({
					apiName:"reOrder",
					type:"POST",
					data:{
						description:this.desc,
						orderId:this.orderId,
						reason:this.type,
						type :0
					}
				}).then(res => {
					uni.navigateTo({
						url:"/pages/afterSale/applyOk"
					})
				}).catch(_ => {})
			}else{
				uni.showToast({
					title:"请填写描述",
					icon:"none"
				})
			}
		}
	},
	onLoad(opt) {
		this.type = this.config.MALL_ORDER_REFUND[0]
		if(opt.id){
			this.orderId = opt.id
			this.getData()
		}
	}
}
</script>

<style lang="scss" scoped>
.sWrap{
	min-height: calc(100vh - 160rpx);
	background-color:#F9FAFB;
	.sor-top{
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		color: #303133;
		font-size: 28rpx;
		padding: 36rpx 32rpx;
		margin-bottom: 20rpx;
		.text1{
			color: #606266;
		}
	}
	.sor-cont{
		padding: 32rpx;
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		.sor-cleft{
			display: flex;
			align-items: center;
			.sor-cleft-text1{
				color: #606266;
				font-size: 28rpx;
			}
			.sor-cleft-text2{
				color: #303133;
				font-size: 30rpx;
			}
		}
		.right-cont{
			image{
				width: 14rpx;
				height: 26rpx;
			}
		}
	}
	.sor-desc{
		background-color: #fff;
		padding: 20rpx 32rpx;
		padding-top: 0;
		margin-bottom: 20rpx;
		.sor-desc-area{
			width: 100%;
			border-top: 2rpx solid #DBDBDB;
			padding-top: 20rpx;
			color: #303133;
			font-size: 28rpx;
		}
	}
	.sor-items{
		background-color: #fff;
		.sor-item-tile{
			padding: 24rpx 32rpx;
			border-bottom: 2rpx solid #DBDBDB;
			color: #909399;
			font-size: 28rpx;
		}
		.sor-item-cont{
			padding-left: 32rpx;
			padding-right: 32rpx;
			.sor-item-cont1{
				border-bottom: 2rpx solid #DBDBDB;
				display: flex;
				justify-content: space-between;
				align-items: center;
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
		.sor-item-cont.active{
			.sor-item-cont1{
				border-bottom: none;
			}
		}
		.sor-total{
			text-align: right;
			margin-top: 20rpx;
			padding: 32rpx;
			padding-top: 0;
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
	.sor-btn{
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
