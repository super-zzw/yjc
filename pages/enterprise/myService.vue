<template>
	<view>
		<view class="orderList">
			<view class="orderItem">
				<view class="banner">
					<text class="orderNum">订单编号：Q202007100001</text>
					<text class="orderStatus">待审核</text>
				</view>
				<view class="serviceList">
					<view class="serviceItem">
						<image src="../../static/mallLogo.png" mode="" class="left"></image>
						<view class="right">
							<text class="name">一项企业服务的名字，文字做两行的长度限文字做两行的长度限制文字做两行的长度限制</text>
							<text class="count">x 1</text>
						</view>
					</view>
					<view class="serviceItem">
						<image src="../../static/mallLogo.png" mode="" class="left"></image>
						<view class="right">
							<text class="name">一项企业服务的名字，文字做两行的长度限文字做两行的长度限制文字做两行的长度限制</text>
							<text class="count">x 1</text>
						</view>
					</view>
				</view>
				<view class="footer">
					<view class="left">
						<text class="price">订单金额：¥1200</text>
						<text class="date">2020.07.10 11:21:30</text>
					</view>
					<view class="right status1" v-if="status==-1">取消订单</view>
					<view class="right status2" v-if="status==1">去转账</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status:-1
			};
		},
		methods:{
			
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
		  border-bottom: 2rpx solid #DBDBDB;
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
</style>
