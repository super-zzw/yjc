<template>
	<view class="sWrap">
		<view class="sbox">
			<view class="sitem" v-for="(item,index) in dataList" :key="index">
				<view class="item-top">
					<view class="item-top-left">
						<!-- <image class="itl-pic" src="" mode=""></image> -->
						<text class="itl-name">{{item.wuserName}}</text>
					</view>
					<view class="item-top-right" @tap="deleteItem(item.id,index)">删除</view>
				</view>
				<view class="item-cont">{{item.content}}</view>
				<view class="item-good">
					<view class="item-good-img">
						<image :src="item.productImg" mode=""></image>
					</view>
					<view class="item-good-info">
						<view class="item-gtitle">{{item.productName}}</view>
						<view class="item-gtext">
							<view class="item-price">￥{{item.productPrice}}</view>
							<view class="item-status">
								已
								<text v-if="item.star == 5">好评</text>
								<text v-if="item.star == 3">中评</text>
								<text v-if="item.star == 1">差评</text>
							</view>
						</view>
					</view>
				</view>
				<view class="item-time">{{item.createTime | dealTime}}</view>
				<view class="item-replay" v-if="item.replayContent">
					<image src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/sanjiao.png" class="item-sanjiao" mode=""></image>
					<view class="item-retex">{{item.replayName}}回复：{{item.replayContent}}</view>
				</view>
			</view>
		</view>
		<view class="s-empty" v-if="dataList.length == 0 && noMore">
			<image src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/nomsg.png" class="no-img" mode="widthFix"></image>
			<view class="empty-text">暂无评价</view>
		</view>
		<view v-if="dataList.length > 0 && noMore" class="no_more">
			<text class="no_more_side"></text>
			<text class="no_more_text">没有更多数据了</text>
			<text class="no_more_side"></text>
		</view>
	</view>
</template>

<script>
	import utils from '@/utils/method.js'
	export default{
		data(){
			return {
				dataList:[],
				page:1,
				size:8,
				dataLoading:false,  //是否是在加载数据
				noMore:false,
			}
		},
		methods:{
			async getData(){
				await this.$http({
					apiName:"getCommentList"
				}).then(res => {
					this.noMore = !res.data.hasNextPage
					this.dataList = this.dataList.concat(res.data.list)
				}).catch(_ => {})
			},
			async deleteItem(id,index){
				await this.$http({
					apiName:"deleteComment",
					type:"POST",
					data:{id:id}
				}).then(res => {
					uni.showToast({
						title:"删除成功"
					})
					this.dataList.splice(index,1)
				}).catch(_ => {})
			},
		},
		filters:{
			dealTime(val){
				return utils.unixToDatetime(val) || ""
			}
		},
		//下拉刷新
		async onPullDownRefresh(){
			this.dataList = [];
			this.page = 1;
			await this.getData()
			uni.stopPullDownRefresh();
			uni.showToast({
				title: '刷新成功'
			})
		},
		//触底加载更多
		onReachBottom(){
			if(this.noMore){
				return
			}
			this.page ++;
			this.getData()
		},
		async onLoad() {
			await this.getData()
		},
		onBackPress(e){
			// uni.switchTab({
			uni.reLaunch({
				url:"/pages/user/user"
			})
			return true
		}
	}
</script>

<style lang="scss" scoped>
	.sWrap{
		min-height: calc(100vh - 88rpx);
		background-color: #F9FAFB;
		box-sizing: border-box;
		.sbox{
			.sitem{
				margin-bottom: 20rpx;
				padding: 32rpx;
				background-color: #fff;
				.item-top{
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 2rpx solid #CCCCCC;
					padding-bottom: 20rpx;
					.item-top-left{
						display: flex;
						align-items: center;
						.itl-name{
							color: #606266;
							font-size: 30rpx;
							font-weight: bold;
						}
					}
					.item-top-right{
						padding: 0 16rpx;
						border: 2rpx solid #F23D3D;
						border-radius: 32rpx;
						line-height: 42rpx;
						font-size: 24rpx;
						color: #F23D3D;
					}
				}
				.item-cont{
					margin-top: 20rpx;
					color: #606266;
					font-size: 26rpx;
				}
				.item-good{
					margin-top: 20rpx;
					padding: 16rpx;
					background-color: #F8F8F9;
					display: flex;
					align-items: center;
					border-radius: 8rpx;
					.item-good-img{
						width: 128rpx;
						height: 128rpx;
						background-color: #C0C4CC;
						border-radius: 4rpx;
						margin-right: 16rpx;
						image{
							width: 128rpx;
							height: 128rpx;
							border-radius: 4rpx;
						}
					}
					.item-good-info{
						flex: 1;
						.item-gtitle{
							color: #303133;
							font-size: 30rpx;
						}
						.item-gtext{
							margin-top: 14rpx;
							display: flex;
							align-items: center;
							.item-price{
								color: #606266;
								font-size: 32rpx;
								margin-right: 30rpx;
							}
							.item-status{
								color: #F23D3D;
								font-size: 24rpx;
							}
						}
					}
				}
				.item-time{
					margin-top: 10rpx;
					color: #C0C4CC;
					font-size: 22rpx;
				}
				.item-replay{
					margin-top: -14rpx;
					.item-sanjiao{
						margin-left: 30rpx;
						width: 24rpx;
						height: 16rpx;
					}
					.item-retex{
						border-radius: 8rpx;
						margin-top: -10rpx;
						background-color: #F8F8F9;
						padding: 20rpx 28rpx;
						color: #909399;
						font-size: 24rpx;
						line-height: 30rpx;
					}
				}
			}
		}
		.s-empty{
			text-align: center;
			.no-img{
				margin-top: 300rpx;
				width: 312rpx;
				height: auto;
			}
			.empty-text{
				color: #909399;
				font-size: 28rpx;
				margin-top: 20rpx;
			}
		}
	}
</style>
