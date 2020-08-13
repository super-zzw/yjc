<template>
	<view class="sWrap">
		<view class="sBox">
			<view class="sItem">
				<view class="slabel">{{type==2?'平台用户账号':'聚财卡卡号'}}</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="number" v-model="account" 
					:placeholder="type==2?'请输入平台用户账号':'请输入聚财卡号'" @blur="getAccountName" maxlength="10"/>
				</view>
				
			</view>
			<text v-if="aacountName&&flag" class="aacountName">该账号对应账户名“{{aacountName}}”</text>
			<text class="aacountName" v-if="flag&&!aacountName" style="color:red">此用户不存在</text>
			<view class="sItem">
				<view class="slabel">转账金额</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="number" v-model="money" 
					placeholder="请输入转账金额"/>
				</view>
			</view>
			<!-- <view class="sItem">
				<view class="slabel">手机验证码</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" type="text" v-model="code" placeholder="请输入手机验证码"/>
					<text  hover-class="none" class="stext" @tap="sendCode">{{codeText}}</text>
				</view>
			</view> -->
			<view class="sItem">
				<view class="slabel">备注</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput" v-model="remark" placeholder="添加备注(50字以内)"/>
				</view>
			</view>
			
		</view>
		
		<button class="btn" hover-class="none"  @tap="register" :disabled="disable">确定</button>
		
	</view>
</template>

<script>
	import utils from 'utils/method.js'
	export default{
		data(){
			return {
				account:"",
				money:"",
				remark:"",
				type:2,
				_type:'',
				id:"",
				aacountName:'',
				flag:false,
				hasUser:false,
				disable:false
			}
		},
		onLoad(opt) {
			this.type = opt.type;
			let _title=''
			if(this.type==2){
				_title='账户转账'
				this._type=1
			}else{
				_title='聚财卡转账'
				this._type=2
			}
			uni.setNavigationBarTitle({
				title: _title
			});
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
			async getAccountName(){
				if(!this.account){
					this.flag=false
					return
					
				}else if(this.account.length<8){
					this.flag=false
					uni.showToast({
						icon:'none',
						title:'请输入8-10位银行卡号'
					})
				}
				else{
					this.flag=false
					
					await this.$http({
						apiName:'getAccountName',
						
						data:{
							cardCode:this.account,
							type:this._type
						}
					}).then(res=>{
						this.flag=true
					    if(res.data){
							this.hasUser=true
						}
							this.aacountName=res.data
					
					}).catch(err=>{})
				}
			},
			async register(){
				let _data = [
					{
						data:this.account.trim(),
						info:'账号不能为空'
					},
					{
						data:this.account.length>=8,
						info:'请输入8-10位银行卡号'
					},
					{
						data:this.hasUser,
						info:'账号不存在'
					},
					{
						data:this.money.trim(),
						info:'转账金额不能为空'
					}
				]
				let jres = await utils.judgeData(_data)
				console.log(jres)
				if(jres){
					this.disable=true
					uni.showLoading({
						title:"保存中...",
						mask:true
					})
					await this.$http({
						apiName:"yjcTransfer",
						type:"POST",
						data:{
							amount:this.money,
							cardCode:this.account,
							remark:this.remark,
							type:this._type
						}
					}).then(res => {
						uni.hideLoading();
						this.disable=false
						uni.redirectTo({
							url:'successTip?status='+this.type
						})
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
	.aacountName{
		font-size:28rpx;
		font-weight:500;
		color:rgba(48,49,51,1);
    }
}
</style>
