<template>
	<view>
		<view class="sbox">
			<image src="../../pagesE/image/bg1.png" mode="widthFix" class="image_1"></image>
			<view class="info">
				<text class="title">一项企业服务的名字，企业服务企业服务文字做两行的长度限制，超出两超出两行超出两行超出两行超出两行超出两行</text>
				<view class="box1">
					<text class="left">¥600</text>
					<text class="right">+</text>
				</view>
			</view>
		</view>
		<view class="mt"></view>
		<view class="sbox">
			<text class="txt1">- 图文详情 -</text>
			<view></view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	page{
		background: #F9FAFB;
	}
	.mt{
		height: 40rpx;
	}
	
	.sbox{
		background: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		.image_1{
			  width: 100%;
		}
		.info{
			padding: 0 32rpx;
			display: flex;
			flex-direction: column;
			.title{
				margin-top:32rpx ;
				font-size:32rpx;
				font-family:PingFangSC-Medium,PingFang SC;
				font-weight:600;
				color:rgba(48,49,51,1);
				line-height:44rpx;
				overflow: hidden;
				
				// text-overflow:ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}
			.box1{
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;
				.left{
					font-size:36rpx;
					font-weight:600;
					color:rgba(242,61,61,1);
					line-height:50rpx;
				}
				.right{
					width:56rpx;
					height:50rpx;
					background:rgba(242,61,61,1);
					border-radius:8rpx;
					color: #fff;
					text-align: center;
				}
			}
		}
		.txt1{
			margin: 40rpx 0 50rpx;
		}
		
	}
 
</style>
