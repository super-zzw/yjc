<template>
	<view class="sWrap">
		<view class="sBox">
			<view class="sItem">
				<view class="slabel">{{type==0?'账号':'卡号'}}</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="text" v-model="account" 
					:placeholder="type==0?'请输入支付宝账号':'请输入银行卡号'"/>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">姓名</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="text" v-model="name" 
					:placeholder="type==0?'请输入支付宝实名姓名':'请输入银行卡账户姓名'"/>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">手机验证码</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="text" v-model="code" placeholder="请输入手机验证码"/>
					<text  hover-class="none" class="stext" @tap="sendCode">{{codeText}}</text>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">备注</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="password" v-model="remark" placeholder="对该账户进行备注"/>
				</view>
			</view>
			
		</view>
		
		<button class="btn" hover-class="none" :loading="registerBtnDisable" :disabled="registerBtnDisable" @tap="register" >确定</button>
		
	</view>
</template>

<script>
	import utils from 'utils/method.js'
	export default{
		data(){
			return {
				account:"",
				name:"",
				code:"",
				remark:"",
				repwd:"",
				icode:"",
				timer:"",
				coding:false,  //是否处于发送验证码的状态
				timeLeft:120,
				codeText:"获取验证码",
				registerBtnDisable: false,
				type:0
			}
		},
		onLoad(opt) {
			this.type=opt.type
			if(opt.type==1){
				uni.setNavigationBarTitle({
					title: '添加银行卡账户'
				});
			}
		},
		methods:{
			async register(){
				let _data = [
					{
						data:this.account.trim(),
						info:'账号不能为空'
					},
					{
						data:this.name.trim(),
						info:'姓名不能为空'
					},
					{
						data:this.code,
						info:'验证码不能为空'
					},
				]
				let jres = await utils.judgeData(_data)
				if(jres){
					this.registerBtnDisable = true;
				// 	await this.$http({
				// 		apiName:"register",
				// 		type:"POST",
				// 		data:{
				// 			wusername :this.name,
				// 			password:utils.md5(this.pwd),
				// 			phoneNumber:this.phone,
				// 			sourceType:1,  //0pc,1app,2公众号，3小程序
				// 			authCode:this.code,
				// 			inviteCode:this.icode
				// 		}
				// 	}).then(res => {
				// 		this.registerBtnDisable = false;
				// 		uni.navigateTo({
				// 		    url: '/pages/public/registerok'
				// 		});
				// 	}).catch(_ => {
				// 		this.registerBtnDisable = false;
				// 	})
				}
				
			},
			async sendCode(){
				if(this.coding){
					return
				}
				uni.showLoading({
					title:"获取验证码...",
					mask:true
				})
				let _data = [
					{
						data:this.phone.trim(),
						info:'手机号不能为空'
					},
					{
						data:/^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/.test(this.phone.trim()) ? "1" : "",
						info:'手机号格式不正确'
					}
				]
				let jres = await utils.judgeData(_data)
				if(jres){
					this.coding = true;
					this.countDown();
					await this.$http({
						apiName:"getCode",
						type:"POST",
						data:{
							phoneNumber:this.phone,
						}
					}).then(res => {
						uni.hideLoading();
					}).catch(_ => {
						this.clearCountDown();
						uni.hideLoading();
					})
				}else{
					uni.hideLoading()
				}
			},
			countDown(){
				this.timer = setInterval(() => {
					  this.codeText = "请稍后" + this.timeLeft + 's'
					  this.timeLeft -= 1;
					  if(this.timeLeft == 0){
						  this.clearCountDown();
					  }
				},1000)
			},
			clearCountDown(){
				  clearInterval(this.timer);
				  this.coding = false
				  this.timeLeft = 120
				  this.codeText = "发送验证码"
			},
		},
		beforeDestroy() {
			clearInterval(this.timer);
		}
	}
</script>

<style lang="scss" scoped>
.sWrap{
	/* #ifdef H5 */
	height: calc(100vh - 88rpx);
	/* #endif */
	/* #ifdef APP-PLUS */
	height: 100vh;
	/* #endif */
	background-color: #fff;
	padding-left: 32rpx;
	padding-right: 32rpx;
	.toLogin{
		text-align: right;
		color: #4399fc;
		font-size: 24rpx;
		margin-top: 20rpx;
	}
	.xieyi{
		color: #909399;
		font-size: 24rpx;
		text-align: center;
		margin-top: 30rpx;
		.xieyi2{
			color: $font-color-spec;
		}
	}
	.sBox{
		.sItem{
			padding-top: 24rpx;
			padding-bottom: 24rpx;
			border-bottom: 2rpx solid #DBDBDB;
			.slabel{
				color: #303133;
				font-size: 30rpx;
			}
			.sinputbox{
				margin-top: 15rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.sinput{
					color: #303133;
					font-size: 30rpx;
					width: 100%;
				}
				.placeholderClass{
					color: #909399;
					font-size: 30rpx;
				}
				.stext{
					min-width: 200rpx;
					text-align: center;
					font-size: 24rpx;
					color: #F23D3D;
					border-radius: 30rpx;
					border: 2rpx solid #F23D3D;
					padding: 10rpx 16rpx;
					margin-left: 20rpx;
				}
			}
			
		}
	}
	.btn{
		line-height: 88rpx;
		background-color: #F23D3D;
		color: #Fff;
		font-size: 30rpx;
		border-radius: 44rpx;
		margin-top: 70rpx;
		text-align: center;
		height: auto;
	}
	.btn:active{
		opacity: 0.3;
	}
}
</style>
