<template>
	<view class="container" v-if="config">
		<view class="content" >
			<text class="iconfont iconchenggong"></text>
			<view  class="txtBox">
				<text class="tit">提交成功</text>
				<text class="tit1">您可以在企业服务页面「我的企业服务」中</text>
				<text class="tit1">查看已购买的企业服务</text>
			</view>
			
			<navigator url="./index" class="nav">查看我的企业服务</navigator>
			<navigator url="./index" class="nav nav1">返回首页</navigator>
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
			font-size: 30rpx;
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
			color:#F23D3D;
			margin-top: 40rpx;
			
		}
		.txtBox{
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}
  
</style>
