<template>
	<view class="container">
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 背景色区域 -->
			<view class="titleNview-background" :style="{backgroundColor:titleNViewBackground}"></view>
			<swiper class="carousel" circular @change="swiperChange">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @tap="pageJump(item.jumpType,item.jumpId)">
					<image :src="item.pic" />
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots">
				<text class="num nm-font">{{swiperCurrent+1}}</text>
				<text class="sign">/</text>
				<text class="num nm-font">{{swiperLength}}</text>
			</view>
		</view>
		<!-- 分类 -->
		<view class="cate-section">
			<swiper class="swiper-nav" indicator-active-color="#F23D3D" indicator-color="#D8D8D8" :indicator-dots="navs.length > 2" :autoplay="false" :interval="2000" :duration="500">
				<swiper-item class="swiper-nav-item" v-for="(item0,index0) in navs" :key="index0">
					<view class="cate-item" v-for="(item1,index1) in item0" :key="index1"  @tap="pageJump(item1.jumpType,item1.jumpId)">
						<image :src="item1.icon" class="cate-item-img"/>
						<view class="cate-item-text">{{item1.name}}</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 滚动广告 -->
		<view class="ad-1">
			<div class="ad-1-box">
				<image class="ad-1-img" src="../../static/ad.png" mode="widthFix"></image>
				<swiper class="ad-1-swiper" :vertical="true" :indicator-dots="false" :autoplay="true" :interval="2000" :duration="500">
					<swiper-item class="ad-1-swiper-item" v-for="(item,index) in notices" :key="index" @tap="toArtilce(item.noticeId)">
						<view class="ad1-item-text">{{item.noticeTitle}}</view>
					</swiper-item>
				</swiper>
			</div>
		</view>
		<!-- 主题推荐 -->
		<view class="f-header2 m-t m-t2">
			<view class="tit-box">
				<text class="tit">主题推荐</text>
			</view>
			<view class="tit-box2" @tap="toMore()">
				更多
				<text class="iconfont iconright"></text>
			</view>
		</view>
		<view class="group-section2">
			<swiper class="g-swiper" :duration="500" :autoplay="true">
				<swiper-item
					class="g-swiper-item"
					v-for="(item, index) in tipics" :key="index"
					@tap="toTopic(item.id)"
				>
					<image class="g-image" :src="item.pic" mode="widthFix"></image>
					<view class="t-box">
						<text class="title">{{item.title}}</text>
						<view class="price-box" v-if="item.price">
							<text class="price nm-font">￥{{item.price}}</text> 
							<text class="m-price">起</text>
						</view>
					</view>
					<view class="pro-box">{{item.description}}</view>
				</swiper-item>
			</swiper>
		</view>
		
		
		<!-- 新品首发 -->
		<view class="seckill-section m-t">
			<view class="f-header2 m-t f-header3">
				<view class="tit-box">
					<text class="tit">新品首发</text>
				</view>
				<view class="tit-box2" @tap="pageJump(1)">
					更多
					<text class="iconfont iconright"></text>
				</view>
			</view>
			<scroll-view class="floor-list" scroll-x>
				<view class="scoll-wrapper">
					<view 
						@click="navToDetailPage(item.productId)"
						v-for="(item, index) in topics123[1]" :key="index"
						class="floor-item floor-item2"
					>
						<image class="floor-item-img" :src="item.picUrl"></image>
						<text class="title clamp">{{item.title}}</text>
						<text class="price nm-font">￥{{item.minPrice}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
	
		<!-- 精品专区 -->
		<view class="f-header2 m-t">
			<view class="tit-box">
				<text class="tit">精品专区</text>
			</view>
			<view class="tit-box2" @tap="pageJump(2)">
				更多
				<text class="iconfont iconright"></text>
			</view>
		</view>
		
		<view class="guess-section">
			<view 
				@click="navToDetailPage(item.productId)"
				v-for="(item, index) in topics123[2]" :key="index"
				class="guess-item"
			>
				<view class="image-wrapper">
					<image :src="item.picUrl" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.title}}</text>
				<text class="price nm-fon">￥{{item.minPrice}}</text>
			</view>
		</view>
		<!-- 促销专区 -->
		<view class="f-header2 m-t">
			<view class="tit-box">
				<text class="tit">促销专区</text>
			</view>
			<view class="tit-box2" @tap="pageJump(3,1)">
				更多
				<text class="iconfont iconright"></text>
			</view>
		</view>
		<view class="guess-section">
			<view 
				@click="navToDetailPage(item.productId)"
				v-for="(item, index) in topics123[0]" :key="index"
				class="guess-item"
			>
				<view class="image-wrapper">
					<image :src="item.picUrl" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.title}}</text>
				<text class="price nm-fon">￥{{item.minPrice}}</text>
			</view>
		</view>
		

	</view>
