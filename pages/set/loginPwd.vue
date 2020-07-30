<template>
	<view class="sWrap">
		<view class="sBox">
			<view class="sItem">
				<view class="slabel">用户名</view>
				<view class="sinputbox">
					<!-- <input placeholder-class="placeholderClass" class="sinput" type="number" v-model="code" placeholder="请输入短信验证码"/> -->
					<text class="stext" >{{nickName}}</text> 
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">设置登录密码</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass"  maxlength="12" class="sinput w" type="password" v-model="password" placeholder="请输入8-12位字母加数字组合的密码"/>
				</view>
			</view>
			<view class="sItem">
				<view class="slabel">确认登录密码</view>
				<view class="sinputbox">
					<input placeholder-class="placeholderClass" class="sinput"   maxlength="12" type="password" v-model="checkPassword" placeholder="请再次输入登录密码"/>
				</view>
			</view>
		
		</view>
		<button class="btn" :disabled="confirmBtnDisable" :loading="confirmBtnDisable" @tap="confirm" >完成</button>
	</view>
</template>

<script>
	import utils from 'utils/method.js'
		import {mapState} from 'vuex'
	export default{
		data(){
			return {
				password:"",
				checkPassword:"",
				confirmBtnDisable: false
			}
		},
		computed:{
			...mapState(['userInfo']),
			nickName(){
				return uni.getStorageSync('appInfo').nickName
			}
		},
		onLoad() {
			
		},
		methods:{
			async confirm(){
				let _data = [

					{
						data:this.password,
						info:'请输入支付密码'
					},
					{
						data:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,12}$/.test(this.password),
						info:'请输入8-12位字母加数字组合的密码'
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
						apiName:"setAppPwd",
						type:"POST",
						data:{
							appOpenId:uni.getStorageSync('appInfo').openId,
							password: utils.md5(this.password)
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
						console.log(res)
						utils.setSesion(res.data)
						utils.getUserInfo()
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
					font-size:30rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:600;
					color:rgba(48,49,51,1);
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