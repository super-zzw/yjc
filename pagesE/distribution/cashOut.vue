<template>
	<view class="container">
		<view class="accountBox" @tap="accountSel">
			<view class="left">
				<image src="../image/zhifubao.png" mode="" class="accountImg"></image>
				<view class="info">
					<text class="name">支付宝账户1</text>
					<text class="num">187****2736</text>
				</view>
			</view>
			<text class="iconfont iconchakanquanbu"></text>
		</view>
		<view class="moneyBox">
			<text class="txt1">提现金额</text>
			<view class="iptBox">￥<input type="number" value="" v-model="money"/></view>
			<text class="divider"></text>
			<text class="txt2">可提现金额¥288</text>
			<button type="default" hover-class="none" @tap="tx">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money:''
			};
		},
		methods:{
			accountSel(){
				uni.navigateTo({
					url:'./accountSel'
				})
			},
			tx(){
				uni.navigateTo({
					url:'./txTip?status='+0
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		height: 100vh;
		background: #F9FAFB;;
	}
   .accountBox{
	   background: #fff;
	   padding: 36rpx 40rpx;
	   display: flex;
	   justify-content: space-between;
	   align-items: center;
	   
	   .left{
		   display: flex;
		  .accountImg{
			  width: 88rpx;
			  height:88rpx;
			  margin-right:28rpx
		  }
		  .info{
			  display: flex;
			  flex-direction: column;
			  .name{
				  font-size:32rpx;
				  font-family:PingFangSC-Regular,PingFang SC;
				  font-weight:500;
				  color:rgba(48,49,51,1);
			  }
			  .num{
				  font-size:28rpx;
				  font-family:PingFangSC-Regular,PingFang SC;
				  font-weight:400;
				  color:rgba(168,171,179,1);
			  }
		 }
	   }
   }
   .moneyBox{
	   margin-top: 20rpx;
	   padding: 32rpx 32rpx 80rpx;
	   background: #fff;
	   display: flex;
	   flex-direction: column;
	   .txt1{
		   font-size:30rpx;
		   font-family:PingFangSC-Regular,PingFang SC;
		   font-weight:500;
		   color:rgba(48,49,51,1);
		   line-height:42px;
		}
		.iptBox,.iptBox input{
			display: flex;
			font-size:44rpx;
			font-family:PingFangSC-Medium,PingFang SC;
			font-weight:500;
			color:rgba(48,49,51,1);
			line-height:60rpx;
			
		}
		.divider{
			
			height: 2rpx;
			width: 100%;
			background: #DBDBDB;
			margin-top: 20rpx;
		}
		.txt2{
			margin-top: 20rpx;
			font-size:30rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(144,147,153,1);
			line-height:42rpx;
		}
		button{
			background:rgba(242,61,61,1);
			border-radius:44rpx;
			width: 100%;
			margin-top: 60rpx;
			font-size:30rpx;
			font-family:PingFangSC-Semibold,PingFang SC;
			font-weight:600;
			color:rgba(255,255,255,1);
		}
   }
</style>
