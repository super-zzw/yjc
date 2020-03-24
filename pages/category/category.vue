<template>
	<view class="content content2 wxPage" :style="{paddingTop:paddingTop}">
		<!-- #ifdef MP-WEIXIN -->
		<wxTabbar></wxTabbar>
		<!-- #endif -->
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in flist" :key="item.id" class="f-item b-b" :class="{active: item.id == currentId}" @tap="tabtap(item)">
				{{item.name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<view v-for="(item,index) in categoryList" :key="item.id" class="s-list" :id="'main-'+item.id" :class="{lastItem: (index == categoryList.length - 1) && loaded}">
				
				<view class="h-list" v-if="carouselList.length > 0 && index == 0"></view>
				<swiper v-if="carouselList.length > 0 && index == 0" class="carousel" circular indicator-active-color="#F23D3D" indicator-color="#D8D8D8" :indicator-dots="carouselList.length > 1" :autoplay="true">
					<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item">
						<image :src="item.pic" mode="widthFix"/>
					</swiper-item>
				</swiper>
				<view class="h-list"></view>
				<view class="t-list t-list2" v-if="config.MALL_CATEGORY_STYLE == 1">
					<view class="t-item2" v-for="(titem,tindex) in tlist" v-if="titem.parentId == item.id" :key="tindex">
						<view class="t-item3">
							<image  @tap="navToDetailPage(titem.productId)" class="img" :src="titem.picUrl"></image>
							<view class="tl2">
								<view class="tl2t1Box"  @tap="navToDetailPage(titem.productId)">
									<view class="tl2t1">
										{{titem.title}}
									</view>
								</view>
								<view class="tl2t3" v-if="titem.skuName">
									<text v-for="(val,key) in JSON.parse(titem.skuName)" :key="key">
										<text>{{key}}</text>:<text>{{val}}</text>;
									</text>
								</view>
								<view class="tl2t2">
									<view class="gcprice nm-font">
										¥{{titem.promotionPrice}}
									</view>
									<text v-if="!hasLogin || titem.num == 0" @tap.stop="addCart(titem)" class="iconfont iconxiadangoumaiicon-yaoqingfanliye"></text>
									<uniNumberBox
										v-if="hasLogin && titem.num > 0"
										class="gcNum"
										:cartId="String(titem.cartId)"
										:min="0" 
										:max="titem.stock"
										:value="titem.num > titem.stock ? titem.stock : titem.num"
										:isMax="titem.num >= titem.stock ? true : false"
										:isMin="titem.num == 0"
										:otherData="{currentIndex:tindex}"
										@eventChange="numberChange"
									></uniNumberBox>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="t-list" v-else>
					<view class="t-item" @tap="toList(titem.id)" v-for="(titem,tindex) in tlist" v-if="titem.parentId == item.id" :key="tindex">
						<image :src="titem.img"></image>
						<text>{{titem.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { mapState,mapMutations } from 'vuex';
import utils from '@/utils/method.js'
import uniNumberBox from '@/components/uni-number-box.vue'
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: -9999,
				categoryList:[],
				flist: [],
				tlist:[],
				carouselList:[],
				otherBoxStyle:{},
				loaded:false
			}
		},
		async onLoad() {
			//此处刷新session影响最小
			let _rsisson = uni.getStorageSync("yzhrefreshSession")
			if(_rsisson){
				await this.$http({
					apiName:"refreshSession",
					type:"POST",
					data:{
						refreshSession:_rsisson
					}
				}).then(res => {
					utils.setSesion(res.data)
				}).catch(_ => {})
			}
		},
		async onShow(){
			await this.initData()
			utils.setBadgeText(0,this.msgNms)
			let that = this
			setTimeout(() => {
				if(that.hasLogin){
					that.getCartNms();  //获取购物车数量
				}
				that.$getMsgNms()
			},800)
		},
		onHide() {
			this.resetData()
		},
		computed:{
			...mapState(['msgNms','hasLogin','paddingTop','config'])
		},
		methods: {
			...mapMutations(['setAfterLoginUrl','setAfterLoginIsTab']),
			async addCart(item){
				if(this.hasLogin){
					uni.showLoading({
						mask:true
					})
					await this.$http({
						apiName:"addCart",
						type:"POST",
						data:{
							productId :item.productId,
							checked :1,
							num :1,
							skuJson : item.skuName
						}
					}).then(res => {
						uni.showToast({
							title:"添加成功"
						})
						this.$set(item,'num',item.num + 1 );
						this.$set(item,'cartId',res.data )
						this.getCartNms()
					}).catch(_ => {})
					uni.hideLoading()
				}else{
					this.toLogin()
				}
			},
			async numberChange(data){
				uni.showLoading({
					mask:true
				})
				await this.$http({
					apiName:"changeCartGoodNm",
					type:"POST",
					data:{
						cartId:data.cartId,
						num:data.number
					}
				}).then(res => {
					this.$set(this.tlist[data.item.currentIndex],'num',data.number)
				}).catch(_ => {})
				uni.hideLoading()
			},
			//未登录跳转
			toLogin(){
				this.setAfterLoginUrl('/pages/category/category')
				this.setAfterLoginIsTab(true)
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: '/pages/wxlogin/index'
				})
				// #endif
				// #ifndef MP-WEIXIN
				uni.navigateTo({
					url: '/pages/public/login'
				})
				// #endif
			},
			navToDetailPage(id){
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
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
			resetData(){
				this.categoryList = [];
				this.flist = [];
				this.tlist = [];
				this.carouselList = [];
				this.sizeCalcState = false
				this.tabScrollTop = 0
				this.currentId = -9999
			},
			async initData(){
				uni.showLoading({ title: '加载中' });
				await this.getData()
				await this.getBanner()
				await this.calcSize()
				uni.hideLoading()
			},
			async getData(){
				let _type = this.config.MALL_CATEGORY_STYLE;
				// let _type = 1;
				await this.$http({
					apiName:"getCategory",
					data:{
						type:_type
					}
				}).then(res => {
					if(_type == 1){
						for(let key in res.data){
							let item = res.data[key];
							if(item.length > 0){
								this.flist.push({
									id:key,
									name:key
								});
								this.categoryList.push({
									id:key,
									name:key,
								});
								item.map(chilItem => {
									this.$set(chilItem,"parentId",key)
								});
								this.tlist.push(...item)
							}
						}
					}else{
						res.data.forEach(item=>{
							if(item.children){
								this.flist.push({
									id:item.id,
									name:item.name
								});
								this.categoryList.push({
									id:item.id,
									name:item.name
								});
								this.tlist.push(...item.children)
							}
						}) 
					}
					
					this.currentId = this.flist[0].id
					this.$nextTick(function(){
						this.loaded = true;
					})
				}).catch(_ => {})
			},
			//获取头部banner
			async getBanner(){
				await this.$http({
					apiName:"getBanner",
					data:{type:4}
				}).then(res => {
					this.carouselList = res.data
				}).catch(_ => {})
			},
			//一级分类点击
			async tabtap(item){
				if(!this.sizeCalcState){
					await this.calcSize();
				}
				this.currentId = item.id;
				let index = this.categoryList.findIndex( sitem => sitem.id == item.id);
				this.tabScrollTop = this.categoryList[index].top + 5;
			},
			//右侧栏滚动
			async asideScroll(e){
				if(!this.sizeCalcState){
					await this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.categoryList.filter(
					item => item.top <= scrollTop
				).reverse();
				if(tabs.length > 0){
					this.currentId = tabs[0].id;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let that = this;
				let h = 0;
				let categoryListLen = this.categoryList.length;
				this.categoryList.forEach((item,index) => {
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({size: true}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
			toList(id){
				uni.navigateTo({
					url: `/pages/product/list?categoryid=${id}`
				})
			},
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

<style lang='scss'>
	/* page{
		background-color: #fff;
	} */
	/* page, */
	.content {
		height: 100%;
		background-color: #fff;
	}
	.content2{
		/* #ifdef H5 */
		height: calc(100vh - 188rpx);
		/* #endif */
		/* #ifdef  MP-WEIXIN */
		height: calc(100vh - 88rpx);
		/* #endif */
		/* #ifdef APP-PLUS */
		height: 100vh;
		/* #endif */
		box-sizing: border-box;
	}
	.right-aside{
		
		.carousel{
			/* margin-top: 30rpx; */
			height: 270rpx;
			background-color: #fff;
			padding: 15rpx;
			box-sizing: border-box;
			.carousel-item{
				height: 100%;
				border-radius: 10rpx;
				overflow: hidden;
				background-color: #fff;
				image{
					width: 100%;
					height: auto;
					
				}
			}
		}
	}
	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200rpx;
		height: 100%;
		background-color: #fff;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100rpx;
		font-size: 28rpx;
		color: $font-color-base;
		position: relative;
		&.active{
			color: $base-color;
			background: #f0efef;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36rpx;
				width: 8rpx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20rpx;
		background-color: #f0efef;
		.lastItem{
			/* #ifdef MP-WEIXIN */
			height: calc(100vh - 130rpx);
			/* #endif */
			/* #ifdef H5 */
			height: calc(100vh - 180rpx);
			/* #endif */
			/* #ifdef APP-PLUS */
			height: calc(100vh + 10rpx);
			/* #endif */
		}
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70rpx;
		padding-top: 8rpx;
		font-size: 28rpx;
		color: $font-color-dark;
	}
	.h-list{
		width: 100%;
		height: 30rpx;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 20rpx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
		.t-item{
			flex-shrink: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			width: 176rpx;
			font-size: 26rpx;
			color: #666;
			padding-bottom: 20rpx;
			
			image{
				width: 140rpx;
				height: 140rpx;
			}
		}
	}
	.t-list2{
		display: unset;
		.t-item2{
			background-color: #fff;
			padding: 20rpx;
			padding-bottom: 0;
			.t-item3{
				display: flex;
				justify-content: space-between;
				padding-bottom: 20rpx;
				border-bottom: 2rpx solid #F5F5F8;
				.img{
					width: 140rpx;
					height: 140rpx;
					background-color: #C0C4CC;
				}
				.tl2{
					flex: 1;
					margin-left: 20rpx;
					.tl2t1Box{
						height: 70rpx;
					}
					.tl2t1{
						color: #303133;
						font-size: 26rpx;
						word-break: break-all;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					.tl2t2{
						margin-top: 8rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.gcprice{
							color: #F23D3D;
							font-size: 28rpx;
						}
						.iconfont{
							color: #909399;
							font-size: 24rpx;
							width: 42rpx;
							height: 42rpx;
							border-radius: 50%;
							border: 2rpx solid #909399;
							text-align: center;
							line-height: 42rpx;
						}
						.gcNum{
							width: 150rpx;
							height: 35rpx;
							position: unset;
							background: none;
							/deep/ .uni-numbox-minus,
							/deep/ .uni-numbox-plus{
								box-sizing: border-box;
								width: 34rpx;
								height: 34rpx;
								border: 2rpx solid #C0C4CC;
								border-radius: 50%!important;
								line-height: 20rpx;
								.iconfont{
									font-size: 20rpx;
								}
							}
							/deep/ .uni-numbox-value{
								width: 80rpx;
								min-width: 80rpx;
							}
							/deep/ .uni-numbox-plus{
								background-color: #F23D3D;
								border-color: #F23D3D;
								.iconfont{
									color: #fff;
								}
							}
						}
					}
					.tl2t3{
						color: #909399;
						font-size: 26rpx;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
					}
				}
			}
		}
	}
</style>
