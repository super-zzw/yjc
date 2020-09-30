<template>
	<view v-if="loading">
		<view class="orderList" v-if="list.length>0">
			<view class="orderItem" v-for="(item,index) in list" :key="index">
				<view class="banner">
					<text class="orderNum">订单编号：{{item.orderSn}}</text>
					<!-- -2=审核不通过,-1=已取消,0=待审核，1=待转账，2=已转账，3=已完成 -->
					<text class="orderStatus" v-if="item.status == -2">审核不通过</text>
					<text class="orderStatus" v-if="item.status == -1">已取消</text>
					<text class="orderStatus" v-if="item.status == 0">待审核</text>
					<text class="orderStatus" v-if="item.status == 1">待转账</text>
					<text class="orderStatus" v-if="item.status == 2">已转账</text>
					<text class="orderStatus" v-if="item.status == 3">已完成</text>
				</view>
				<view class="serviceList">
					<view class="serviceItem" v-for="(item2,index2) in item.orderItemList" :key="index2">
						<image :src="item2.picUrl" mode="" class="left"></image>
						<view class="right">
							<text class="name">{{item2.enterpriseServicesproductName}}</text>
							<text class="count">¥{{item2.promotionPrice}}x {{item2.buyNum}}</text>
						</view>
					</view>
				</view>
				<view class="footer">
					<view class="left">
						<text class="price">订单金额：¥{{item.payAmount}}</text>
						<text class="date">{{item.createTime}}</text>
					</view>
					<view class="right status1" v-if="item.status == 0" @tap="cancleOrder(item.id,-1)">取消订单</view>
					<view class="right status2" v-if="item.status == 1" @tap="cancleOrder(item.id,2)">去转账</view>
				</view>
			</view>
		</view>
		<view v-else class="nodata">
			<image src="../../static/nodata.png" mode=""></image>
			<text>暂无记录</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status:-1,
				list:[],
				loading:false
			};
		},
		async onLoad() {
			uni.showLoading({
				title:'加载中'
			})
			await this.getData()
			uni.hideLoading()
		},
		methods:{
			 getData(){
				 this.$http({
					apiName:"myCpService",
				}).then(res => {
					this.loading=true
					this.list = res.data
				}).catch(_ => {})
			},
			cancleOrder(id,type){
				// 状态：-1=取消，2=已转账
				let _text = type == -1 ? "确定取消该订单？" : "确定设置为已转账？";
				let _this = this;
				uni.showModal({
					title:"提示",
					content:_text,
					success(res) {
						if(res.confirm){
							_this.cancleOrder2(id,type)
						}
						
					}
				})
			},
			cancleOrder2(id,type){
				this.$http({
					apiName:"cancelCpService",
					type:"POST",
					data:{
						enterpriseServicesOrderId:id,
						status:type
					}
				}).then(res => {
					uni.showToast({
						title:"操作成功"
					})
					this.getData()
				}).catch(_ => {})
			}
		}
	}
</script>

<style lang="scss" scoped>
  page{
	  background: #F9FAFB;
  }
  .orderItem{
	  padding: 0 30rpx 30rpx;
	  background: #fff;
	  margin-bottom: 30rpx;
	  .banner{
		  display: flex;
		  justify-content: space-between;
		  height: 80rpx;
		  align-items: center;
		  // border-bottom: 2rpx solid #DBDBDB;
		  .orderNum{
			  font-size:26rpx;
			  font-weight:500;
			  color:rgba(48,49,51,1);
		  }
		  .orderStatus{
			  font-size:26rpx;
			  font-weight:500;
			  color:rgba(242,61,61,1);
		  }
	  }
	  .serviceList{
		  .serviceItem{
			  margin-top: 22rpx;
			  display: flex;
			  // justify-content: space-between;
			  .left{
				  height: 140rpx;
				  width: 140rpx;
				  margin-right: 20rpx;
			  }
			  .right{
				  display: flex;
				  flex-direction: column;
				  justify-content: space-around;
				  flex: 1;
				  .name{
					width: 100%;
					  font-size:28rpx;
					  font-weight:600;
					  color:rgba(48,49,51,1);
					  line-height:40rpx;
					  overflow: hidden;
					  // width: 400rpx;
					  // text-overflow:ellipsis;
					  display: -webkit-box;
					  -webkit-box-orient: vertical;
					  -webkit-line-clamp: 2;
				  }
				  .count{
					  font-size:24rpx;
					  font-weight:500;
					  color:rgba(168,171,179,1);
				  }
			  }
		  }
	  }
	  .footer{
	    margin-top: 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding-bottom: 30rpx;
		border-bottom: 2rpx solid #DBDBDB;
		.left{
			display: flex;
			flex-direction: column;
			.price{
				font-size:28rpx;
				font-weight:500;
				color:rgba(48,49,51,1);
			}
			.date{
				font-size:26rpx;
				font-weight:500;
				color:rgba(168,171,179,1);
				margin-top: 10rpx;
			}
		}
		.right{
			width:152rpx;
			height:56rpx;
			border-radius:28rpx;
			font-size:26rpx;
			font-weight:500;
			display: flex;
			justify-content: center;
			align-items: center;
			&.status1{
				border:2rpx solid rgba(242,61,61,1);
				color:rgba(242,61,61,1);
			}
			&.status2{
				background:rgba(242,61,61,1);
				color:#fff;
			}
		}
	  }
  }
  .orderItem:last-child{
	 margin-bottom: 0;
  }
  .nodata{
	  width: 30%;
	  display: flex;
	  justify-content: center;
	  flex-direction: column;
	  align-items: center;
	  margin:200rpx auto;
	  image{
		  width: 100%;
		  height: 200rpx;
		  margin-bottom: 20rpx;
	  }
	  text{
		  color: rgba(144, 147, 153, 1);
		  font-size:34rpx;
		  font-weight: 500;
	  }
  }
</style>
