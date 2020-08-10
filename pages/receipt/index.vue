<template>
	<view>
		<view class="sBox1">
			<view class="main">
				<text class="txt1">易聚财扫一扫，向我付钱</text>
				<image :src="qrCode" mode="" class="qrCode"></image>
				<text class="txt2">收款方：菊次郎的夏天（手机尾号3342）</text>
			</view>
		</view>
		<view class="sBox2">
			<text class="record">收款记录</text>
			<text class="iconfont iconchakanquanbu"></text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				 qrCode:'../../static/yijucai.png'
			};
		}
	}
</script>

<style lang="scss" scoped>
   .sBox1{
	   background: #F23D3D;
	   padding:0 32rpx 60rpx;
	   .main{
		   background: #fff;
		   display: flex;
		   justify-content: center;
		   border-radius:8rpx;
		   align-items: center;
		   flex-direction: column;
		   .txt1{
			   margin-top: 60rpx;
			   font-size:30rpx;
			   font-weight:600;
			   color:rgba(48,49,51,1);
		   }
		   .qrCode{
			   width: 360rpx;
			   height: 360rpx;
			   margin-top: 30rpx;
			}
			.txt2{
				margin-top: 64rpx;
				font-size:30rpx;
				font-weight:500;
				color:rgba(48,49,51,1);
				margin-bottom: 22rpx;
			}
	   }
   }
   .sBox2{
	   background: #FF4C4C;
	   height: 90rpx;
	   display: flex;
	   align-items: center;
	   padding: 0 35rpx;
	   justify-content: space-between;
	   .record{
		   font-size:32rpx;
		   font-family:PingFangSC-Medium,PingFang SC;
		   font-weight:500;
		   color:rgba(255,255,255,1);
	   }
	   .iconfont{
		   color: #fff;
	   }
   }
</style>
