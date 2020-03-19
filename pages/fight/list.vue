<template>
	<view class="content">
		<view class="prltop" @tap="toRules">
			<image class="prltopimg" src="../../static/ptrules.png" mode=""></image>
			<view class="prltoptext">
				参团    —    
				邀请好友    —    
				满员发货(不满员退款)
			</view>
			<text class="iconfont iconchakanguizeicon-pintuanshangpinliebiaoye"></text>
		</view>
		<view class="">
			<view class="goods-list">
				<view 
					v-for="(item, index) in goodsList" :key="index"
					class="goods-item"
					@click="navToDetailPage(item.productId,item.id)"
				>
					<view class="image-wrapper">
						<image :src="item.picUrl" mode="aspectFill"></image>
					</view>
					<text class="title clamp">{{item.title}}</text>
					<view class="price-box">
						<text class="price nm-font">{{item.minPrice}}</text>
					</view>
				</view>
				<view v-if="goodsList.length > 0 && noMore" class="no_more">
					<text class="no_more_side"></text>
					<text class="no_more_text">没有更多数据了</text>
					<text class="no_more_side"></text>
				</view>
			</view>
		</view>
		<view class="empty" v-if="goodsList.length == 0 && noMore">
			<image src="../../static/empty.png" mode="widthFix" class="empty-img"></image>
			<view class="empty-text">暂无此类商品，换个关键词试试</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page:1,
				size:8,
				noMore:false,
				goodsList: [],
				typeId:"1",
			};
		},
		//下拉刷新
		async onPullDownRefresh(){
			this.goodsList = [];
			this.page = 1;
			this.getData()
			uni.stopPullDownRefresh();
			uni.showToast({
				title: '刷新成功'
			})
		},
		//加载更多
		onReachBottom(){
			if(this.noMore){
				return
			}
			this.page ++;
			this.getData()
		},
		onLoad(opt){
			// if(opt.typeId){
			// 	this.typeId = opt.typeId
			// 	this.initData()
			// }
			this.initData()
		},
		methods: {
			navToDetailPage(id){
				uni.navigateTo({
					url: `/pages/fight/productDetail?id=${id}`
				})
			},
			toRules(){
				uni.navigateTo({
					url:"rules"
				})
			},
			initData(){
				uni.showLoading({ title: '加载中' });
				this.getData()
				uni.hideLoading()
			},
			//更多类型的商品
			async getScoreData(){
				uni.showLoading({ title: '加载中' });
				await this.$http({
					apiName:"getCateList",
					data:{
						productType:1,
						page:this.page,
						size:this.size
					}
				}).then(res => {
					this.noMore = res.data.last
					this.goodsList = this.goodsList.concat(res.data.content)
				}).catch(_ => {})
				uni.hideLoading()
			},
			//更多类型的商品
			async getData(){
				await this.$http({
					apiName:"getMoreModule",
					data:{
						type:this.typeId,
						page:this.page,
						size:this.size
					}
				}).then(res => {
					this.noMore = !res.data.hasNextPage
					this.goodsList = this.goodsList.concat(res.data.list)
				}).catch(_ => {})
			},
		},
	}
</script>

<style lang="scss" scoped>
	page, .content{
		background: $page-color-base;
		min-height: 100vh;
	}
	.content{
		padding-top: 2rpx;
		.prltop{
			display: flex;
			padding: 20rpx 32rpx;
			box-sizing: border-box;
			width: 100%;
			background-color: #fff;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;
			.prltopimg{
				width: 90rpx;
				height: 44rpx;
			}
			.prltoptext{
				color: #303133;
				font-size: 28rpx;
			}
			.iconfont{
				font-size: 32rpx;
				color: #8a8a8a;
			}
		}
	}
	.empty{
		text-align: center;
		.empty-img{
			width: 200rpx;
			height: auto;
			margin-top: 330rpx;
		}
		.empty-text{
			margin-top: 38rpx;
			color: #C0C4CC;
			font-size: 28rpx;
		}
	}
	.re-wrap{
		margin-top: -96rpx;
		.re-his{
			background-color: #fff;
			padding: 20rpx 32rpx;
			padding-bottom: 0;
			margin-bottom: 20rpx;
			.re-histop{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 16rpx;
				.re-his-text{
					color: #606266;
					font-size: 30rpx;
				}
				.re-his-img{
					width: 40rpx;
					height: auto;
				}
			}
			.re-his-list{
				.rehl-item{
					display: inline-block;
					margin-bottom: 20rpx;
					background-color: #F0F1F3;
					line-height: 46rpx;
					border-radius: 24rpx;
					padding-left: 22rpx;
					padding-right: 22rpx;
					margin-right: 20rpx;
					color: #909399;
					font-size: 24rpx;
				}
			}
		}
	}
	.navbar{
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80rpx;
		background: #fff;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,.06);
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30rpx;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120rpx;
					height: 0;
					border-bottom: 4rpx solid $base-color;
				}
			}
		}
		.p-box{
			display: flex;
			flex-direction: column;
			.xia{
				transform: scaleY(-1);
			}
		}
		.cate-item{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80rpx;
			position: relative;
			font-size: 44rpx;
			&:after{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36rpx;
			}
		}
	}

	/* 分类 */
	.cate-mask{
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 95;
		transition: .3s;
		
		.cate-content{
			width: 630rpx;
			height: 100%;
			background: #fff;
			float:right;
			transform: translateX(100%);
			transition: .3s;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			
			.cate-content{
				transform: translateX(0);
			}
		}
	}
	.cate-list{
		display: flex;
		flex-direction: column;
		height: 100%;
		.cate-item{
			display: flex;
			align-items: center;
			height: 90rpx;
			padding-left: 30rpx;
 			font-size: 28rpx;
			color: #555;
			position: relative;
		}
		.two{
			height: 64rpx;
			color: #303133;
			font-size: 30rpx;
			background: #f8f8f8;
		}
		.active{
			color: $base-color;
		}
	}

	/* 商品列表 */
	.goods-list{
		display:flex;
		flex-wrap:wrap;
		padding: 0 30rpx;
		background: #F9FAFB;
		.goods-item{
			display:flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40rpx;
			&:nth-child(2n+1){
				margin-right: 4%;
			}
		}
		.image-wrapper{
			width: 100%;
			height: 330rpx;
			border-radius: 3px;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.title{
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80rpx;
		}
		.price-box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10rpx;
			font-size: 24rpx;
			color: $font-color-light;
			.nm-font{
				font-size: 28rpx;
				color: #F23D3D;
			}
		}
		.price{
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
			&:before{
				content: '￥';
				font-size: 26rpx;
			}
		}
	}
	

</style>