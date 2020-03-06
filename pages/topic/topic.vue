<template>
	<view class="sWrap">
		<swiper class="carousel" circular  indicator-active-color="#F23D3D" indicator-color="#D8D8D8" :indicator-dots="carouselList.length > 1" :autoplay="true">
			<swiper-item v-for="item in carouselList" :key="item" class="carousel-item">
				<image :src="item" class="carousel-itemimg" mode="widthFix"/>
			</swiper-item>
		</swiper>
		<view class="sbox">
			<view class="t-box">
				<text class="title">{{topics.title}}</text>
				<view class="price-box" v-if="topics.price">
					<text class="price nm-font">￥{{topics.price}}</text> 
					<text class="m-price">起</text>
				</view>
			</view>
			<view class="pro-box">
				<rich-text :nodes="topics.content"></rich-text>
			</view>
		</view>
		<view class="guess-section" v-if="topicsList.length > 0">
			<view class="guess-section-top">
				<view class="guess-section-top1"></view>
				<view class="guess-section-top2">专题推荐商品</view>
				<view class="guess-section-top1"></view>
			</view>
			<view 
				@click="navToDetailPage(item.productId)"
				v-for="(item, index) in topicsList" :key="index"
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
	export default {
		data() {
			return {
				id:"",
				topics:[],
				carouselList:[],
				topicsList:[]
			}
		},
		methods: {
			initData(){
				uni.showLoading({ title: '加载中' });
				this.getTopicDetail()
				this.getTopicList()
				uni.hideLoading()
			},
			async getTopicDetail(){
				await this.$http({
					apiName:"getTopicDetail",
					data:{id:this.id}
				}).then(res => {
					this.topics = res.data
					this.$set(this.topics,"content",this.topics.content.replace(/\<img/gi, '<img class="cont_img" '))
					this.carouselList = JSON.parse(this.topics.albumPics)
				}).catch(_ => {})
			},
			async getTopicList(){
				await this.$http({
					apiName:"getTopicList",
					data:{subjectId:this.id}
				}).then(res => {
					this.topicsList = res.data
				}).catch(_ => {})
			},
			//详情页
			navToDetailPage(id) {
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
		},
		async onLoad(opt) {
			if(opt.id){
				this.id = opt.id
				await this.initData()
			}
			
		},
	}
</script>

<style lang="scss" scoped>
	.sWrap{
		background: #F9FAFB;
		min-height: 100vh;
	}
	.carousel {
		background-color: #fff;
		width: 100%;
		height: 270rpx;
		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28rpx;
			overflow: hidden;
			.carousel-itemimg{
				width: 100%;
				height: auto;
			}
		}
	
		image {
			width: 100%;
			height: 100%;
			border-radius: 10rpx;
		}
	}
	.sbox{
		background-color: #fff;
		padding-left: 30rpx;
		padding-right: 30rpx;
		.t-box{
			padding-top: 20rpx;
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
			// color: #909399;
			// font-size: 28rpx;
			width:100%;
			padding-top: 10rpx;
			padding-bottom: 10rpx;
			// overflow: hidden;
			// text-overflow: ellipsis;
			// display: -webkit-box;
			// -webkit-line-clamp: 3;
			// -webkit-box-orient: vertical;
		}
	}
	.guess-section{
		margin-top: 30rpx;
		display:flex;
		flex-wrap:wrap;
		padding: 0 30rpx;
		background: #fff;
		.guess-section-top{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			.guess-section-top1{
				width: 48rpx;
				height: 2rpx;
				background-color: #DFDFDF;
			}
			.guess-section-top2{
				color: #303133;
				font-size: 30rpx;
				margin-left: 20rpx;
				margin-right: 20rpx;
				font-weight: bold;
				line-height: 80rpx;
			}
		}
		.guess-item{
			display:flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40rpx;
			&:nth-child(2n){
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
