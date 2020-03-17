<template>
	<view class="wxlogin">
		<view class="w1">
			<view class="w1d1">
				<image class="w1d1img" src="../../static/logo.png" mode=""></image>
				<view class="w1d1text">
					辰悠优品汇
				</view>
			</view>
			<view class="w1d2">
				为了保证用户安全和理我好的用户体验，请确认授权以下信息
			</view>
			<view class="w1d3">
				获得你的的公开信息（昵称、头像、地区及性别）
			</view>
			<button class="w1d4 btn btn1" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo()">授权登录</button>
			<view class="w1d4 btn2">
				暂不登录
			</view>
		</view>
		<view class="modal" v-if="showModal">
			<view class="mBox">
				<view class="mBTitle">
					提示
				</view>
				<view class="mBCont">
					需获取您的手机号码，才能进行下一步
				</view>
				<view class="mBtns">
					<view class="mBtn mBtns1" @tap="cancel">
						取消
					</view>
					<button class="mBtn mBtns2" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/method.js'
	export default {
		data() {
			return {
				showModal:false,
				jsCode:""
			}
		},
		methods: {
			cancel(){
				this.showModal = false;
			},
			async getPhoneNumber (e) {
				let _self = this;
				uni.showLoading({
				    title: '请求中...'
				});
				if(e.detail.encryptedData){
					await this.$http({
						apiName:"mpLogin",
						type:"POST",
						data:{
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv,
							jsCode:this.jsCode
						}
					}).then(res => {
						utils.setSesion(res.data)
						_self.showModal=false
						uni.showToast({
							title:"登录成功",
							mask:true,
							duration:1500
						})
						setTimeout(_=>{
							uni.hideLoading()
							uni.navigateBack()
						},1500)
					}).catch(_ => {
						uni.hideLoading()
						_self.showModal=false
					})
				}else{
					uni.hideLoading()
				}
				
			 },
			async onGotUserInfo() {
				this.showModal = true;
				let _self = this;
				uni.showLoading({
				    title: '授权请求中...'
				});
				let jscode = await utils.wxLogin();
				if(jscode){
					this.jsCode = jscode;
					this.showModal = true;
				}else{
					uni.showToast({
						icon: 'none',
						title: "授权失败",
						duration: 1500
					});
				}
				uni.hideLoading()
			 }
		},
		onHide() {
			this.showModal=false
		}
	}
</script>

<style lang="less" scoped>
.wxlogin{
	min-height: calc(100vh - 88rpx);
	background-color: #fff;
	padding: 0 60rpx;
	box-sizing: border-box;
	.w1{
		.w1d1{
			text-align: center;
			.w1d1img{
				margin-top: 100rpx;
				width: 200rpx;
				height: 200rpx;
				border-radius: 50%;
			}
			.w1d1text{
				margin-top: 20rpx;
				color: #333333;
				font-size: 30rpx;
				font-weight: bold;
			}
		}
		.w1d2{
			margin-top: 80rpx;
			color: #333333;
			font-size: 26rpx;
			font-weight: bold;
		}
		.w1d3{
			margin-top: 20rpx;
			color: #757575;
			font-size: 26rpx;
		}
		.w1d4.btn{
			margin-top: 80rpx;
		}
		.w1d4.btn::after{
			border: none;
		}
		.w1d4{
			text-align: center;
			margin-bottom: 40rpx;
			line-height: 88rpx;
			height:88rpx;
			border-radius:44rpx;
			font-size: 36rpx;
		}
		.btn1{
			background-color: #F23D3D;
			color: #fff;
		}
		.btn2{
			color: #999999;
			background:rgba(230,230,230,1);
		}
	}
	.modal{
		background-color: rgba(0,0,0,0.6);
		visibility: visible;
		opacity: 1;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 9999;
		transition: background 0.3s linear;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		.mBox{
			width: 600rpx;
			font-weight: 400;
			font-size: 18px;
			background-color: #fff;
			border-radius: 6rpx;
			box-sizing: border-box;
			.mBTitle{
				height: 100rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.mBCont{
				padding: 40rpx 48rpx;
				min-height: 40px;
				font-size: 15px;
				line-height: 1.4;
				color: #999;
				text-align: center;
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-wrap;
			}
			.mBtns{
				height: 100rpx;
				display: flex;
				flex-direction: row;
				border-top: 1px solid #ccc;
				.mBtn{
					display: flex;
					flex: 1;
					justify-content: center;
					align-items: center;
				}
				.mBtns1{
					border-right: 1px solid #ccc;
				}
				.mBtns2{
					color: #3CC51F;
					background: none;
					border-radius: 0;
				}
				.mBtns2::after{
					border: none;
				}
			}
		}
	}
}
</style>
