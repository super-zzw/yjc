<template>
	<view class="container wxPage"  :style="{paddingTop:paddingTop}">
		<!-- #ifdef MP-WEIXIN -->
		<wxTabbar></wxTabbar>
		<!-- #endif -->
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
		<view class="f-header2 m-t m-t2" v-if="tipics.length > 0 && config.MALL_HOMW_SWAITCH.themeFlag == 1">
			<view class="tit-box">
				<text class="tit">主题推荐</text>
			</view>
			<view class="tit-box2" @tap="toMore()">
				更多
				<text class="iconfont iconright"></text>
			</view>
		</view>
		<view class="group-section2" v-if="tipics.length > 0 && config.MALL_HOMW_SWAITCH.themeFlag == 1">
			<swiper class="g-swiper" :duration="500" :autoplay="true">
				<swiper-item
					class="g-swiper-item"
					v-for="(item, index) in tipics" :key="index"
					@tap="toTopic(item.id)"
				>
					<image class="g-image" :src="item.pic" mode=""></image>
					<view class="t-box">
						<text class="title">{{item.title}}</text>
						<view class="price-box" v-if="item.price">
							<text class="price nm-font">¥{{item.price}}</text> 
							<text class="m-price">起</text>
						</view>
					</view>
					<view class="pro-box">{{item.description}}</view>
				</swiper-item>
			</swiper>
		</view>
		
		<!-- 超值拼团 -->
		<view class="seckill-section m-t" v-if="fightList.length > 0 && config.MALL_HOMW_SWAITCH.groupFlag == 1">
			<view class="f-header2 m-t f-header3">
				<view class="tit-box">
					<text class="tit">超值拼团</text>
				</view>
				<view class="tit-box2" @tap="pageJump(9)">
					更多
					<text class="iconfont iconright"></text>
				</view>
			</view>
			<scroll-view class="floor-list" scroll-x>
				<view class="scoll-wrapper">
					<view 
						@click="fightDetailPage(item.id)"
						v-for="(item, index) in fightList" :key="index"
						class="floor-item floor-item2"
					>
						<image mode="" class="floor-item-img" :src="item.picUrl"></image>
						
						<text class="price nm-font price12">
							<text class="price1">¥{{item.minGroupPrice}}</text>
							<text class="price2">¥{{item.minPromotionPrice}}</text>
						</text>
						<text class="title clamp">{{item.title}}</text>
						<view class="fTextBox" v-if="item.status == 0">
							<text class="fText1 nm-font">{{item.startDate}}</text>开始
						</view>
						<view class="fTextBox" v-if="item.status == 1 && creset">
							<uni-countdown :show-day="false" color="#FFFFFF" background-color="#F23D3D" border-color="#F23D3D" splitorColor="#F23D3D" :hour="item.hour" :minute="item.minute" :second="item.second" @timeup="timeUp"> </uni-countdown>
							<text class="fText2">后结束</text>
						</view>
						<view class="fTextBox" v-if="item.status == 2">
							<text class="fText2">拼团已结束</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 新品首发 -->
		<view class="seckill-section m-t" v-if="config.MALL_HOMW_SWAITCH.newFlag == 1">
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
						<image mode="" class="floor-item-img" :src="item.picUrl"></image>
						<text class="title clamp">{{item.title}}</text>
						<text class="price nm-font">¥{{item.minPrice}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
	
		<!-- 精品专区 -->
		<view class="f-header2 m-t"  v-if="config.MALL_HOMW_SWAITCH.boutiqueFlag == 1">
			<view class="tit-box">
				<text class="tit">精品专区</text>
			</view>
			<view class="tit-box2" @tap="pageJump(2)">
				更多
				<text class="iconfont iconright"></text>
			</view>
		</view>
		
		<view class="guess-section"  v-if="config.MALL_HOMW_SWAITCH.boutiqueFlag == 1">
			<view 
				@click="navToDetailPage(item.productId)"
				v-for="(item, index) in topics123[2]" :key="index"
				class="guess-item"
			>
				<view class="image-wrapper">
					<image :src="item.picUrl" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.title}}</text>
				<text class="price nm-font">¥{{item.minPrice}}</text>
			</view>
		</view>
		<!-- 促销专区 -->
		<view class="f-header2 m-t" v-if="config.MALL_HOMW_SWAITCH.promotionFlag == 1">
			<view class="tit-box">
				<text class="tit">促销专区</text>
			</view>
			<view class="tit-box2" @tap="pageJump(3,1)">
				更多
				<text class="iconfont iconright"></text>
			</view>
		</view>
		<view class="guess-section" v-if="config.MALL_HOMW_SWAITCH.promotionFlag == 1">
			<view 
				@click="navToDetailPage(item.productId)"
				v-for="(item, index) in topics123[0]" :key="index"
				class="guess-item"
			>
				<view class="image-wrapper">
					<image :src="item.picUrl" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.title}}</text>
				<text class="price nm-font">¥{{item.minPrice}}</text>
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
import uniCountdown from "@/components/linnian-CountDown/uni-countdown.vue"
	export default {
		components: {
			uniCountdown
		},
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
				fightList:[],
				currentTime:"",
				creset:false,
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo','paddingTop','config'])
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
		async onLoad(opt) {
			// #ifdef APP-PLUS 
			this.$checkUpdate();
			// #endif
			await this.initData();
			if(opt.inviteCode){
				this.$store.commit('setICode',opt.inviteCode)
			}
		},
		onHide() {
			if(this.hasLogin && JSON.stringify(this.userInfo) == '{}'){
				this.getUserInfo()
			}
		},
		methods: {
			...mapMutations(['setUserInfo','setAfterLoginUrl']),
			timeUp(){
				console.log("计时结束");
				this.creset = false;
				this.getFight();
			},
			//拼团数据
			async getFight(){
				await this.$http({
					apiName:"HomeFight"
				}).then(res => {
					this.fightList = res.data;
					this.currentTime = res.timestamp;
					this.fightList.map(item => {
						if(item.status == 0){
							item["startDate"] = utils.unixToDatetime(item.startTime,8)
						}
						if(item.status == 1){
							var etime = item.endTime - this.currentTime;
							if(etime > 0){
								let _trDate = utils.transToDate(etime);
								item["hour"] = _trDate.h;
								item["minute"] = _trDate.m;
								item["second"] = _trDate.s;
							}
						}
					})
				}).catch(_ => {});
				this.creset = true;
			},
			fightDetailPage(id){
				uni.navigateTo({
					url: `/pages/fight/productDetail?id=${id}`
				})
			},
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
				this.getFight()
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
					// #ifdef MP-WEIXIN
					url = '/pages/wxlogin/index';
					// #endif
					// #ifndef MP-WEIXIN
					url = '/pages/public/login';
					// #endif
					
				}
				uni.navigateTo({  
					url
				})  
			}, 
			//模块跳转
			//type：1新品首发，2精品推荐，3促销专区，4积分兑换，5今日签到，6商品详情，7专题详情 8文章,9超值拼团
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
					case 9:
						uni.navigateTo({
							url:"/pages/fight/list"
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
		/*  #ifdef APP-PLUS || H5 */
		background-image: url(~@/static/lunbodian.png);
		/*  #endif */
		/*  #ifdef MP-WEIXIN */
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		/*  #endif */
		background-size: 100% 100%;
		.num {
			width: 36rpx;
			height: 36rpx;
			border-radius: 50px;
			font-size: 24rpx;
			color: #fff;
			text-align: center;
			line-height: 36rpx;
			/*  #ifdef APP-PLUS || H5 */
			line-height: 40rpx;
			/* #endif */
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36rpx;
			/*  #ifdef APP-PLUS || H5 */
			font-size: 12rpx;
			/*  #endif */
			/*  #ifdef MP-WEIXIN */
			font-size: 16rpx;
			/*  #endif */
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
			width: 100%;
		}
		.scoll-wrapper{
			display:flex;
			align-items: flex-start;
			padding-bottom: 40rpx;
		}
		.floor-item2{
			margin-right: 20rpx;
			font-size: 30rpx;
			color: $font-color-dark;
			line-height: 1.8;
			overflow: hidden;
			box-sizing: border-box;
			box-shadow: 0 0 20rpx 0 rgba(0,0,0,.13);
			border-radius: 20rpx;
			border: 2rpx solid rgba(0,0,0,.13);
			overflow: hidden;
			flex: 1 0 48%;
			.floor-item-img{
				width: 100%;
				border-radius: 6rpx;
				height: 330rpx;
			}
			.title{
				color: #303133;
				font-size: 30rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
				padding: 0 20rpx;
				line-height: 40rpx;
			}
			.price{
				color: #F23D3D;
				font-size: 30rpx;
				display: block;
				padding: 0 20rpx 16rpx;
				.price2{
					text-decoration: line-through;
					color: #909399;
					font-size: 26rpx;
					margin-left: 20rpx;
				}
			}
			.price12{
				line-height: 40rpx;
				padding-bottom: 0;
			}
			.title2{
				padding-bottom: 20rpx;
			}
			.fTextBox{
				padding: 0 20rpx 20rpx;
				font-size: 28rpx;
				.fText1{
					color: #F23D3D;
					font-weight: bold;
				}
				.fText2{
					color: #909399;
				}
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
					height: 345rpx;
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
			font-size: 30rpx;
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
			margin-bottom: 30rpx;
			overflow: hidden;
			box-sizing: border-box;
			box-shadow: 0 0 20rpx 0 rgba(0,0,0,.13);
			border-radius: 20rpx;
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
			font-size: 30rpx;
			color: $font-color-dark;
			line-height: 60rpx;
			padding: 0 20rpx;
		}
		.price{
			padding: 0 20rpx 16rpx;
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
	}
	

</style>
