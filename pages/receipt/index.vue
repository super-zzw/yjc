<template>
	<view v-if="userInfo" class="container">
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
				<text class="txt2" v-if="userInfo.phone">收款方：{{userInfo.wusername}}（手机尾号{{userInfo.phone.slice(7)}}）</text>
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
	import tkiBarcode from "@/components/tki-barcode/tki-barcode.vue"
	import utils from '@/utils/method.js'
	import {mapState} from 'vuex'
	export default {
		components:{tkiQrcode,tkiBarcode},
		data() {
			return {
				 size:340,
				 onval:true,  //动态生成二维码,
				 coinAddr:'',
				 loadingText:"二维码生成中"
			};
		},
		async onLoad() {
			
			// if(!this.userInfo){
			// 	await utils.getUserInfo()
			// }
			// this.setCode()
		},
		onShow() {
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
		},
	}
</script>

<style lang="scss" scoped>
	.container{
		 background: #F23D3D;
		 height: 100vh;
	}
	.recimg{
	     display: flex;
	     justify-content: center;
	     margin-top: 16rpx;
	
	    }
   .sBox1{
	  
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
			   padding: 22rpx 0;
			   border-bottom: 2rpx solid #dbdbdb;
			   width: 90%;
			  text-align: center;
			   margin: 0 30rpx 40rpx;
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
	   background: #fff;
	   height: 90rpx;
	   display: flex;
	   align-items: center;
	   padding: 0 35rpx;
	   margin: 0 32rpx;
	   
border-radius: 8rpx;
	   justify-content: space-between;
	   .record{
		   font-size:32rpx;
		   
		   font-family:PingFangSC-Medium,PingFang SC;
		   font-weight:500;
		   color:#000;
	   }
	   .iconfont{
		   color: #000;
	   }
   }
</style>
