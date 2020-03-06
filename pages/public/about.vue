<template>
	<view class="sWrap">
		<view class="sBox">
			<view class="sCont">
				<image
					src="/static/logo.png" 
					class="sWrap-logo" 
					mode="widthFix"
				></image>
				<view class="text1">版本号{{version}}</view>
				<view class="text2"></view>
			</view>
			<image
				src="/static/aboutbgk.png" 
				class="sWrap-bgk" 
				mode="widthFix"
			></image>
		</view>
	</view>
</template>

<script>
export default{
	data() {
		return {
			version:""
		};
	},
	onLoad() {
		// #ifdef APP-PLUS
		this.version = plus.runtime.version
		// #endif
	},
}
</script>

<style lang="scss" scoped>
.sWrap{
	min-height: calc(100vh - 92rpx);
	background-color: #fff;
	padding-top: 150rpx;
	box-sizing: border-box;
	.sBox{
		position: relative;
		z-index: 1;
		.sCont{
			margin-top: 160rpx;
			text-align: center;
			.sWrap-logo{
				width: 160rpx;
				height: auto;
			}
			.text1{
				text-align: center;
				margin-top: 30rpx;
				font-size: 32rpx;
				color: #606266;
			}
			.text2{
				text-align: justify;
				margin-top: 30rpx;
				font-size: 28rpx;
				color: #606266;
				margin-top: 30rpx;
				text-indent: 2em;
				padding-left: 32rpx;
				padding-right: 32rpx;
				width: 100%;
				box-sizing: border-box;
			}
		}
		.sWrap-bgk{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: auto;
			z-index: -1;
		}
	}
}
</style>
