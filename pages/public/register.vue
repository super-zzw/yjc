<template>
	<view class="sWrap">
		<view class="sBox">
			<view class="sItem">
				<view class="slabel">昵称</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="text" v-model="name" placeholder="请输入您的昵称"/>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">手机号</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="number" v-model="phone" placeholder="请输入您的手机号"/>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">短信验证码</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="text" v-model="code" placeholder="请输入短信验证码"/>
					<button :disabled="btnDisable"  hover-class="none" class="stext" @tap="sendCode">{{codeText}}</button>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">设置登录密码</view>
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
			<view class="sItem">
				<view class="slabel">邀请码（选填）</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="text" v-model="icode" placeholder="请输入邀请码"/>
				</view>
			</view>
		</view>
		<view class="toLogin"  @tap="toPage('/pages/public/login')">
			账号登录
		</view>
		<button class="btn" hover-class="none" :loading="registerBtnDisable" :disabled="registerBtnDisable" @tap="register" >完成注册</button>
		<view class="xieyi"> 
			注册即表示同意
			<text class="xieyi2" @tap="toArtcile(1)">商城协议</text>
		</view>
	</view>
</template>

<script>
	import utils from 'utils/method.js'
	export default{
		data(){
			return {
				name:"",
				phone:"",
				code:"",
				pwd:"",
				repwd:"",
				icode:"",
				timer:"",
				coding:false,  //是否处于发送验证码的状态
				timeLeft:120,
				codeText:"发送验证码",
				btnDisable: false,
				registerBtnDisable: false
			}
		},
		onLoad(opt) {
			if(opt.inviteCode){
				this.icode = opt.inviteCode
			}
		},
		methods:{
			toPage(url){
				uni.navigateTo({
					url:"/pages/public/login"
				})
			},
			toArtcile(id){
				uni.navigateTo({
					url:"/pages/article/article?id=" + id
				})
			},
			async register(){
				let _data = [
					{
						data:this.name.trim(),
						info:'昵称不能为空'
					},
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
					this.registerBtnDisable = true;
					await this.$http({
						apiName:"register",
						type:"POST",
						data:{
							wusername :this.name,
							password:utils.md5(this.pwd),
							phoneNumber:this.phone,
							sourceType:1,  //0pc,1app,2公众号，3小程序
							authCode:this.code,
							inviteCode:this.icode
						}
					}).then(res => {
						this.registerBtnDisable = false;
						uni.navigateTo({
						    url: '/pages/public/registerok'
						});
					}).catch(_ => {
						this.registerBtnDisable = false;
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
					this.btnDisable = true;
					await this.$http({
						apiName:"getCode",
						type:"POST",
						data:{
							phoneNumber:this.phone,
						}
					}).then(res => {
						this.coding = true
						let _self = this;
						this.btnDisable = false;
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
					}).catch(_ => {
						this.btnDisable = false;
					})
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
				margin-top: 6rpx;
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
					min-width: 160rpx;
					line-height: initial;
					height: auto;
					text-align: center;
					font-size: 24rpx;
					color: #F23D3D;
					border-radius: 30rpx;
					border: 2rpx solid #F23D3D;
					padding: 10rpx 16rpx;
					margin-left: 20rpx;
					background-color: #ffffff;
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
