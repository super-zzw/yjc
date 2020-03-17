<template>
	<view class="sWrap">
		<view class="s-empty" v-if="dataList == 0 && noMore">
			<image src="../../static/empty.png" mode="widthFix"></image>
			<view class="s-empty-text">暂无收藏商品</view>
		</view>
		<view class="s-box" v-if="dataList.length">
			<view class="s-item" v-for="(item,index) in dataList" :key="index">
				<view class="s-ileft" @tap="toDetail(item.productId)">
					<view class="s-bgk">
						<image :src="item.picUrl" class="s-img" mode=""></image>
					</view>
					<view class="s-info">
						<view class="s-info1">{{item.title}}</view>
						<view class="s-info2 nm-font">
							<text class="iconfont iconrenminbi"></text> 
							{{item.minPrice}}
							</view>
					</view>
				</view>
				<view class="s-heart" @tap="rmSave(item.id,index)">
					<text class="iconfont iconxin"></text>
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
				page:1,
				size:8,
				dataLoading:false,  //是否是在加载数据
				noMore:false,
				dataList:[]
			}
		},
		async onLoad() {
			await this.getData()
		},
		methods: {
			//取消收藏
			async rmSave(id,index){
				uni.showLoading()
				await this.$http({
					apiName:"deleteCollect",
					type:"POST",
					data:{id:id}
				}).then(res => {
					uni.showToast({
						title:"成功取消收藏"
					})
					this.dataList.splice(index,1)
				}).catch(_ => {})
				uni.hideLoading()
			},
			async getData(){
				await this.$http({
					apiName:"getCollect",
					data:{
						page:this.page,
						size:this.size
					}
				}).then(res => {
					this.noMore = !res.data.hasNextPage
					this.dataList = this.dataList.concat(res.data.list)
				}).catch(_ => {})
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
			//查看商品详情
			async toDetail(id){
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.sWrap{
	min-height: calc(100vh - 88rpx);
	background-color: #F9FAFB;
	.s-empty{
		text-align: center;
		image{
			width: 194rpx;
			height: auto;
			margin-top: 330rpx;
		}
		.s-empty-text{
			margin-top: 38rpx;
			color: #C0C4CC;
			font-size: 28rpx;
		}
	}
	.s-box{
		padding-left: 32rpx;
		padding-right: 32rpx;
		background-color: #fff;
		.s-item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 30rpx;
			padding-top: 30prx;
			border-bottom: 2rpx solid #DBDBDB;
			.s-ileft{
				display: flex;
				align-items: center;
				.s-bgk{
					width: 144rpx;
					height: 144rpx;
					border-radius: 8rpx;
					background: #C0C4CC;
					margin: 20rpx;
					.s-img{
						width: 144rpx;
						height: 144rpx;
						border-radius: 8rpx;
					}
				}
				.s-info{
					margin-top: 20rpx;
					.s-info1{
						color: #303133;
						font-size: 30rpx;
					}
					.s-info2{
						margin-top: 24rpx;
						color: #F23D3D;
						font-size: 32rpx;
						display: flex;
						align-items: baseline;
						.iconrenminbi{
							font-size: 40rpx;
						}
					}
				}
			}
			.s-heart{
				.iconxin{
					font-size: 38rpx;
					color: #F23D3D;
				}
			}
		}
		.s-item:last-child{
			border-bottom: none;
		}
	}
}
</style>
