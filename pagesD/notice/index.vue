<template>
	<view>
		<view class="notice-item" @tap="callService">
			<view class="content">
				<view class="bot b-t">
					<view class="bot-left">
						<image class="bot-left-img" src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/msg1.png" mode="widthFix"></image>
						<view class="bot-left-cen">
							<view class="bot-left-cen1">在线客服</view>
							<view class="bot-left-cen2">查看与客服沟通记录</view>
						</view>
					</view>
					<text class="more-icon iconfont iconright"></text>
				</view>
			</view>
		</view>
		<view class="notice-item" @tap="navTo('/pagesD/notice/msgList?type=1')">
			<view class="content">
				<view class="bot b-t">
					<view class="bot-left">
						<image class="bot-left-img" src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/msg2.png" mode="widthFix"></image>
						<view class="bot-left-cen">
							<view class="bot-left-cen1">服务通知</view>
						</view>
					</view>
					<view class="bot-right">
						<text class="red-dot" v-if="serverNms > 0"></text>
						<text class="br-nms" v-if="serverNms > 0">{{serverNms}}条未读消息</text>
						<text class="more-icon iconfont iconright"></text>
					</view>
				</view>
			</view>
		</view>
		<view class="notice-item" @tap="navTo('/pagesD/notice/msgList?type=2')">
			<view class="content">
				<view class="bot b-t">
					<view class="bot-left">
						<image class="bot-left-img" src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/msg3.png" mode="widthFix"></image>
						<view class="bot-left-cen">
							<view class="bot-left-cen1">系统消息</view>
						</view>
					</view>
					<view class="bot-right">
						<text class="red-dot" v-if="sysNms > 0"></text>
						<text class="br-nms" v-if="sysNms > 0">{{sysNms}}条未读消息</text>
						<text class="more-icon iconfont iconright"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
    import {  
        mapState,mapMutations
    } from 'vuex';
	export default {
		data() {
			return {
				serverNms:0,
				sysNms:0
			}
		},
		computed:{
			...mapState(['hasLogin'])
		},
		onShow() {
			if(this.hasLogin){
				this.getData1()
				this.getData2()
			}
		},
		onHide() {
			this.serverNms = 0
			this.sysNms = 0
		},
		methods: {
			...mapMutations(['setAfterLoginUrl']),
			callService(){
				// uni.showToast({
				// 	icon:"none",
				// 	title:"客服系统努力开发中..."
				// })
				uni.navigateTo({
					url:"/pages/service/service"
				})
			},
			getData1(){
				var that = this
				this.$http({
					apiName:"msgList",
					data:{type:1}
				}).then(res => {
					res.data.map(item => {
						if(item.status == 0){
							that.serverNms ++
						}
					})
				}).catch(_ => {})
			},
			getData2(){
				var that = this
				this.$http({
					apiName:"msgList",
					data:{type:2}
				}).then(res => {
					res.data.map(item => {
						if(item.status == 0){
							that.sysNms ++
						}
					})
				}).catch(_ => {})
			},
			navTo(url){
				if(!this.hasLogin){
					this.setAfterLoginUrl(url)
					// #ifdef MP-WEIXIN
					url = '/pages/wxlogin/index';
					// #endif
					// #ifndef MP-WEIXIN
					url = '/pages/public/login';
					// #endif
				}
				uni.navigateTo({  
					url
				})  
			},
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #F9FAFB;
		padding-bottom: 30rpx;
	}

	.notice-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		padding-top: 10rpx;
		font-size: 26rpx;
		color: #7d7d7d;
	}

	.content {
		width: 100%;
		padding: 0 24rpx;
		background-color: #fff;
		padding-top: 26rpx;
		padding-bottom: 26rpx;
	}

	.title {
		display: flex;
		align-items: center;
		height: 90rpx;
		font-size: 32rpx;
		color: #303133;
	}

	.img-wrapper {
		width: 100%;
		height: 260rpx;
		position: relative;
	}

	.pic {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
	}

	.cover {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		font-size: 36rpx;
		color: #fff;
	}

	.introduce {
		display: inline-block;
		padding: 16rpx 0;
		font-size: 28rpx;
		color: #606266;
		line-height: 38rpx;
	}

	.bot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80rpx;
		font-size: 24rpx;
		color: #707070;
		position: relative;
		
		.bot-left{
			display: flex;
			align-items: center;
			.bot-left-img{
				width: 72rpx;
				height: 72rpx;
			}
			.bot-left-cen{
				margin-left: 12rpx;
				.bot-left-cen1{
					color: #303133;
					font-size: 26rpx;
				}
				.bot-left-cen2{
					color: #909399;
					font-size: 24rpx;
				}
			}
		}
		.bot-right{
			display: flex;
			align-items: center;
			.br-nms{
				margin-right: 20rpx;
			}
			.red-dot{
				display: inline-block;
				width: 16rpx;
				height: 16rpx;
				background-color: #f43530;
				border-radius: 50%;
				margin-right: 6rpx;
			}
		}
	}
	.b-t:after{
		border: none;
	}
	.more-icon {
		font-size: 32rpx;
		color: #C0C4CC;
	}
</style>
