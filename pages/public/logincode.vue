<template>
	<view class="container">
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">WELCOME BACK</view>
			<view class="welcome">
				欢迎回来！
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input 
						type="number" 
						:value="mobile" 
						placeholder="请输入手机号码"
						maxlength="11"
						data-key="mobile"
						@input="inputChange"
					/>
				</view>
				<view class="input-item">
					<view class="iitem">
						<text class="tit">验证码</text>
					</view>
					<view class="iitem-btn">
						<input
							type="mobile" 
							value="" 
							placeholder="请输入验证码"
							placeholder-class="input-empty"
							data-key="code"
							@input="inputChange"
							@confirm="toLogin"
							class="iitem-btn-input"
						/>
						<text class="tit2" @tap="getCode">{{codeText}}</text>
					</view>
				</view>
				<view class="forget-section forget-section2" @tap="toPage('/pages/public/login')">
					密码登录
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">登录</button>
		</view>
		<view class="suibian" @tap="toIndex">随便逛逛</view>
		<view class="register-section">
			<text @click="toPage('/pages/public/forgetpwd')">忘记密码</text>
			<text class="rscen">|</text>
			<text @click="toPage('/pages/public/register')">马上注册</text>
		</view>
	</view>
</template>

<script>
	// import {  
 //        mapState  
 //    } from 'vuex';
    import utils from 'utils/method.js'
	export default{
		data(){
			return {
				mobile: '',
				code: '',
				logining: false,
				timer:"",
				coding:false,  //是否处于发送验证码的状态
				timeLeft:120,
				codeText:"发送验证码"
			}
		},
		onLoad(){
			
		},
		methods: {
			toIndex(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
			toPage(url){
				uni.navigateTo({
					url:url
				})
			},
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack(){
				uni.navigateBack();
			},
			async getCode(){
				if(this.coding){
					return
				}
				let _data = [
					{
						data:this.mobile.trim(),
						info:'手机号不能为空'
					},
					{
						data:/^[1][3,4,5,7,8][0-9]{9}$/.test(this.mobile.trim()) ? "1" : "",
						info:'手机号格式不正确'
					}
				]
				let jres = await utils.judgeData(_data)
				if(jres){
					await this.$http({
						apiName:"getCode",
						type:"POST",
						data:{
							phoneNumber:this.mobile,
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
					
				}
			},
			async toLogin(){
				if(this.logining){
					return
				}
				this.logining = true;
				let _data = [
					{
						data:this.mobile.trim(),
						info:'手机号不能为空'
					},
					{
						data:this.code,
						info:'验证码不能为空'
					},
				]
				let jres = await utils.judgeData(_data)
				if(jres){
					await this.$http({
						apiName:"codeLogin",
						type:"POST",
						data:{
							authCode:this.code,
							phoneNumber:this.mobile,
						}
					}).then(res => {
						utils.setSesion(res.data)
						utils.afterLoginJump()
					}).catch(_ => {})
				}
				this.logining = false;
			},
		},
		beforeDestroy() {
			clearInterval(this.timer);
		}
	}
</script>

<style lang='scss'>
	page{
		background: #fff;
	}
	.container{
		padding-top: 115px;
		position:relative;
		width: 100vw;
		min-height: calc(100vh - 92rpx);
		overflow: hidden;
		background: #fff;
		box-sizing: border-box;
		background-image: url('/static/loginbgk.png');
		background-repeat: no-repeat;
		background-size: cover;
		.suibian{
			font-size: 12px;
			color: #4399fc;
			margin-top: 60rpx;
			text-align: center;
		}
	}
	.wrapper{
		position:relative;
		z-index: 90;
		/* background: #fff; */
		padding-bottom: 40rpx;
	}
	.back-btn{
		position:absolute;
		left: 40rpx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40rpx;
		font-size: 40rpx;
		color: $font-color-dark;
	}
	.left-top-sign{
		font-size: 80rpx;
		font-weight: bold;
		color: $page-color-base;
		position:relative;
		left: 60rpx;
	}
	.right-top-sign{
		position:absolute;
		top: 80rpx;
		right: -30rpx;
		z-index: 95;
		&:before, &:after{
			display:block;
			content:"";
			width: 400rpx;
			height: 80rpx;
			background: #b4f3e2;
		}
		&:before{
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
		&:after{
			position: absolute;
			right: -198rpx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	.left-bottom-sign{
		position:absolute;
		left: -270rpx;
		bottom: -320rpx;
		border: 100rpx solid #d0d1fd;
		border-radius: 50%;
		padding: 180rpx;
	}
	.welcome{
		position:relative;
		left: 50rpx;
		top: -90rpx;
		font-size: 46rpx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.input-content{
		padding: 0 60rpx;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30rpx;
		background:$page-color-light;
		height: 120rpx;
		border-radius: 4px;
		margin-bottom: 50rpx;
		&:last-child{
			margin-bottom: 0;
		}
		.iitem{
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
		}
		.tit{
			/* height: 50rpx; */
			/* line-height: 56rpx; */
			font-size: $font-sm+2rpx;
			color: $font-color-base;
		}
		input{
			height: 60rpx;
			font-size: $font-base + 2rpx;
			color: $font-color-dark;
			width: 100%;
		}
		.iitem-btn{
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			.iitem-btn-input{
				flex: 1;
				padding-right: 10rpx;
			}
			.tit2{
				min-width: 160rpx;
				text-align: center;
				font-size: 24rpx;
				color: #F23D3D;
				border-radius: 30rpx;
				border: 2rpx solid #F23D3D;
				padding: 10rpx 16rpx;
			}
		}
	}

	.confirm-btn{
		width: 630rpx;
		height: 76rpx;
		line-height: 76rpx;
		border-radius: 50px;
		margin-top: 40rpx;
		background: #F23D3D;
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
		font-size: $font-sm+2rpx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40rpx;
	}
	.forget-section2{
		text-align: right;
		margin-top: -20rpx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50rpx;
		width: 100%;
		font-size: $font-sm+2rpx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10rpx;
		}
		.rscen{
			margin-left: 20rpx;
			margin-right: 20rpx;
		}
	}
</style>
