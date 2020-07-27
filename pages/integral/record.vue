<template>
	<view class="sWrap">
		<view class="sbox">
			<view v-for="(item,index) in dataList" :key="index" class="order-item" >
				<view class="i-top b-b">
					<text class="time">{{item.orderTime | dealTime}}</text>
					<text 
						class="del-btn iconfont iconshanchu"
						@click="deleteOrder(index,item.orderId)"
					></text>
				</view>
				<view 
					class="goods-box-single"
				>
					<image class="goods-img" :src="item.picUrl" mode="aspectFill"></image>
					<view class="right">
						<text class="title clamp">{{item.productName}}</text>
						<text class="attr-box">
							规格：<text v-for="(aitem,akey,aindex) of item.specificationsMap" :key="aindex">{{akey}}:{{aitem}};</text>
							；<text>数量：{{item.productQuantity}}</text>
						</text>
						<text class="price">{{item.minPrice}}</text>
					</view>
				</view>
				<!-- <view class="good-box-sn">
					订单编号：{{item.orderSn}}
					<text class="iconfont iconfuzhi gbsc"></text>
				</view> -->
				<view class="price-box">
					{{config.MALL_POINT_TITLE}}:
					<text class="price">{{item.payAmount}}</text>
				</view>
			</view>
		</view>
		<empty :desc="'暂无相关订单'" v-if="dataList.length === 0 && noMore"></empty>
		<view v-if="dataList.length > 0 && noMore" class="no_more">
			<text class="no_more_side"></text>
			<text class="no_more_text">没有更多数据了</text>
			<text class="no_more_side"></text>
		</view>
	</view>
</template>

<script>
import {mapState} from 'vuex'
import empty from "@/components/empty";
import utils from "@/utils/method.js"
export default{
	components: {
		empty
	},
	data(){
		return{
			dataList:[
				
			],
			page:1,
			size:8,
			noMore:false,
		}
	},
	filters:{
		dealTime(val){
			return utils.unixToDatetime(val) || ""
		}
	},
	computed:{
		...mapState(['config'])
	},
	onLoad() {
		this.getData()
	},
	methods:{
		async getData(){
			await this.$http({
				apiName:"scoreExList",
				data:{
					page:this.page,
					size:this.size
				}
			}).then(res => {
				this.noMore = !res.data.hasNextPage
				this.dataList = this.dataList.concat(res.data.list)
			}).catch(_ => {})
		},
		//删除订单
		async deleteOrder(index,orderId){
			let that = this
			uni.showModal({
				title: '提示',
				content: '确定删除该订单？',
				success: function (res) {
					if (res.confirm) {
						that.deleteOrderOk(index,orderId)
					}
				}
			})
		},
		//确定删除
		async deleteOrderOk(index,orderId){
			uni.showLoading({
				title: '删除中...'
			})
			await this.$http({
				apiName:"deleteOrder",
				type:"POST",
				data:{id:orderId}
			}).then(res => {
				this.dataList.splice(index, 1);
				uni.showToast({
					title:"删除成功"
				})
			}).catch(_ => {})
			uni.hideLoading();
		},
	},
	//下拉刷新
	async onPullDownRefresh(){
		this.dataList = [];
		this.page = 1;
		await this.getData()
		uni.stopPullDownRefresh();
		uni.showToast({
			title: '刷新成功'
		})
	},
	//触底加载更多
	onReachBottom(){
		if(this.noMore){
			return
		}
		this.page ++;
		this.getData()
	},
}
</script>

<style lang="scss" scoped>
.sWrap{
	background-color: #F9FAFB;
	min-height: calc(100vh - 88rpx);
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30rpx;
		background: #fff;
		margin-top: 16rpx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80rpx;
			padding-right:30rpx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.time{
				flex: 1;
			}
			.state{
				color: $base-color;
			}
			.del-btn{
				padding: 10rpx 0 10rpx 36rpx;
				font-size:40rpx;
				color: $font-color-light;
				position: relative;
				// &:after{
				// 	content: '';
				// 	width: 0;
				// 	height: 30rpx;
				// 	border-left: 1px solid $border-color-dark;
				// 	position: absolute;
				// 	left: 20rpx;
				// 	top: 50%;
				// 	transform: translateY(-50%);
				// }
			}
		}
		/* 多条商品 */
		.goods-box{
			height: 160rpx;
			padding: 20rpx 0;
			white-space: nowrap;
			.goods-item{
				width: 120rpx;
				height: 120rpx;
				display: inline-block;
				margin-right: 24rpx;
			}
			.goods-img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20rpx 0;
			.goods-img{
				display: block;
				width: 120rpx;
				height: 120rpx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30rpx 0 24rpx;
				overflow: hidden;
				.title{
					font-size: $font-base + 2rpx;
					color: $font-color-dark;
					line-height: 1;
				}
				.attr-box{
					font-size: $font-sm + 2rpx;
					color: $font-color-light;
					padding: 10rpx 12rpx;
					padding-left: 0;
				}
				.price{
					font-size: $font-base + 2rpx;
					color: $font-color-dark;
					&:before{
						content: '￥';
						font-size: $font-sm;
						margin: 0 2rpx 0 8rpx;
					}
				}
			}
		}
		.good-box-sn{
			font-size: 24rpx;
			color: #999;
			.gbsc{
				padding-left: 20rpx;
				padding-right: 20rpx;
				color:#477CE5;
				font-size: 30rpx;
				font-weight: bold;
			}
		}
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20rpx 30rpx;
			font-size:28rpx;
			color: #303133;
			.num{
				margin: 0 8rpx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: #F23D3D;
				font-weight: 600;
				&:before{
					content: '';
					font-size: $font-sm;
					margin: 0 2rpx 0 8rpx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100rpx;
			position: relative;
			padding-right: 30rpx;
		}
		.action-btn{
			width: 160rpx;
			height: 60rpx;
			margin: 0;
			margin-left: 24rpx;
			padding: 0;
			text-align: center;
			line-height: 60rpx;
			font-size: $font-sm + 2rpx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}
}
</style>
