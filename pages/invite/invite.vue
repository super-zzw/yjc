<template>
	<view class="sWrap">
		<image src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/inviteBgk.png" class="aWrap-bgk" mode="widthFix"></image>
		<view class="sWrap-box">
				<view class="sWrap-title">
					<view class="sWrap-idot1"></view>
					<view class="sWrap-idot2"></view>
					<view class="sWrap-idot3">邀请步骤</view>
					<view class="sWrap-idot2"></view>
					<view class="sWrap-idot1"></view>
				</view>
				<view class="sWrap-buzhou">
					<view class="sWrap-buzhou-item">
						<image class="swbi-img" src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/b1.png" mode=""></image>
						<view class="swbi-tishi">
							<text class="swbi-nm">1</text>
							<view class="swbi-text">
								<view class="">分享海报给好友</view>
							</view>
						</view>
					</view>
					<view class="sWrap-buzhou-item">
						<image class="swbi-img" src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/b2.png" mode=""></image>
						<view class="swbi-tishi">
							<text class="swbi-nm">2</text>
							<view class="swbi-text">
								<view class="">好友通过二维码</view>
								<view class="">下载app</view>
							</view>
						</view>
					</view>
					<view class="sWrap-buzhou-item">
						<image class="swbi-img" src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/b3.png" mode=""></image>
						<view class="swbi-tishi">
							<text class="swbi-nm">3</text>
							<view class="swbi-text">
								<view class="">好友注册</view>
								<view class="">填写注册码</view>
							</view>
						</view>
					</view>
				</view>
		</view>
		<image class="sPoster" :src="poster" mode="widthFix"></image>
		<view class="s-btn" @tap="saveImg">保存到本地</view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="s-btn" @tap="toPath('/pages/invite/recorde')">邀请记录</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				poster:""
			}
		},
		methods: {
			toPath(path){
				uni.navigateTo({
					url:path
				})
			},
			async getImg(){
				await this.$http({
					apiName:"getInvitePoster"
				}).then(res => {
					this.poster = res.data
				}).catch(_ => {})
			},
			saveImg(){
				// #ifndef MP-WEIXIN
				let _self = this
				uni.saveImageToPhotosAlbum({
					filePath:this.poster,
					success: function () {
						uni.showToast({
						    title: "保存成功",
						    duration: 1000
						});
					}
				});
				// #endif
				
				// #ifdef MP-WEIXIN
				uni.showLoading({
					title:"保存中..."
				})
				let that = this
				uni.downloadFile({
					url: that.poster,
					success:function (res) {
						//图片保存到本地
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success:function (data) {
								uni.showToast({
								    title: "保存成功",
								    duration: 1000
								});
							},
							fail:function (err) {
								if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
									uni.showModal({
										title: '提示',
										content: '需要您授权保存相册',
										showCancel: false,
										success: modalSuccess => {
										uni.openSetting({
											success(settingdata) {
												if (settingdata.authSetting['scope.writePhotosAlbum']) {
													uni.showModal({
														title: '提示',
														content: '获取权限成功,再次点击保存',
														showCancel: false,
													})
												} else {
													uni.showModal({
														title: '提示',
														content: '获取权限失败，将无法保存到相册哦~',
														showCancel: false,
													})
												}
											},
											fail(failData) {
												console.log("failData", failData)
											},
											complete(finishData) {
												console.log("finishData", finishData)
											}
										})
										}
									})
								}
							}
						})
					},
					complete(){
						uni.hideLoading()
					}
				});
				// #endif
			},
		},
		onLoad() {
			this.getImg()
		},
		onNavigationBarButtonTap(e) {
			const index = e.index;
			// #ifdef APP-PLUS
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			const currentWebview = page.$getAppWebview();
			currentWebview.hideTitleNViewButtonRedDot({
				index
			});
			// #endif
			if(index == 0){
				uni.navigateTo({
					url:'/pages/invite/recorde'
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
.sWrap{
	min-height: 100vh;
	background-color: #F23D3D;
	position: relative;
	padding: 30rpx 32rpx;
	box-sizing: border-box;
	.aWrap-bgk{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: auto;
	}
	.sWrap-box{
		padding: 30rpx;
		background-color: #fff;
		border-radius: 8rpx;
		position: relative;
		.sWrap-title{
			display: flex;
			justify-content: center;
			align-items: center;
			.sWrap-idot1{
				width: 8rpx;
				height: 8rpx;
				border-radius: 50%;
				background-color: #FFC1C1;
				margin-left: 6rpx;
				margin-right: 6rpx;
			}
			.sWrap-idot2{
				width: 12rpx;
				height: 12rpx;
				border-radius: 50%;
				background-color: #F23D3D;
			}
			.sWrap-idot3{
				color: #303133;
				font-size: 30rpx;
				margin-left: 16rpx;
				margin-right: 16rpx;
			}
		}
		.sWrap-buzhou{
			margin-top: 20rpx;
			display: flex;
			justify-content: space-between;
			.sWrap-buzhou-item{
				width: 30%;
				text-align: center;
				.swbi-img{
					width: 112rpx;
					height: 112rpx;
				}
				.swbi-tishi{
					position: relative;
					.swbi-nm{
						font-style: italic;
						color: #F23D3D;
						font-size: 60rpx;
						position: absolute;
						left: 0;
						top: -30rpx;
						font-weight: bold;
						opacity: 0.24;
					}
					.swbi-text{
						color: #606266;
						font-size: 24rpx;
						position: relative;
					}
				}
			}
		}
	}
	.sPoster{
		width: 100%;
		height: auto;
		margin-top: 20rpx;
		border-radius: 8rpx;
	}
	.s-btn{
		margin-top: 40rpx;
		background:rgba(242,182,61,1);
		box-shadow:0px 4px 20px 0px rgba(200,145,36,0.3);
		border-radius:44px;
		border-radius: 44rpx;
		text-align: center;
		line-height: 90rpx;
		color: #fff;
		font-size: 30rpx;
	}
}
</style>
