<template>
	<view class="ctbWarp" :style="{background:showSearch == -1 ? topbgk : '#fff',paddingTop:paddingTop}">
		<view class="ctbWarp2" :style="{width:width,height:height}">
			<view class="mtb_side p-b-btn" @tap="toPath('/pages/notice/index')" :style="{color:showSearch == -1 ? '#fff' : '#303133'}">
				<text class="iconfont iconxiaoxi1"></text>
				<text class="p-b-btn-bg" v-if="msgNms > 0 && msgNms < 100">{{msgNms}}</text>
				<text class="p-b-btn-bg" v-if="msgNms > 100">99+</text>
			</view>
			<view class="mtb_center" @tap="toPath('/pages/product/list')" v-if="showSearch != -1">
				<input class="minput" type="text" value="" placeholder="请输入商品名称" placeholder-class disabled/>
				<text class="iconfont iconsearch"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		props:['showSearch','topbgk'],
		data(){
			return{
				width:"280px",
				height:"40px",
				paddingTop:""
			}
		},
		computed:{
			...mapState(['msgNms'])
		},
		methods:{
			toPath(path){
				uni.navigateTo({
					url:path
				})
			}
		},
		created() {
			// #ifdef MP-WEIXIN
			let menuButton = uni.getMenuButtonBoundingClientRect();
			this.width = `calc(100vw - 10px - ${menuButton.width}px)`;
			this.height = menuButton.height + 'px';
			this.paddingTop = menuButton.top + 'px';
			// #endif
		},
	}
</script>

<style lang="scss">
	.ctbWarp{
		width: 100%;
		position: fixed;
		left: 0;
		width: 100%;
		top: 0;
		color: #fff;
		z-index: 99999;
		color: #303133;
		height: 88rpx;
		box-sizing: content-box;
		background-color: #fff;
		.ctbWarp2{
			display: flex;
			align-items: center;
			padding-left: 20rpx;
			padding-right: 20rpx;
			box-sizing: border-box;
		}
		.mtb_side{
			.iconfont{
				font-size: 56rpx;
			}
		}
		.p-b-btn{
			position: relative;
			.p-b-btn-bg{
				position: absolute;
				right: 0;
				top: 0;
				background-color: #F23D3D;
				color: #fff;
				font-size: 20rpx;
				display: inline-block;
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				text-align: center;
				line-height: 32rpx;
			}
		}
		.mtb_center{
			position: relative;
			margin-left: 20rpx;
			flex: 1;
			height: 100%;
			.minput{
				background-color: #f2f2f4;
				border-radius: 12rpx;
				height: 100%;
				padding-left: 60rpx;
				padding-right: 20rpx;
				box-sizing: border-box;
			}
			.input-placeholde{
				color: #f2f2f4;
				font-size: 40rpx;
			}
			.iconfont{
				position: absolute;
				left: 10rpx;
				top: 6rpx;
				font-size: 50rpx;
				
			}
		}
	}
</style>