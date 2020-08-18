<template>
	<view>
		<view class="sBox1">
			<view class="main">
				<text class="txt1">易聚财扫一扫，向我付钱</text>
				<!-- <image :src="qrCode" mode="" class="qrCode"></image> -->
				<view class="recimg">
				     <tki-qrcode
				     ref="qrcode"
				     :val="coinAddr"
				     :size="size"
				     :onval="onval"
				     :loadingText="loadingText"/>
				    </view>
				<text class="txt2">收款方：{{userInfo.wusername}}（手机尾号{{userInfo.phone.slice(7)}}）</text>
			</view>
		</view>
		<view class="sBox2" @tap="toMyBill">
			<text class="record">收款记录</text>
			<text class="iconfont iconchakanquanbu"></text>
		</view>
	</view>
</template>

<script>
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	import utils from '@/utils/method.js'
	import {mapState} from 'vuex'
	export default {
		components:{tkiQrcode},
		data() {
			return {
				 qrCode:'../../static/yijucai.png',
				 size:340,
				 onval:true,  //动态生成二维码,
				 coinAddr:'',
				 loadingText:"二维码生成中"
			};
		},
		async onLoad() {
			await utils.getUserInfo()
			this.setCode()
		},
		computed:{
			...mapState(['userInfo'])
		},
		methods:{
			setCode(){
				setTimeout(()=>{
					this.coinAddr = this.userInfo.cardCode
				})
				
			},
			toMyBill(){
				uni.navigateTo({
					url:'../myBill/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.recimg{
	     display: flex;
	     justify-content: center;
	     margin-top: 16rpx;
	
	    }
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
