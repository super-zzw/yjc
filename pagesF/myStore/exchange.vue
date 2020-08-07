<template >
	<view class="container">
		<view class="wrapper">
			<view class="inputCode">
				<text class="tip">兑换码</text>
				<input type="text" v-model="code" placeholder="请输入兑换码" placeholder-class="placeholder1" class="ipt"
				 @input="error=false"
				/>
				<text class="error" v-if="error">兑换码输入错误</text>
			</view>
			<button type="default" class="btn" :disabled="!isOk" @tap="exchangeok" :class="isOk?'btnok':''">确认兑换</button>
		</view>
		
	</view>
</template>

<script>
	import utils from "@/utils/method.js"
	export default {
		data() {
			return {
				code:'',
				isOk:true,
				error:false
			};
		},
		methods:{
			exchangeok(){
				this.isOk=false
				this.$http({
					apiName:'addCardAmount',
					type:'POST',
					data:{
						cardPwd:this.code
					}
				}).then(res=>{
						this.isOk=true
						utils.getUserInfo()
					uni.redirectTo({
						url:'./ex_success'
					})
				}).catch(err=>{
					this.isOk=true
					if(err.message=='储值卡账号和密码不匹配'){
						this.error=true
					}
					// console.log(err)
					
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
   .container{
	   // background: $page-color-base;
	   min-height: calc(100vh - 88rpx);
	   .wrapper{
		   padding: 0 32rpx 100rpx;
		     background: #fff;
			 
			 .inputCode{
			 		   padding: 32rpx 0;
			 		   display: flex;
			 		   flex-direction: column;
			 		 
			 		   .tip{
			 			   font-size:30rpx;
			 			   font-family:PingFangSC-Regular,PingFang SC;
			 			   font-weight:600;
			 			   color:rgba(48,49,51,1);
			 			   margin-bottom: 10rpx;
			 		   }
			 		   .ipt{
			 			   position: relative;
			 			   padding-bottom: 25rpx;
			 			   box-sizing: content-box;
			 		   }
			 		   .ipt::after{
			 			  content: '';
			 			  height: 2rpx;
			 			  width: 100%;
			 			  background: #DBDBDB;
			 			  position: absolute;
			 			  left: 0;
			 			  bottom: 0;
			 			  display: block;
			 		   }
					   .error{
						   font-size:24rpx;
						   font-family:PingFangSC-Regular,PingFang SC;
						   font-weight:500;
						   color:rgba(242,61,61,1);
						   margin-top: 14rpx;
					   }
			 }
			 .btn{
				margin-top: 88rpx;
				background:#FFB8B8;
				border-radius:44rpx;
				font-size:30rpx;
				font-family:PingFangSC-Semibold,PingFang SC;
				font-weight:600;
				color:rgba(255,255,255,1);
			 }
			 .btnok{
				 background:#F23D3D
			 }
	   }
	 
   }
</style>
