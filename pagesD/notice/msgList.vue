<template>
	<view class="sWrap">
		<view class="sg-list" v-if="dataList.length > 0">
			<view class="sg-item" v-for="(item,index) in dataList" :key="index" @tap="msgDetail(item.id)">
				<!-- <view class="sg-time">{{item.createTime | dealTime}}</view> -->
				<view class="sg-box">
					<view class="sg-title">{{item.title}}</view>
					<view class="sg-cont">{{item.createTime | dealTime}}</view>
				</view>
				<view class="sg-unreadbox">
					<text class="sg-unread" v-if="item.status == 0">未读</text>
					<text class="iconfont iconright"></text>
				</view>
			</view>
		</view>
		<view class="sg-empty" v-if="dataList.length == 0">
			<image src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/nomsg.png" mode="widthFix"></image>
			<view class="sg-empty-text">暂无消息</view>
		</view>
	<!-- 	<view v-if="dataList.length > 0 && noMore" class="no_more">
			<text class="no_more_side"></text>
			<text class="no_more_text">没有更多数据了</text>
			<text class="no_more_side"></text>
		</view> -->
	</view>
</template>

<script>
import utils from '@/utils/method.js'
export default{
	data(){
		return{
			dataList:[],
			msgType:"",
		}
	},
	methods:{
		async getData(){
			uni.showLoading({
				title:"加载中..."
			})
			await this.$http({
				apiName:"msgList",
				data:{type:this.msgType}
			}).then(res => {
				this.dataList = res.data
			}).catch(_ => {})
			uni.hideLoading()
		},
		msgDetail(id){
			uni.navigateTo({
				url:"/pagesD/notice/msgDetail?id=" + id
			})
		}
	},
	filters:{
		dealTime(val){
			return utils.unixToDatetime(val) || ""
		}
	},
	onLoad(opt) {
		this.msgType = opt.type
	},
	async onShow(){
		await this.getData()
		this.$getMsgNms()
	},
	//下拉刷新
	async onPullDownRefresh(){
		this.dataList = [];
		await this.getData()
		uni.stopPullDownRefresh();
		uni.showToast({
			title: '刷新成功'
		})
	}
}
</script>

<style lang="scss" scoped>
.sWrap{
	min-height: 100vh;
	background-color: #F9FAFB;
	padding: 32rpx;
	.sg-list{
		.sg-unreadbox{
			display: flex;
			align-items: center;
			color: #909399;
		}
		.sg-unread{
			font-size: 24rpx;
			margin-right: 20rpx;
		}
		.sg-item{
			margin-bottom: 20rpx;
			display: flex;
			justify-content: space-between;
			background-color: #fff;
			align-items: center;
			padding-right: 20rpx;
			.sg-time{
				text-align: center;
				color:#909399;
				font-size: 28rpx;
			}
			.sg-box{
				margin-top: 20rpx;
				.sg-title{
					padding: 18rpx 30rpx 18rpx;
					width: 100%;
					box-sizing: border-box;
					color: #303133;
					font-size: 30rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					// border-bottom: 2rpx solid #DBDBDB;
				}
				.sg-cont{
					padding: 18rpx 30rpx;
					padding-top: 0;
					box-sizing: border-box;
					width: 100%;
					color: #909399;
					font-size: 26rpx;
					overflow:hidden; 
					text-overflow:ellipsis;
					display:-webkit-box; 
					-webkit-box-orient:vertical;
					-webkit-line-clamp:2; 
				}
			}
		}
	}
	.sg-empty{
		text-align: center;
		image{
			margin-top: 300rpx;
			width: 312rpx;
			height: auto;
		}
		.sg-empty-text{
			margin-top: 20rpx;
			color: #909399;
			font-size: 28rpx;
		}
	}
}
</style>
