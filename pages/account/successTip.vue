<template>
	<view class="container" v-if="config">
		<view class="content" >
			<text class="iconfont iconchenggong"></text>
			<view v-if="status==1" class="txtBox">
				<text class="tit">提交成功</text>
				<text class="tit1">钱款将在{{config.DISTRIBUTE_WITHDRAW_SH}}个工作日内退回所填账户</text>
			</view>
			
			<text v-if="status==2" class="tit">钱款已转入对方账户</text>
			<text v-if="status==3" class="tit">钱款已转入对方聚财卡</text>
			<navigator :url="status==2?'./index?type=0':'./index?type=1'" class="nav">返回首页</navigator>
		</view>
		<!-- <view class="content" v-else>
			<text class="iconfont icontijiaoshibai"></text>
			<text class="tit">提交失败</text> -->
			<!-- <navigator url="./cashOut" class="nav" hover-class="none">重新提交</navigator> -->
			<!-- <navigator url="./index" class="nav1" hover-class="none">返回首页</navigator>
		</view> -->
		
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				status:1  //1:提现成功  2:账户转账成功  3:易聚财转账成功  
			};
		},
		onLoad(opt) {
			this.status=opt.status
			console.log(opt)
		},
		computed:{
			...mapState(['config'])
		}
	}
</script>

<style lang="scss" scoped>
	.container{
	      padding: 0 75rpx;
		.content{
				display: flex;
				flex-direction: column;
				align-items: center;
		}
		.iconfont{
			   margin-top: 148rpx;
			  color:#F23D3D;
			  font-size: 180rpx;
		}
		.tit{
			font-size:32rpx;
			font-family:PingFangSC-Semibold,PingFang SC;
			font-weight:600;
			color:rgba(70,71,72,1);
			line-height:44rpx;
			margin-top: 20rpx;
		}
		.tit1{
			font-size:28rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(144,147,153,1);
			line-height:40rpx;
			margin-top: 20rpx;
		}
		.nav{
			background:rgba(242,61,61,1);
			border-radius:40rpx;
			font-size:30rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:600;
			color:rgba(255,255,255,1);
			margin-top: 70rpx;
			width: 100%;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.nav1{
			background:#fff;
			border:2rpx solid rgba(242,61,61,1);
			border-radius:40rpx;
			font-size:30rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:600;
			color:#F23D3D;
			margin-top: 40rpx;
			width: 100%;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.txtBox{
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}
  
</style>