</template>

<script>
import {
	mapState,
	mapMutations
} from 'vuex';
import utils from '@/utils/method.js'
	export default {

		data() {
			return {
				carouselList: [], //轮播图数据
				titleNViewBackground: '',  //当前轮播的图片背景
				swiperCurrent: 0,  //当前轮播index
				swiperLength: 0,  //轮播内容长度
				navs:[],// 动态导航
				notices:[],  //滚动通知/广告
				tipics:[],  //主题内容
				topics123:[[],[],[]],  //促销内容，新品，精选
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		async onShow(){
			let that = this
			setTimeout(() => {
				if(that.hasLogin){
					that.getCartNms();  //获取购物车数量
				}
				that.$getMsgNms()
			},800)
		},
		async onLoad() {
			this.$checkUpdate()
			await this.initData()
		},
		onHide() {
			if(this.hasLogin && JSON.stringify(this.userInfo) == '{}'){
				this.getUserInfo()
			}
		},
		methods: {
			...mapMutations(['setUserInfo','setAfterLoginUrl']),
			getCartNms(){
				this.$http({
					apiName:"getCartNms"
				}).then(res => {
					if(res.data > 0){
						uni.setTabBarBadge({
						  index: 2,
						  text: String(res.data)
						})
					}else{
						uni.removeTabBarBadge({
							index: 2,
						})
					}
				}).catch(_ => {})
			},
			async getUserInfo(){
				await this.$http({
					apiName:"getUserInfo"
				}).then(res => {
					this.setUserInfo(res.data)
				}).catch(_ => {})
			},
			//初始化数据
			initData(){
				uni.showLoading({ title: '加载中' });
				this.getBanner()
				this.getDynamicNav()
				this.getNotice()
				this.getTopic()
				this.getTopic123()
				uni.hideLoading()
			},
			//轮播图
			async getBanner(){
				await this.$http({
					apiName:"getBanner",
					data:{type:0}
				}).then(res => {
					this.loadData(res.data)
				}).catch(_ => {})
			},
			//动态菜单
			async getDynamicNav(){
				await this.$http({
					apiName:"getDynamicNav"
				}).then(res => {
					if(res.data.length){
						for(var i=0;i<res.data.length;i+=5){
						    this.navs.push(res.data.slice(i,i+5));
						}
					}
				}).catch(_ => {})
			},
			//滚动广告
			async getNotice(){
				await this.$http({
					apiName:"getAds"
				}).then(res => {
					this.notices = res.data
				}).catch(_ => {})
			},
			//主题推荐
			async getTopic(){
				await this.$http({
					apiName:"getTopic"
				}).then(res => {
					this.tipics = res.data
				}).catch(_ => {})
			},
			//获取促销1，新品2，精选3内容
			async getTopic123(){
				for(let i = 0 ; i < 3 ; i ++){
					await this.$http({
						apiName:"getModule",
						data:{type:i+1}
					}).then(res => {
						this.$set(this.topics123,i,res.data)
					}).catch(_ => {})
				}
				// console.log(this.topics123)
			},
			async loadData(carouselList) {
				this.titleNViewBackground = carouselList[0].background;
				this.swiperLength = carouselList.length;
				this.carouselList = carouselList;
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				this.titleNViewBackground = this.carouselList[index].background;
			},
			toTopic(id){
				uni.navigateTo({
					url: '/pages/topic/topic?id=' + id
				})
			},
			toMore(){
				uni.navigateTo({
					url: '/pages/topic/list'
				})
			},
			//详情页
			navToDetailPage(id) {
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			navTo(url){
				if(!this.hasLogin){
					this.setAfterLoginUrl(url)
					url = '/pages/public/login';
				}
				uni.navigateTo({  
					url
				})  
			}, 
			//模块跳转
			//type：1新品首发，2精品推荐，3促销专区，4积分兑换，5今日签到，6商品详情，7专题详情 8文章
			pageJump(typeId,dataId){
				switch(Number(typeId)){
					case 1:
						uni.navigateTo({
							url:"/pages/product/typeList?typeId=2"
						})
						break;
					case 2:
						uni.navigateTo({
							url:"/pages/product/typeList?typeId=3"
						})
						break;
					case 3:
						uni.navigateTo({
							url:"/pages/product/typeList?typeId=1"
						})
						break;
					case 4:
						uni.navigateTo({
							url:"/pages/product/typeList?score=true"
						})
						break;
					case 5:
						this.navTo("/pages/integral/integral")
						break;
					case 6:
						uni.navigateTo({
							url:"/pages/product/product?id=" + dataId
						})
						break;
					case 7:
						uni.navigateTo({
							url:"/pages/topic/topic?id=" + dataId
						})
						break;
					case 8:
						uni.navigateTo({
							url:"/pages/article/article?id=" + dataId
						})
						break;
					default:
						return
						break;
				}
			},
			//跳转内容
			toArtilce(id){
				uni.navigateTo({
					url:"/pages/article/article?noticeId=" + id
				})
			},
			//重置数据
			resetData(){
				this.carouselList = [];
				this.titleNViewBackground = '';
				this.swiperCurrent =  0;  //当前轮播index
				this.swiperLength =  0;  //轮播内容长度
				this.navs = [];// 动态导航
				this.notices = [];  //滚动通知/广告
				this.tipics = [];  //主题内容
				this.topics123 = [[],[],[]];  //促销内容，新品，精选
			}
		},
		//下拉刷新
		async onPullDownRefresh(){
			this.resetData()
			await this.initData()
			uni.stopPullDownRefresh();
			uni.showToast({
				title: '刷新成功'
			})
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			// #ifdef APP-PLUS
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			const currentWebview = page.$getAppWebview();
			currentWebview.hideTitleNViewButtonRedDot({
				index
			});
			// #endif
			
			if (index === 1) {
				uni.navigateTo({
					url: '/pages/product/list'
				})
			} else if (index === 0) {
				uni.navigateTo({
					url: '/pages/notice/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F9FAFB;
	}
	.m-t{
		margin-top: 16rpx;
	}
	.m-t2{
		margin-top: 0;
	}
	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;

		// .titleNview-placing {
		// 	height: var(--status-bar-height);
		// 	padding-top: 44px;
		// 	box-sizing: content-box;
		// }

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 338rpx;
			transition: .4s;
		}
	}
	.carousel {
		width: 100%;
		height: 350rpx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28rpx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10rpx;
		}
	}
	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60rpx;
		bottom: 15rpx;
		width: 72rpx;
		height: 36rpx;
		background-image: url(/static/lunbodian.png);
		background-size: 100% 100%;

		.num {
			width: 36rpx;
			height: 36rpx;
			border-radius: 50px;
			font-size: 24rpx;
			color: #fff;
			text-align: center;
			line-height: 40rpx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36rpx;
			font-size: 12rpx;
			color: #fff;
			transform: translateX(-50%);
		}
	}
	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap:wrap;
		padding: 30rpx 22rpx; 
		padding-bottom: 0;
		background: #fff;
		.swiper-nav{
			width: 100%;
			height: 190rpx;
			.swiper-nav-item{
				width: 100%;
				height: 100%;
				display: flex;
				// justify-content: space-between;
				.cate-item{
					width: 25%;
					text-align: center;
					.cate-item-img{
						width: 88rpx;
						height: 88rpx;
					}
					.cate-item-text{
						// margin-top: 10rpx;
						font-size: 26rpx;
						color: #606266;
					}
				}
			}
		}
		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2rpx;
			color: $font-color-dark;
		}
		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88rpx;
			height: 88rpx;
			margin-bottom: 14rpx;
			border-radius: 50%;
			opacity: .7;
			box-shadow: 4rpx 4rpx 20rpx rgba(250, 67, 106, 0.3);
		}
	}
	.ad-1{
		width: 100%;
		box-sizing: border-box;
		background-color: #F9FAFB;
		padding: 20rpx 32rpx;
		.ad-1-box{
			background-color: #fff;
			padding: 20rpx;
			width: 100%;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.ad-1-img{
				width: 144rpx;
				height: auto;
			}
			.ad-1-swiper{
				flex: 1;
				height: 32rpx;
				margin-left: 20rpx;
				.ad1-item-text{
					font-size: 26rpx;
					color: #909399;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
	/* 秒杀专区 */
	.seckill-section{
		padding: 4rpx 30rpx 24rpx;
		background: #fff;
		.floor-list{
			white-space: nowrap;
		}
		.scoll-wrapper{
			display:flex;
			align-items: flex-start;
		}
		.floor-item2{
			margin-right: 20rpx;
			font-size: $font-sm+2rpx;
			color: $font-color-dark;
			line-height: 1.8;
			width: 48%;
			.floor-item-img{
				width: 332rpx;
				height: 332rpx;
				border-radius: 6rpx;
			}
			.title{
				color: #303133;
				font-size: 30rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.price{
				color: #F23D3D;
				font-size: 34rpx;
			}
		}
	}
	.f-header2{
		display:flex;
		align-items:center;
		height: 90rpx;
		padding: 6rpx 30rpx 8rpx;
		background: #fff;
		image{
			flex-shrink: 0;
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
		}
		.tit-box{
			flex: 1;
			display: flex;
			flex-direction: column;
		}
		.tit-box2{
			font-size: 24rpx;
			color: #C0C4CC;
			display: flex;
		}
		.tit{
			font-size: 32rpx;
			color: #303133;
			font-weight: bold;
		}
	}
	.f-header3{
		padding-left: 0;
		padding-right: 0;
	}
	.f-header{
		display:flex;
		align-items:center;
		height: 140rpx;
		padding: 6rpx 30rpx 8rpx;
		background: #fff;
		image{
			flex-shrink: 0;
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
		}
		.tit-box{
			flex: 1;
			display: flex;
			flex-direction: column;
		}
		.tit-box2{
			font-size: 24rpx;
			color: #C0C4CC;
			display: flex;
		}
		.tit{
			font-size: 32rpx;
			color: #303133;
			font-weight: bold;
		}
		.tit2{
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	/* 团购楼层 */
	.group-section2{
		background: #fff;
		.g-swiper{
			height: 440rpx;
			padding-bottom: 30rpx;
			.g-swiper-item{
				padding: 0 30rpx;
				.g-image{
					width: 100%;
					height: auto;
					border-radius: 8rpx;
				}
				.t-box{
					margin-top: 10rpx;
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
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
		}
	}
	.group-section{
		background: #fff;
		.g-swiper{
			height: 650rpx;
			padding-bottom: 30rpx;
		}
		.g-swiper-item{
			width: 100%;
			padding: 0 30rpx;
			display:flex;
		}
		image{
			width: 100%;
			height: 460rpx;
			border-radius: 4px;
		}
		.g-item{
			display:flex;
			flex-direction: column;
			overflow:hidden;
		}
		.left{
			flex: 1.2;
			margin-right: 24rpx;
			.t-box{
				padding-top: 20rpx;
			}
		}
		.right{
			flex: 0.8;
			flex-direction: column-reverse;
			.t-box{
				padding-bottom: 20rpx;
			}
		}
		.t-box{
			height: 160rpx;
			font-size: $font-base+2rpx;
			color: $font-color-dark;
			line-height: 1.6;
		}
		.price{
			color:$uni-color-primary;
		}
		.m-price{
			font-size: $font-sm+2rpx;
			text-decoration: line-through;
			color: $font-color-light;
			margin-left: 8rpx;
		}
		.pro-box{
			display:flex;
			align-items:center;
			margin-top: 10rpx;
			font-size: $font-sm;
			color: $font-base;
			padding-right: 10rpx;
		}
		.progress-box{
			flex: 1;
			border-radius: 10px;
			overflow: hidden;
			margin-right: 8rpx;
		}
	}
	/* 分类推荐楼层 */
	.hot-floor{
		width: 100%;
		overflow: hidden;
		margin-bottom: 20rpx;
		.floor-img-box{
			width: 100%;
			height:320rpx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(rgba(255,255,255,.06) 30%, #f8f8f8);
			}
		}
		.floor-img{
			width: 100%;
			height: 100%;
		}
		.floor-list{
			white-space: nowrap;
			padding: 20rpx;
			padding-right: 50rpx;
			border-radius: 6rpx;
			margin-top:-140rpx;
			margin-left: 30rpx;
			background: #fff;
			box-shadow: 1px 1px 5px rgba(0,0,0,.2);
			position: relative;
			z-index: 1;
		}
		.scoll-wrapper{
			display:flex;
			align-items: flex-start;
		}
		.floor-item{
			width: 180rpx;
			margin-right: 20rpx;
			font-size: $font-sm+2rpx;
			color: $font-color-dark;
			line-height: 1.8;
			image{
				width: 180rpx;
				height: 180rpx;
				border-radius: 6rpx;
			}
			.price{
				color: $uni-color-primary;
			}
		}
		.more{
			display:flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			flex-shrink: 0;
			width: 180rpx;
			height: 180rpx;
			border-radius: 6rpx;
			background: #f3f3f3;
			font-size: $font-base;
			color: $font-color-light;
			text:first-child{
				margin-bottom: 4rpx;
			}
		}
	}
	/* 猜你喜欢 */
	.guess-section{
		display:flex;
		flex-wrap:wrap;
		padding: 0 30rpx;
		background: #fff;
		.guess-item{
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
		.price{
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
	}
	

</style>
