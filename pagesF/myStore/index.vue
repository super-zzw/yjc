<template>
	<view class="container">
		<view class="card-box">
			<view class="content">
				<view class="box1">
					<image :src="userInfo.icon || 'https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/missing-face.png'" mode="" class="avatar"></image>
					<text class="wusername">{{userInfo.wusername || '游客'}}</text>
				</view>
				<view class="box2">
					<view class="left">
						<view class="r1">
							<text class="L1">¥1998</text>
							<text class="L2">储值余额</text>
						</view>
						<view class="r2">
							<text class="L2">储值卡余额不可提现</text>
						</view>
					</view>
					<view class="right">
						<view class="btn" @tap="toExchange">储值卡兑换</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="logBox">
			<view class="titles">储值消费记录</view>
			<view class="sbox">
				<view v-for="(item,index) in dataList" :key="index" class="order-item" v-if="dataList.length">
					<view class="i-top b-b">
						<text class="time">{{item.orderTime | dealTime}}</text>
						<text 
							class="del-btn iconfont iconshanchu"
							@click="deleteLog()"
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
						储值余额 :
						<text class="price">{{item.payAmount}}</text>
					</view>
				</view>
			</view>
			<empty :desc="'暂无相关记录'" v-if="dataList.length === 0 && noMore" height="500rpx"></empty>
			<view v-if="dataList.length > 0 && noMore" class="no_more">
				<text class="no_more_side"></text>
				<text class="no_more_text">没有更多数据了</text>
				<text class="no_more_side"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import empty from "@/components/empty";
	import utils from "@/utils/method.js"
	import {
	    mapState
	} from 'vuex';
	export default {
		components: {
			empty
		},
		data() {
			return {
				dataList:[
					// {orderTime:111,orderId:111,picUrl:'https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/wxhy.png',
					// productName:11,specificationsMap:{},productQuantity:11,orderSn:11,payAmount:11,minPrice:120},
					// {orderTime:111,orderId:111,picUrl:'https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/wxhy.png',
					// productName:11,specificationsMap:{},productQuantity:11,orderSn:11,payAmount:11,minPrice:120},
					
				],
				noMore:true,
			};
		},
		computed: {
			...mapState(['userInfo','config']),
		},
		filters:{
			dealTime(val){
				return utils.unixToDatetime(val) || ""
			}
		},
		methods:{
			// 兑换
			toExchange(){
				uni.navigateTo({
					url:'./exchange'
				})
			},
			//删除订单
				async deleteLog(){
					let that = this
					uni.showModal({
						title: '提示',
						content: '确定删除该订单？',
						success: function (res) {
							if (res.confirm) {
								that.deleteLogOk()
							}
						}
					})
				},
				//确定删除
				 deleteLogOk(){
					// uni.showLoading({
					// 	title: '删除中...'
					// })
					// await this.$http({
					// 	apiName:"deleteOrder",
					// 	type:"POST",
					// 	data:{id:orderId}
					// }).then(res => {
					// 	this.dataList.splice(index, 1);
					// 	uni.showToast({
					// 		title:"删除成功"
					// 	})
					// }).catch(_ => {})
					// uni.hideLoading();
				}
			}
		}
	
</script>

<style lang="scss" scoped>
  .container{
	  background:  #f8f8f8;
	  height: calc(100vh - 88rpx);
	  .card-box{
		  padding: 30rpx;
		  background: #fff;
		  .content{
			  background: url(../../static/background.png);
			  background-size:100% 100%;
			  width: 686rpx;
			  height: 312rpx;
			  padding: 40rpx;
			  display: flex;
			  flex-direction: column;
			  .box1{
				  display: flex;
				  align-items: center;
				  .avatar{
					  width: 80rpx;
					  height: 80rpx;
					  margin-right: 15rpx;
				  }
				  .wusername{
					  font-size:36rpx;
					  font-family:PingFangSC-Medium,PingFang SC;
					  font-weight:500;
					  color:rgba(255,255,255,1);
					 
				  }
			  }
			  .box2{
				  margin-top: 50rpx;
				  display: flex;
				  justify-content: space-between;
				  .left{
					  display: flex;
					  flex-direction: column;
					 
					  .r1{
						  display: flex;
					      align-items: flex-end;
						  .L1{
							  font-size:52rpx;
							  font-family:PingFangSC-Semibold,PingFang SC;
							  font-weight:600;
							  color:rgba(255,255,255,1);
							
							  margin-right: 12rpx;
						  }
						  .L2{
							  font-size:28rpx;
							  font-family:PingFangSC-Regular,PingFang SC;
							  font-weight:400;
							  color:rgba(255,255,255,1);
							  line-height:54rpx;
						  }
					  }
					  .r2{
						  text{
							  font-size:24rpx;
							  font-family:PingFangSC-Regular,PingFang SC;
							  font-weight:400;
							  color:rgba(255,185,185,1);
							  line-height:34rpx
						  }
					  }
				  }
				  .right{
					  .btn{
						  width:206rpx;
						  height:70rpx;
						  background:rgba(255,255,255,1);
						  border-radius:35rpx;
						  font-size:32rpx;
						  font-family:PingFangSC-Medium,PingFang SC;
						  font-weight:600;
						  color:rgba(242,61,61,1);
						  display: flex;
						  justify-content: center;
						  align-items: center;
					  }
				  }
			  }
		  }
		
	  }
	  .logBox{
		  .titles{
			  padding: 40rpx 0 20rpx 32rpx;
			  font-size:32rpx;
			  font-family:PingFangSC-Semibold,PingFang SC;
			  font-weight:600;
			  color:rgba(48,49,51,1);
		  }
		  
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
  }
</style>
