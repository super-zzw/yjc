<template>
	<view class="container" v-if="flag">
		<view class="price" v-if="desc.type==0">- <text>{{desc.amountStr}}</text></view>
		<view class="price" v-if="desc.type==1">+ <text>{{desc.amountStr}}</text></view>
		<text class="desc">{{desc.title}}</text>
		<view class="infoBox">
			<view class="section">
				<text class="left">交易账号</text>
				<text class="right">{{desc.cardno}}</text>
			</view>
			<view class="section">
				<text class="left">转账出/入账号</text>
				<text class="right">{{desc.othercardno}}</text>
			</view>
			<view class="section">
				<text class="left">交易类型</text>
				<text class="right">{{desc.tradetypeTitle}}</text>
			</view>
			<view class="section">
				<text class="left">商品名</text>
				<text class="right">{{desc.goodsname}}</text>
			</view>
			<view class="section" v-if="desc.bankcardno">
				<text class="left">银行卡号</text>
				<text class="right">{{desc.bankcardno}}</text>
			</view>
			<view class="section">
				<text class="left">交易金额</text>
				<text class="right">{{desc.amountStr}}</text>
			</view>
			<view class="section">
				<text class="left">手续费</text>
				<text class="right">{{desc.fee}}</text>
			</view>
			<view class="section">
				<text class="left">交易后余额</text>
				<text class="right">{{desc.balanceStr}}</text>
			</view>
			<view class="section">
				<text class="left">交易时间</text>
				<text class="right">{{desc.createTime}}</text>
			</view>
			<view class="section">
				<text class="left">交易订单号</text>
				<text class="right">{{desc.orderno}}</text>
			</view>
			<view class="section">
				<text class="left">商户订单号</text>
				<text class="right">{{desc.merchorderno}}</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				desc:{},
				flag:false
			};
		},
		async onLoad(opt) {
			if(opt.id){
				await this.getInfo(opt.id)
			}
			
		},
		methods:{
			getInfo(id){
				this.$http({
					apiName:"getBillInfo",
				    data:{
						cardOrderLogId:id
					}
				}).then(res=>{
					this.flag=true
					this.desc=res.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 30rpx;
	}
  .price{
	  font-size:48rpx;
	  font-weight:600;
	  color:rgba(247,44,44,1);
	  margin-top: 60rpx;
	  text{
		  display: inline-block;
		  margin-left: 10rpx;
	  }
  }
  .desc{
	  font-size:32rpx;
	  font-weight:500;
	  color:rgba(48,49,51,1);
	  margin-top: 10rpx;
  }
  .infoBox{
	  margin-top: 60rpx;
	   width: 100%;
	  .section{
		  display: flex;
		  justify-content: space-between;
		  border-bottom: 2rpx solid #DBDBDB;
		  padding: 20rpx 0;
		 
		  .left{
			  font-size:28rpx;
			  font-weight:500;
			  color:rgba(144,147,153,1);
		  }
		  .right{
			  font-size:28rpx;
			  font-weight:500;
			  color:rgba(48,49,51,1);
		  }
	  }
  }
  
</style>
