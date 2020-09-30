<template>
	<view class="container" v-if="config">
		<view class="content" >
			<text class="iconfont iconchenggong"></text>
			<view v-if="status==0||status==1" class="txtBox">
				<text class="tit">提交成功</text>
				<text class="tit1">钱款将在{{config.DISTRIBUTE_WITHDRAW_SH}}个工作日内退回所填账户</text>
			</view>
			<view>
				<text v-if="status==2" class="tit">钱款已转入对方账户</text>
				<text v-if="status==3" class="tit">钱款已转入对方聚财卡</text>
				
			</view>
			
			<view @tap="toIndex"  class="nav">返回</view>
			
			<view @tap="toDetail"  class="nav1" v-if="status==2||status==3">查看详情</view>
		</view>
		
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				status:-1  ,//1:提现成功  2:账户转账成功  3:易聚财转账成功  
				id:''
			};
		},
		onLoad(opt) {
			if(opt.status){
				this.status=opt.status
			}
			if(opt.id){
				this.id=opt.id
			}
			
			// console.log(opt)
		},
		computed:{
			...mapState(['config'])
		},
		methods:{
			toIndex(){
				let url
				if(this.status==0||this.status==2){
				  url='./index?type=0'
				}else{
					 url='./index?type=1'
				}
			
				uni.redirectTo({
					url
				})
			},
			toDetail(){
				uni.navigateTo({
					url:'../myBill/billDetail?id='+this.id
				})
			}
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
