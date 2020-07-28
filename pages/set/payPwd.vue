<template>
	<view class="sWrap">
		<view class="sBox">
			<view class="sItem">
				<view class="slabel">短信验证码</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="number" v-model="code" placeholder="请输入短信验证码"/>
					<text class="stext"  @tap="sendCode">{{codeText}}</text>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">设置支付密码</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" maxlength="6" class="sinput w" type="password" v-model="password" placeholder="请输入6位数字支付密码"/>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">确认支付密码</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" maxlength="6" type="password" v-model="checkPassword" placeholder="请再次输入支付密码"/>
				</view>
			</view>
		
		</view>
		<button class="btn" :disabled="confirmBtnDisable" :loading="confirmBtnDisable" @tap="register" >完成</button>
	</view>
</template>

<script>
	import utils from 'utils/method.js'
		import {mapState} from 'vuex'
	export default{
		data(){
			return {
				code:"",
				password:"",
				checkPassword:"",
				
				timer:"",
				coding:false,  //是否处于发送验证码的状态
				timeLeft:120,
				codeText:"获取验证码",
				confirmBtnDisable: false
			}
		},
		computed:{
			...mapState(['userInfo'])
		},
		onLoad() {
			console.log(this.userInfo)
		},
		methods:{
			async register(){
				let _data = [
					
					{
						data:this.code,
						info:'验证码不能为空'
					},
					{
						data:this.password,
						info:'请输入支付密码'
					},
					{
						data:this.checkPassword,
						info:'请再次输入支付密码'
					},
					{
						data:(this.password == this.checkPassword) ? "1" : "",
						info:'两次输入的支付密码不一致'
					}
				]
				let jres = await utils.judgeData(_data)
				if(jres){
					this.confirmBtnDisable = true;
					await this.$http({
						apiName:"bindPayPwd",
						type:"POST",
						data:{
							// oldPassword:utils.md5(this.pwd),
							// newPassword:utils.md5(this.newPwd),
							tradepwd:utils.md5(this.password),
							authCode:this.code,
							// // #ifdef APP-PLUS
							// sourceType:1,  //0pc,1app,2公众号，3小程序
							// // #endif
							// // #ifdef H5
							// sourceType:2,  //0pc,1app,2公众号，3小程序
							// // #endif
							// // #ifdef MP-WEIXIN
							// sourceType:3,  //0pc,1app,2公众号，3小程序
							// // #endif
						}
					}).then(res => {
						uni.showToast({
							title:"设置成功"
						})
						utils.rmData()
						setTimeout(_ => {
							this.confirmBtnDisable = false;
							uni.reLaunch({
							    url: '/pages/user/user'
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
				await this.$http({
					apiName:'getCode',
					type:'POST',
					data:{
						phoneNumber:this.userInfo.phone
					}
				}).then(res=>{
					
				}).catch(err=>{
					
				})
				uni.hideLoading()
				// let _data = [
				// 	{
				// 		data:this.pwd,
				// 		info:'当前密码不能为空'
				// 	},
				// 	{
				// 		data:this.phone.trim(),
				// 		info:'手机号不能为空'
				// 	},
				// 	{
				// 		data:/^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/.test(this.phone.trim()) ? "1" : "",
				// 		info:'手机号格式不正确'
				// 	}
				// ]
				// let jres = await utils.judgeData(_data)
				// if(jres){
				// 	this.coding = true;
				// 	this.countDown();
				// 	await this.$http({
				// 		apiName:"changePwdCode",
				// 		type:"POST",
				// 		data:{
				// 			password:utils.md5(this.pwd),
				// 			phoneNumber:this.phone,
				// 		}
				// 	}).then(res => {
				// 		uni.hideLoading();
				// 	}).catch(_ => {
				// 		this.clearCountDown();
				// 		uni.hideLoading();
				// 	})
				// }else{
				// 	uni.hideLoading()
				// }
				
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