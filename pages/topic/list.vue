<template>
	<view class="sWrap">
		<view class="itemBox">
			<view class="s-item" v-for="(item,index) in dataList" :key="index" @tap="toTopic(item.id)">
				<image mode="widthFix" class="item-img" :src="item.pic" />
				<view class="sbox">
					<view class="t-box">
						<text class="title">{{item.title}}</text>
						<view class="price-box" v-if="item.price">
							<text class="price nm-font">￥{{item.price}}</text> 
							<text class="m-price">起</text>
						</view>
					</view>
					<view class="pro-box">{{item.description}}</view>
				</view>
			</view>
		</view>
		<view v-if="dataList.length > 0 && noMore" class="no_more">
			<text class="no_more_side"></text>
			<text class="no_more_text">没有更多数据了</text>
			<text class="no_more_side"></text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList:[],
				page:1,
				size:8,
				dataLoading:false,  //是否是在加载数据
				noMore:false,
			}
		},
		methods: {
			initData(){
				uni.showLoading({ title: '加载中' });
				this.getTopic()
				uni.hideLoading()
			},
			async getTopic(){
				await this.$http({
					apiName:"getMoreTopic",
					data:{
						page:this.page,
						size:this.size
					}
				}).then(res => {
					this.noMore = !res.data.hasNextPage
					this.dataList = this.dataList.concat(res.data.list)
				}).catch(_ => {})
			},
			toTopic(id){
				uni.navigateTo({
					url: '/pages/topic/topic?id=' + id
				})
			},
		},
		//下拉刷新
		async onPullDownRefresh(){
			this.dataList = [];
			this.page = 1;
			await this.initData()
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
			this.getTopic()
		},
		async onLoad() {
			await this.initData()
		},
	}
</script>

<style lang="scss" scoped>
	.sWrap{
		background: #F9FAFB;
		min-height: calc(100vh - 88rpx);
	}
	.itemBox{
		.s-item{
			margin-bottom: 20rpx;
			padding-top: 32rpx;
			padding-bottom: 28rpx;
			background-color: #fff;
			padding-left: 32rpx;
			padding-right: 32rpx;
			.item-img{
				width: 100%;
				height: auto;
				border-radius: 10rpx;
			}
		}
	}
	.sbox{
		
		.t-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title{
				color: #303133;
				font-size: 34rpx;
				font-weight: bold;
			}
			.price-box{
				.price{
					color: #F23D3D;
					font-size: 38rpx;
					font-weight: bold;
					margin-right: 10rpx;
				}
				.m-price{
					color: #C0C4CC;
					font-size: 24rpx;
				}
			}
		}
		.pro-box{
			margin-top: 10rpx;
			color: #909399;
			font-size: 28rpx;
			width:100%;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
		}
	}
</style>
