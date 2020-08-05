<template>
	<view class="mWrap">
		<view class="posterBox">
			<image class="poster" :src="posterUrl" mode="heightFix" @load="loadImg"></image>
		</view>
		<view class="imgList">
			<image class="imgItem" :src="item.url" v-for="item in imgList" :key="item.id" mode="heightFix" @tap="changePoster(item.id)"></image>
		</view>
		<view class="oprList">
			<view class="oprItem" v-for="item in oprList" :key="item.text" @tap="shareOthers(item.text)">
				<image class="oprItemImg" :src="item.icon" mode="widthFix"></image>
				<view class="oprItemText">
					{{item.text}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import Share from "../../components/share.vue";
import utils from '@/utils/method.js'
export default{
	data(){
		return {
			imgList:[],
			oprList:[
				{
					icon: "https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/wxhy.png",
					text: "微信好友"
				},
				{
					icon: require("../image/pyq.png"),
					text: "朋友圈"
				},
				{
					icon: require("../image/download.png"),
					text: "保存本地"
				},
			],
			posterUrl:"",
			templateId:"",
			info:""
		}
	},
	async onLoad() {
		uni.showLoading({
			title:"加载中...",
			mask:true
		})
		await this.getPoster();
		await this.getList();
		this.getInfo();
		
	},
	methods:{
		loadImg(){
			uni.hideLoading()
		},
		getInfo(){
			this.$http({
				apiName:"DistributionInfo"
			}).then(res => {
				this.info = res.data;
			}).catch(err => {})
		},
		getPoster(){
			this.$http({
				apiName:"fxPoster",
				data:{
					templateId:this.templateId
				}
			}).then(res => {
				this.posterUrl = res.data;
			}).catch(err => {})
		},
		getList(){
			this.$http({
				apiName:"fxPosterEx"
			}).then(res => {
				this.imgList = res.data;
			}).catch(err => {})
		},
		async changePoster(id){
			uni.showLoading({
				title:"加载中...",
				mask:true
			})
			this.templateId = id;
			await this.getPoster();
			uni.hideLoading()
		},
		shareOthers(e){
			let name = ""
			if(e == '微信好友'){
				name = "WXSceneSession";
				// #ifdef APP-PLUS
				this.appShare(name,e);
				// #endif
			}else if(e == '朋友圈'){
				name = "WXSenceTimeline";
				// #ifdef APP-PLUS
				this.appShare(name,e);
				// #endif
			}else if(e == '保存本地'){
				this.saveImg()
			}
		},
		appShare(name,type){
			let _self = this;
			uni.share({
				provider: "weixin",
				scene: name,
				type:0,
				title: _self.info.distributeInviteTitle,
				imageUrl: _self.info.distributeInviteImg,
				summary: _self.info.distributeInviteDescription,
				href: _self.info.distributeInviteUrl,
				success(res) {
					console.log(res);
				},
				fail(err){
					console.log(err);
				}
			})
		},
		saveImg(){
			// #ifndef MP-WEIXIN
			let _self = this
			uni.saveImageToPhotosAlbum({
				filePath:this.posterUrl,
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
				url: that.posterUrl,
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
	}
}
</script>

<style lang="less" scoped>
.mWrap{
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: calc(100vh - 88rpx);
	.posterBox{
		height: 72%;
		box-sizing: border-box;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		text-align: center;
		.poster{
			height: 100%;
		}
	}
	.imgList{
		height: 15%;
		box-sizing: border-box;
		padding-top: 18rpx;
		padding-bottom: 16rpx;
		background-color: #F9FAFB;
		width: 100vw;
		white-space: nowrap;
		padding-left: 30rpx;
		padding-right: 30rpx;
		overflow: auto;
		font-size: 0;
		.imgItem{
			height: 92%;
			width: 16%;
			display: inline-block;
			margin-right: 30rpx;
		}
	}
	.oprList{
		height: 11%;
		box-sizing: border-box;
		display: flex;
		justify-content: space-around;
		padding-top: 16rpx;
		.oprItem{
			text-align: center;
			.oprItemImg{
				width: 56rpx;
				height: 56rpx;
			}
			.oprItemText{
				color: #303133;
				font-size: 24rpx;
				margin-top: 8rpx;
			}
		}
		
	}
}
</style>
