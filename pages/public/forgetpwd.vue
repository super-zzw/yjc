<template>
	<view class="sWrap">
		<view class="sBox">
			<view class="sItem">
				<view class="slabel">手机号</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="number" v-model="phone" placeholder="请输入您注册的手机号"/>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">短信验证码</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="text" v-model="code" placeholder="请输入短信验证码"/>
					<text class="stext" @tap="sendCode">{{codeText}}</text>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">重置登录密码</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="password" v-model="pwd" placeholder="请输入密码"/>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">确认密码</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="password" v-model="repwd" placeholder="请再次输入密码"/>
				</view>
			</view>
		</view>
		<view class="btn" @tap="register">确认</view>
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
				repwd:"",
				timer:"",
				coding:false,  //是否处于发送验证码的状态
				timeLeft:120,
				codeText:"发送验证码"
			}
		},
		methods:{
			async register(){
				let _data = [
					{
						data:this.phone.trim(),
						info:'手机号不能为空'
					},
					{
						data:/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone.trim()) ? "1" : "",
						info:'手机号格式不正确'
					},
					{
						data:this.code,
						info:'验证码不能为空'
					},
					{
						data:this.pwd,
						info:'密码不能为空'
					},
					{
						data:this.repwd,
						info:'请再次输入密码'
					},
					{
						data:(this.pwd == this.repwd) ? "1" : "",
						info:'两次输入密码不一致'
					}
				]
				let jres = await utils.judgeData(_data)
				if(jres){
					await this.$http({
						apiName:"resetPwd",
						type:"POST",
						data:{
							newPassword:utils.md5(this.pwd),
							phoneNumber:this.phone,
							sourceType:1,  //0pc,1app,2公众号，3小程序
							authCode:this.code,
						}
					}).then(res => {
						uni.showToast({
							title:"重置成功"
						})
						setTimeout(_ => {
							uni.navigateTo({
							    url: '/pages/public/login'
							});
						},2000)
					}).catch(_ => {})
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
						data:/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone.trim()) ? "1" : "",
						info:'手机号格式不正确'
					}
				]
				let jres = await utils.judgeData(_data)
				if(jres){
					await this.$http({
						apiName:"getCode",
						type:"POST",
						data:{
							phoneNumber:this.phone,
						}
					}).then(res => {
						this.coding = true
						let _self = this;
						this.timer = setInterval(() => {
							  _self.codeText = "请稍后" + _self.timeLeft + 's'
							  _self.timeLeft -= 1;
							  if (_self.timeLeft == 0) {
								   clearInterval(_self.timer);
								  _self.coding = false
								  _self.timeLeft = 120
								  _self.codeText = "发送验证码"
							}
						},1000)
					}).catch(_ => {})
					uni.hideLoading()
				}else{
					uni.hideLoading()
				}
				
			}
		},
		beforeDestroy() {
			clearInterval(this.timer);
		}
	}
</script>

<style lang="scss" scoped>
.sWrap{
	min-height: 100vh;
	background-color: #fff;
	padding-left: 32rpx;
	padding-right: 32rpx;
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
				}
				.placeholderClass{
					color: #909399;
					font-size: 30rpx;
				}
				.stext{
					color: #F23D3D;
					border: 2rpx solid #F23D3D;
					border-radius: 20rpx;
					font-size: 24rpx;
					min-width: 160rpx;
					text-align: center;
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
	}
	.btn:active{
		opacity: 0.3;
	}
}
</style>
