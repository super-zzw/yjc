<template>
	<view class="sWrap">
		<view class="sBox">
			<view class="sItem">
				<view class="slabel">登录密码</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="password" v-model="pwd" placeholder="请输入密码"/>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">当前手机号</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" maxlength="11" class="sinput w" type="number" v-model="phone" placeholder="请输入当前手机号"/>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">短信验证码</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="text" v-model="code" placeholder="请输入短信验证码"/>
					<text class="stext"  @tap="sendCode">{{codeText}}</text>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">新手机号</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" maxlength="11" class="sinput w" type="number" v-model="newPhone" placeholder="请输入新手机号"/>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">短信验证码</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="text" v-model="newCode" placeholder="请输入短信验证码"/>
					<text class="stext"  @tap="sendCode2">{{codeText2}}</text>
				</view>
			</view>
		</view>
		<button class="btn" :disabled="confirmBtnDisable" :loading="confirmBtnDisable" @tap="register" >确认</button>
	</view>
</template>

<script>
	import utils from 'utils/method.js'
	export default{
		data(){
			return {
				phone:"",
				code:"",
				pwd:"",
				newPhone:"",
				newCode:"",
				confirmBtnDisable: false,
				
				timer:"",
				coding:false,  //是否处于发送验证码的状态
				timeLeft:120,
				codeText:"发送验证码",
				
				timer2:"",
				coding2:false,  //是否处于发送验证码的状态
				timeLeft2:120,
				codeText2:"发送验证码",
			}
		},
		methods:{
			async register(){
				let _data = [
					{
						data:this.pwd,
						info:'当前密码不能为空'
					},
					{
						data:this.phone.trim(),
						info:'当前手机号不能为空'
					},
					{
						data:/^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/.test(this.phone.trim()) ? "1" : "",
						info:'当前手机号格式不正确'
					},
					{
						data:this.code,
						info:'当前手机号验证码不能为空'
					},
					{
						data:this.newPhone.trim(),
						info:'新手机号不能为空'
					},
					{
						data:/^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/.test(this.newPhone.trim()) ? "1" : "",
						info:'新手机号格式不正确'
					},
					{
						data:this.newCode,
						info:'新手机号验证码不能为空'
					},
				]
				let jres = await utils.judgeData(_data)
				if(jres){
					this.confirmBtnDisable = true;
					await this.$http({
						apiName:"changePhone",
						type:"POST",
						data:{
							password:utils.md5(this.pwd),
							oldPhoneNumber:this.phone,
							newPhoneNumber:this.newPhone,
							oldAuthCode:this.code,
							newAuthCode:this.newCode,
							// #ifdef APP-PLUS
							sourceType:1,  //0pc,1app,2公众号，3小程序
							// #endif
							// #ifdef H5
							sourceType:2,  //0pc,1app,2公众号，3小程序
							// #endif
							// #ifdef MP-WEIXIN
							sourceType:3,  //0pc,1app,2公众号，3小程序
							// #endif
						}
					}).then(res => {
						uni.showToast({
							title:"修改成功，请重新登录"
						})
						utils.rmData()
						setTimeout(_ => {
							this.confirmBtnDisable = false;
							uni.reLaunch({
							    url: '/pages/public/login'
							});
						},2000)
					}).catch(_ => {
						this.confirmBtnDisable = false;
					})
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
						data:this.pwd,
						info:'当前密码不能为空'
					},
					{
						data:this.phone.trim(),
						info:'当前手机号不能为空'
					},
					{
						data:/^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/.test(this.phone.trim()) ? "1" : "",
						info:'当前手机号格式不正确'
					}
				]
				let jres = await utils.judgeData(_data)
				if(jres){
					this.coding = true;
					this.countDown();
					await this.$http({
						apiName:"changePwdCode",
						type:"POST",
						data:{
							password:utils.md5(this.pwd),
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
			async sendCode2(){
				if(this.coding2){
					return
				}
				uni.showLoading({
					title:"获取验证码...",
					mask:true
				})
				let _data = [
					{
						data:this.newPhone.trim(),
						info:'新手机号不能为空'
					},
					{
						data:/^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/.test(this.newPhone.trim()) ? "1" : "",
						info:'新手机号格式不正确'
					}
				]
				let jres = await utils.judgeData(_data)
				if(jres){
					this.coding2 = true;
					this.countDown2();
					await this.$http({
						apiName:"getCode",
						type:"POST",
						data:{
							phoneNumber:this.newPhone,
						}
					}).then(res => {
						uni.hideLoading();
					}).catch(_ => {
						this.clearCountDown2();
						uni.hideLoading();
					})
				}else{
					uni.hideLoading()
				}
				
			},
			countDown2(){
				this.timer2 = setInterval(() => {
					  this.codeText2 = "请稍后" + this.timeLeft2 + 's'
					  this.timeLeft2 -= 1;
					  if(this.timeLeft2 == 0){
						  this.clearCountDown2();
					  }
				},1000)
			},
			clearCountDown2(){
				  clearInterval(this.timer2);
				  this.coding2 = false
				  this.timeLeft2 = 120
				  this.codeText2 = "发送验证码"
			},
		},
		beforeDestroy() {
			clearInterval(this.timer);
			clearInterval(this.timer2);
		}
	}
</script>

<style lang="scss" scoped>
.sWrap{
	background-color: #fff;
	padding-left: 32rpx;
	padding-right: 32rpx;
	/* #ifdef H5 */
	height: calc(100vh - 88rpx);
	/* #endif */
	/* #ifdef APP-PLUS */
	height: 100vh;
	/* #endif */
	.xieyi{
		color: #909399;
		font-size: 24rpx;
		text-align: center;
		margin-top: 20rpx;
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
				margin-top: 6rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.sinput{
					color: #303133;
					font-size: 30rpx;
					&.w{
						width: 500rpx;
					}
				}
				.placeholderClass{
					color: #909399;
					font-size: 30rpx;
				}
				.stext{
					color: #F23D3D;
					border: 2rpx solid #F23D3D;
					border-radius: 30rpx;
					font-size: 24rpx;
					min-width: 200rpx;
					margin: 0;
					text-align: center;
					padding: 10rpx 16rpx;
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
		margin-top: 120rpx;
		text-align: center;
		transition: opacity .2s ;
		height: auto;
	}
	.btn:active{
		opacity: 0.3;
	}
}
</style>