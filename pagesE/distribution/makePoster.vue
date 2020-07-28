<template>
	<view class="mWrap">
		<view class="posterBox">
			<image class="poster" src="https://s1.ax1x.com/2020/07/27/ailzOP.th.png" mode="heightFix"></image>
		</view>
		<view class="imgList">
			<image class="imgItem" :src="item.url" v-for="item in imgList" :key="item.id" mode="heightFix"></image>
		</view>
		<view class="oprList">
			<view class="oprItem" v-for="item in oprList" :key="item.text">
				<image class="oprItemImg" :src="item.icon" mode="widthFix"></image>
				<view class="oprItemText">
					{{item.text}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default{
	data(){
		return {
			imgList:[
				{id:1,url:"https://s1.ax1x.com/2020/07/27/ailzOP.th.png"},
				{id:2,url:"https://s1.ax1x.com/2020/07/27/ailzOP.th.png"},
				{id:3,url:"https://s1.ax1x.com/2020/07/27/ailzOP.th.png"},
				{id:4,url:"https://s1.ax1x.com/2020/07/27/ailzOP.th.png"},
				{id:5,url:"https://s1.ax1x.com/2020/07/27/ailzOP.th.png"},
				{id:6,url:"https://s1.ax1x.com/2020/07/27/ailzOP.th.png"},
				{id:7,url:"https://s1.ax1x.com/2020/07/27/ailzOP.th.png"},
				{id:8,url:"https://s1.ax1x.com/2020/07/27/ailzOP.th.png"},
				{id:9,url:"https://s1.ax1x.com/2020/07/27/ailzOP.th.png"},
				{id:10,url:"https://s1.ax1x.com/2020/07/27/ailzOP.th.png"},
				{id:11,url:"https://s1.ax1x.com/2020/07/27/ailzOP.th.png"},
			],
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
			]
		}
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
