<template>
	<view class="sWrap">
		<view class="sBox">
			<view class="sItem">
				<view class="slabel">卡号</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="text" v-model="account" 
					placeholder="请输入银行卡号"/>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">姓名</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="text" v-model="name" 
					placeholder="请输入银行卡账户姓名"/>
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
					<input placeholder-class="placeholderClass" class="sinput" v-model="remark" placeholder="对该账户进行备注"/>
				</view>
			</view>
			
		</view>
		
		<button class="btn" hover-class="none"  @tap="register" >确定</button>
		
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
				timer:"",
				coding:false,  //是否处于发送验证码的状态
				timeLeft:120,
				codeText:"获取验证码",
				type:0,
				id:""
			}
		},
		onLoad(opt) {
			
		},
		methods:{
			getDetail(){
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				this.$http({
					apiName:"fxAccountDetail",
					type:"POST",
					data:{
						id:this.id
					}
				}).then(res => {
					this.id = res.data.id;
					this.account = res.data.account;
					this.name = res.data.name;
					this.remark = res.data.title;
					uni.hideLoading();
				}).catch(err => {uni.hideLoading()})
			},
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
					uni.showLoading({
						title:"保存中...",
						mask:true
					})
					await this.$http({
						apiName:"fxAddWithdrawAccount",
						type:"POST",
						data:{
							account:this.account.trim(),
							authCode:this.code,
							name:this.name.trim(),
							title:this.remark,
							id:this.id,
							type:this.type
						}
					}).then(res => {
						uni.hideLoading();
						uni.showToast({
							icon:"success",
							title:"保存成功"
						})
						setTimeout(() => {
							uni.navigateBack()
						},1500)
					}).catch(err => {
						uni.hideLoading()
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
				this.coding = true;
				this.countDown();
				await this.$http({
					apiName:"getCurrentPhoneCode",
					type:"POST",
				}).then(res => {
					uni.hideLoading();
				}).catch(_ => {
					this.clearCountDown();
					uni.hideLoading();
				})
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
