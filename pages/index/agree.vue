<template>
	<view class="sbpWrap">
		<view class="sbpContent">
			<view class="title">
				温馨提示
			</view>
			<view class="scroCont">
				<view class="mention">亲，感谢您对本商城的信任！请注意，在您使用本软件过程中我们会按照<navigator url="/pages/article/article?id=4" to="" class="subTitle subTitle2">《商城协议》</navigator>、<navigator  url="/pages/article/article?id=3" class="subTitle subTitle2">《隐私政策》</navigator>收集、使用和共享您的个人信息，请认真阅读并充分理解。</view>
				<view class="subTitle">特别提示：</view>
				<view class="desc">
					1、为向您提供交易相关基本功能，我们会收集、使用必要的信息；<br>
					2、基于您的授权，我们可能会获取您的位置等信息，您有权拒绝或取消授权；<br>
					3、我们会采取业界先进的安全措施保护您的信息安全；<br>
					4、未经您同意，我们不会从第三方处获取、共享或向其提供您的信息；<br>
					5、您可以查询、更正、删除您的个人信息，我们也提供账号注销的渠道。
				</view>
			</view>
			<view class="sbpBtn" @tap="agree">我同意</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			agree(){
				uni.setStorageSync("agree_key",1);
				uni.switchTab({
				// uni.reLaunch({
					url:"/pages/index/index"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sbpWrap {
		background-color: rgba(0,0,0,0.6);
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		.sbpContent{
			width: 85%;
			height: 900rpx;
			border-radius: 20rpx;
			overflow: hidden;
			.title{
				text-align: center;
				line-height: 100rpx;
				font-size: 38rpx;
				font-weight: bold;
				color: #f23d3d;
				background-color: #fff;
			}
			.scroCont{
				height: 700rpx;
				overflow: auto;
				padding: 10rpx 20rpx;
				font-size: 30rpx;
				color: #909399;
				background-color: #fff;
				.mention{
					text-indent: 2em;
				}
				.subTitle{
					color: #f23d3d;
				}
				.subTitle2{
					display: inline;
				}
			}
			.sbpBtn{
				text-align: center;
				line-height: 100rpx;
				background-color: #f23d3d;
				color: #fff;
				font-weight: bold;
				font-size: 40rpx;
			}
		}
	}
</style>