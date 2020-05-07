<template>
	<view class="sWrap">
		<!-- #ifdef MP-WEIXIN -->
		<view class="whi" @tap="clear" v-if="dataList.length > 0">
			清空历史
		</view>
		<!-- #endif -->
		<view class="s-empty" v-if="dataList == 0 && noMore">
			<image src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/empty.png" mode="widthFix"></image>
			<view class="s-empty-text">暂无浏览商品</view>
		</view>
		<view class="s-box" v-if="dataList.length">
			<view class="s-item" v-for="(item,index) in dataList" :key="index" @tap="toDetail(item.productId,item.productType)">
				<view class="s-bgk">
					<image :src="item.picUrl" class="s-img" mode=""></image>
				</view>
				<view class="s-info">
					<view class="s-info1">{{item.title}}</view>
					<view class="s-info-boo">
						<view class="s-info2 nm-font" v-if="item.productType == 0">
							<text class="iconfont iconrenminbi"></text> 
							{{item.minPrice}}
						</view>
						<view class="s-info2 nm-font" v-else>
							积分
							{{item.minPoints}}
						</view>
						<view class="s-info3">{{item.createTime | dealTime}}</view>
					</view>
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
	import utils from '@/utils/method.js'
	export default {
		data() {
			return {
				page:1,
				size:8,
				dataLoading:false,  //是否是在加载数据
				noMore:false,
				dataList:[],  //productType:1普通商品，0积分商品
			}
		},
		async onLoad() {
			await this.getData()
		},
		filters:{
			dealTime(val){
				return utils.unixToDatetime(val) || 0
			}
		},
		methods: {
			//取消收藏
			async clear(id){
				uni.showLoading()
				await this.$http({
					apiName:"clearHis",
					type:"POST",
					data:{id:id}
				}).then(res => {
					this.dataList = []
				}).catch(_ => {})
				uni.hideLoading()
			},
			async getData(){
				await this.$http({
					apiName:"getHis",
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
			async toDetail(id,type){
				let _score = false
				if(type == 1){
					_score = true
				}
				uni.navigateTo({
					url: `/pages/product/product?id=${id}&score=${_score}`
				})
			}
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.clear()
			}
		}
	}
</script>

<style lang="scss" scoped>
.sWrap{
	min-height: 100vh;
	background-color: #F9FAFB;
	.whi{
		position: fixed;
		bottom: 32rpx;
		right: 32rpx;
		background-color: #e7ecf5;
		color: #F23D3D;
		border-radius: 6rpx;
		padding: 6rpx 32rpx;
		font-size: 32rpx;
	}
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
			.s-bgk{
				width: 144rpx;
				height: 144rpx;
				border-radius: 8rpx;
				// overflow: hidden;
				background: #C0C4CC;
				margin: 20rpx;
				.s-img{
					width: 144rpx;
					height: 144rpx;
					border-radius: 8rpx;
				}
			}
			.s-info-boo{
				margin-top: 24rpx;
			}
			.s-info{
				flex: 1;
				.s-info1{
					color: #303133;
					font-size: 30rpx;
				}
				.s-info2{
					color: #F23D3D;
					font-size: 32rpx;
					display: flex;
					align-items: baseline;
					.iconrenminbi{
						font-size: 40rpx;
					}
				}
				.s-info-boo{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.s-info3{
						font-size: 26rpx;
						color: #606266;
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
