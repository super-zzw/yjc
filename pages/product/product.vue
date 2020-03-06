<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index">
					<view class="image-wrapper">
						<image
							:src="item" 
							class="loaded" 
							mode="aspectFill"
						></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="introduce-section">
			<text class="title">{{title}}</text>
			<view class="price-box" v-if="isScore == 'true'">
				<text class="price nm-font">{{exchangePoints}}积分</text>
			</view>
			<view class="price-box" v-else>
				<text class="price-tip">¥</text>
				<text class="price nm-font">{{stockInfo.promotionPrice}}</text>
				<text class="m-price nm-font" v-if="stockInfo.promotionPrice < stockInfo.originalPrice">{{stockInfo.originalPrice}}</text>
			</view>
			<view class="bot-row">
				<text>销量: {{sale}}</text>
				<text>库存: {{stock}}</text>
				<text>浏览量: {{views}}</text>
			</view>
		</view>
		
		<!--  分享 -->
		<view class="share-section" v-if="!(isScore == 'true')">
			<text class="iconfont iconjifen"></text>
			<text class="tit">该商品购买成功可得{{stockInfo.giftPoint}}积分</text>
			
		</view>
		
		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">商品规格</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
						{{sItem.value}}
					</text>
					<!-- <text class="selected-text">数量:{{number}}</text> -->
				</view>
				<text class="iconfont iconright"></text>
			</view>
		</view>
		
		<!-- 评价 -->
		<view class="eva-section" v-if="commentNum > 0">
			<view class="e-header">
				<text class="e-header-left">
					<text class="tit">评价</text>
					<text>({{commentNum}})</text>
				</text>
				<text class="e-header-right" @tap="moredComment">
					<text class="tip">更多评价</text>
					<text class="iconfont iconright"></text>
				</text>
			</view> 
			<view class="eva-box">
				<image class="portrait" :src="comment.wuserIcon || '/static/defaultface.png'" mode="aspectFill"></image>
				<view class="right">
					<text class="name">{{comment.wuserName}}</text>
					<text class="con">{{comment.content}}</text>
					<view class="bot">
						<text class="attr">
							购买类型：
							<text :key="index" class="attr-text" v-for="(item,index) in commentGoodType">{{item.value}}</text>
						</text>
						<text class="time">{{commentTime}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<rich-text :nodes="desc"></rich-text>
		</view>
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom page-bottom-score" v-if="isScore == 'true'" @click="buy">去兑换</view>
		<view class="page-bottom" v-else>
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="iconfont iconyemian-copy-copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn p-b-btn2">
				<text class="iconfont icongouwuche1"></text>
				<text>购物车</text>
				<text class="p-b-btn-bg" v-if="cartNms > 0 && cartNms < 100">{{cartNms}}</text>
				<text class="p-b-btn-bg" v-if="cartNms > 100">99+</text>
			</navigator>
			<view class="p-b-btn" :class="{active: collectionFlag}" @click="toFavorite">
				<text class="iconfont iconxin"></text>
				<text>收藏</text>
			</view>
			
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @tap="addCart">加入购物车</button>
			</view>
		</view>
		
		
		<!-- 规格-模态层弹窗 -->
		<view 
			class="popup spec" 
			:class="specClass"
			@touchmove.stop.prevent="stopPrevent"
			@click="toggleSpec"
		>
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="stockInfo.pic"></image>
					<view class="right">
						<text class="price">¥{{stockInfo.promotionPrice}}</text>
						<text class="stock">库存：{{stockInfo.stock}}件</text>
						<view class="selected">
							已选：
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
								{{sItem.value}}
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in specList" :key="index" class="attr-list">
					<text>{{item.name}}</text>
					<view class="item-list">
						<text 
							v-for="(childItem, childIndex) in specChildList" 
							v-if="childItem.pid === item.id"
							:key="childIndex" class="tit"
							:class="{selected: childItem.selected,dsdew:true}"
							@click="selectSpec(childIndex, childItem.pid)"
						>
							{{childItem.name}}
						</text>
					</view>
				</view>
				<!-- <view class="attr-list">
					<text>数量</text>
					<view class="item-list">
						<uni-number-box
							class="step"
							:min="1" 
							:max="stock"
							:value="number > stock ? stock:number"
							:isMax="number>=stock?true:false"
							:isMin="number==1"
							@eventChange="numberChange"
						></uni-number-box>
					</view>
				</view> -->
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
	   mapState ,mapMutations
    } from 'vuex';
	import utils from '@/utils/method.js'
	import uniNumberBox from '@/components/uni-number-box.vue'
	export default{
		components: {
			uniNumberBox
		},
		data() {
			return {
				exchangePoints:0,
				isScore:false,  //是否为积分兑换
				stockInfo:{},// 规格界面详情
				productId:"",  //商品id
				imgList: [],  //轮播图列表
				title:"",
				minPrice:0,  //促销价
				originalPrice:0,  //原价
				sale:0,  //销量
				stock:999999,  //库存
				views:0,  //浏览量
				giftPoint:0,  //购买商品奖励积分
				commentNum:0,  //评论数量
				commentList:null,  //默认评论
				desc: "",  //详情描述
				commentGoodType:null,  //展示的评论购买类型
				commentTime:"",  //评论时间
				specClass: 'none', //规格模态框样式
				specList: [],  //父规格
				specChildList: [],  //子规格
				specSelected:[],  //选中的商品规格，格式为[{’key’:’颜色’,’value’:’颜色’},{’key’:’容量’,’value’:’4G’}]
				number:1,  //购买数量
				picUrl:"",
				collectionFlag:false,
				cartNms:0,  //购物车中的数量
			};
		},
		async onLoad(options){
			if(options.id){
				this.productId = options.id
				this.initData()
			}
			if(options.score){
				this.isScore = options.score
			}
		},
		computed:{
			...mapState(['hasLogin'])
		},
		methods:{
			...mapMutations(['setAfterLoginUrl','setOrder']),
			getCartNms(){
				this.$http({
					apiName:"getCartNms"
				}).then(res => {
					this.cartNms = res.data
				}).catch(_ => {})
			},
			getPriceInfo(){
				let obj = {};
				this.specSelected.forEach((item,index) => {
					obj[item.key] = item.value
				})
				let data = {
					productId: this.productId,
					skuJson: JSON.stringify(obj)
				}
				this.$http({
					apiName: "getSkuStock",
					data:data,
					type:"post"
				}).then(res=>{
					this.stockInfo = res.data[0];
				})
			},
			moredComment(){
				uni.navigateTo({
					url:"/pages/product/comment?id=" + this.productId
				})
			},
			initData(){
				uni.showLoading()
				this.getDetail()
				this.getCartNms()
				uni.hideLoading()
			},
			//获取商品详情
			async getDetail(){
				await this.$http({
					apiName:"goodDetail",
					data:{productId:this.productId}
				}).then(res => {
					this.imgList = JSON.parse(res.data.product.albumPics)
					this.title = res.data.product.title
					this.minPrice = res.data.product.minPrice
					this.originalPrice = res.data.product.originalPrice
					this.sale = res.data.product.totalSale
					this.stock = res.data.product.totalStock
					this.views = res.data.product.views
					this.giftPoint = res.data.product.giftPoint
					this.desc = res.data.product.descriptionHtml.replace(/\<img/gi, '<img class="cont_img2" ');
					this.exchangePoints = res.data.product.exchangePoints
					this.collectionFlag = res.data.collectionFlag
					this.collectionId = res.data.collectionId
					//处理评论
					this.commentNum = res.data.totalComment || 0
					if(res.data.comment){
						this.comment = res.data.comment
						this.commentTime = utils.unixToDatetime(res.data.comment.createTime)
						if(this.commentNum > 0){
							this.commentGoodType = JSON.parse(this.comment.productAttribute.replace(/'/g,'"'))
						}
					}
					
					this.picUrl = res.data.product.picUrl
					this.setSpec(res.data.specificationList)
				}).catch(_ => {})
			},
			//根据返回信息设置规格展示
			setSpec(list){
				list.map(item => {
					this.specList.push({
						id:item.id,
						name:item.name
					})
					let _sublist = item.val.split('#')
					_sublist.map(subitem => {
						this.specChildList.push({
							pid:item.id,
							name:subitem
						})
					})
				})
				//设置规格默认选中第一个
				this.specList.forEach(item=>{
					for(let cItem of this.specChildList){
						if(cItem.pid === item.id){
							this.$set(cItem, 'selected', true);
							this.specSelected.push({
								key:item.name,
								value:cItem.name
							});
							break; //forEach不能使用break
						}
					}
				})
				this.getPriceInfo();
			},
			//规格弹窗开关
			toggleSpec() {
				if(this.specClass === 'show'){
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				}else if(this.specClass === 'none'){
					this.specClass = 'show';
				}
			},
			//选择规格
			selectSpec(index, pid){
				let list = this.specChildList;
				list.forEach(item=>{
					if(item.pid === pid){
						this.$set(item, 'selected', false);
					}
				})

				this.$set(list[index], 'selected', true);
				//存储已选择
				/**
				 * 修复选择规格存储错误
				 * 将这几行代码替换即可
				 * 选择的规格存放在specSelected中
				 */
				this.specSelected = []; 
				list.forEach(item=>{ 
					if(item.selected === true){ 
						this.specList.map(pitem => {
							if(pitem.id == item.pid){
								this.specSelected.push({
									key:pitem.name,
									value:item.name
								})
							}
						})
					} 
				})
				this.getPriceInfo();
			},
			//收藏
			async toFavorite(){
				let _api = 'saveGood'
				let _data = {productId:this.productId}
				if(this.collectionFlag){
					_api = "unSaveGood";
					_data = {id:this.collectionId}
				}
				if(this.hasLogin){
					uni.showLoading()
					await this.$http({
						apiName:_api,
						type:"POST",
						data:_data
					}).then(res => {
						if(!this.collectionFlag){
							this.collectionId = res.data
						}
						this.collectionFlag = !this.collectionFlag
					}).catch(_ => {})
					uni.hideLoading()
				}else{
					this.toLogin()
				}
			},
			//购买
			buy(){
				if(!this.hasLogin){
					this.setAfterLoginUrl(`/pages/product/product?id=${this.productId}`)
					uni.navigateTo({
						url:'/pages/public/login'
					}) 
				}else{
					this.setOrder({
						productId:this.productId,
						number:this.number,
						title:this.title,
						picUrl:this.picUrl,
						specSelected:this.specSelected,
						price:this.minPrice,
						exchangePoints:this.exchangePoints || 0
					})
					uni.navigateTo({
						url: `/pages/order/createOrder?score=${this.isScore}`
					})
				}
				
			},
			//加入购物车
			async addCart(){
				if(this.hasLogin){
					uni.showLoading()
					await this.$http({
						apiName:"addCart",
						type:"POST",
						data:{
							productId:this.productId,
							checked:1,
							num:this.number,
							specJson:JSON.stringify(this.specSelected)
						}
					}).then(res => {
						uni.showToast({
							title:"添加成功"
						})
						this.getCartNms()
					}).catch(_ => {})
					uni.hideLoading()
				}else{
					this.toLogin()
				}
			},
			//未登录跳转
			toLogin(){
				this.setAfterLoginUrl('/pages/product/product?id=' + this.productId)
				uni.navigateTo({
					url:'/pages/public/login'
				}) 
			},
			stopPrevent(){},
			//数量
			numberChange(data){
				this.number = data.number;
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
			
			if (index === 0) {
				// utils.getService({
				// 	pid:this.productId,
				// 	oid:""
				// })
				// uni.showToast({
				// 	icon:"none",
				// 	title:"客服系统努力开发中..."
				// })
				uni.navigateTo({
					url:"/pages/service/service"
				})
			}
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 160rpx;
	}
	.icon-you{
		font-size: $font-base + 2rpx;
		color: #888;
	}
	.carousel {
		height: 722rpx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750rpx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
	}
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20rpx 30rpx;
		margin-bottom: 20rpx;
		.title{
			font-size: 32rpx;
			color: $font-color-dark;
			height: 50rpx;
			line-height: 50rpx;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64rpx;
			padding: 10rpx 0;
			font-size: 26rpx;
			color:$uni-color-primary;
		}
		.price{
			font-size: $font-lg + 2rpx;
		}
		.m-price{
			margin:0 12rpx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4rpx 10rpx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6rpx;
			line-height: 1;
			transform: translateY(-4rpx); 
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 50rpx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
			}
		}
	}
	/* 分享 */
	.share-section{
		display:flex;
		align-items:center;
		color: $font-color-base;
		background: linear-gradient(to left, #fdf5f6, #fbebf6);
		padding: 12rpx 30rpx;
		.share-icon{
			display:flex;
			align-items:center;
			width: 70rpx;
			height: 30rpx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4rpx;
			position:relative;
			overflow: hidden;
			font-size: 22rpx;
			color: $uni-color-primary;
			&:after{
				content: '';
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
				left: -20rpx;
				top: -12rpx;
				position:absolute;
				background: $uni-color-primary;
			}
		}
		.icon-xingxing{
			position:relative;
			z-index: 1;
			font-size: 24rpx;
			margin-left: 2rpx;
			margin-right: 10rpx;
			color: #fff;
			line-height: 1;
		}
		.tit{
			font-size: $font-base;
			margin-left:10rpx;
		}
		.icon-bangzhu1{
			padding: 10rpx;
			font-size: 30rpx;
			line-height: 1;
		}
		.share-btn{
			flex: 1;
			text-align:right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}
		.icon-you{
			font-size: $font-sm;
			margin-left: 4rpx;
			color: $uni-color-primary;
		}
	}
	
	.c-list{
		font-size: $font-sm + 2rpx;
		color: $font-color-base;
		background: #fff;
		.c-row{
			display:flex;
			align-items:center;
			padding: 20rpx 30rpx;
			position:relative;
		}
		.tit{
			width: 140rpx;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10rpx;
			}
		}
		.bz-list{
			height: 40rpx;
			font-size: $font-sm+2rpx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30rpx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40rpx;
		}
		.red{
			color: $uni-color-primary;
		}
	}
	
	/* 评价 */
	.eva-section{
		display: flex;
		flex-direction: column;
		padding: 20rpx 30rpx;
		background: #fff;
		margin-top: 16rpx;
		.e-header{
			display: flex;
			align-items: center;
			height: 70rpx;
			font-size: $font-sm + 2rpx;
			color: $font-color-light;
			justify-content: space-between;
			.tit{
				font-size: $font-base + 2rpx;
				color: $font-color-dark;
				margin-right: 4rpx;
			}
			.tip{
				flex: 1;
				text-align: right;
			}
			.icon-you{
				margin-left: 10rpx;
			}
		}
	}
	.eva-box{
		display: flex;
		padding: 20rpx 0;
		.portrait{
			flex-shrink: 0;
			width: 80rpx;
			height: 80rpx;
			border-radius: 100px;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26rpx;
			.con{
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20rpx 0;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
			}
			.bot{
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color:$font-color-light;
				.attr-text{
					margin-right: 10rpx;
				}
			}
		}
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16rpx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80rpx;
			font-size: $font-base + 2rpx;
			color: $font-color-dark;
			position: relative;
				
			text{
				padding: 0 20rpx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300rpx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
		}
	}
	
	/* 规格选择弹窗 */
	.attr-content{
		padding: 10rpx 30rpx;
		.a-t{
			display: flex;
			image{
				width: 170rpx;
				height: 170rpx;
				flex-shrink: 0;
				margin-top: -40rpx;
				border-radius: 8rpx;;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24rpx;
				font-size: $font-sm + 2rpx;
				color: $font-color-base;
				line-height: 42rpx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10rpx;
				}
				.selected-text{
					margin-right: 10rpx;
				}
			}
		}
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2rpx;
			color: $font-color-base;
			padding-top: 30rpx;
			padding-left: 10rpx;
		}
		.item-list{
			padding: 20rpx 0 0;
			display: flex;
			flex-wrap: wrap;
			/deep/ .uni-numbox{
				position: unset;
				border-radius: 8rpx;
				border: 2rpx solid #F5F5F5;
				background: #fff;
				height: 60rpx;
				width: 240rpx;
				.uni-numbox-minus{
					background-color: #fff;
					line-height: 60rpx;
					font-size: 20rpx;
					border-right: 2rpx solid #F5F5F5;
					border-radius: 0;
				}
				.uni-numbox-value{
					background: transparent;
					line-height: 60rpx;
					width: 140rpx;
					height: 100%;
					font-size: 26rpx;
					color: #909399;
				}
				.uni-numbox-plus{
					background-color: #fff;
					line-height: 60rpx;
					font-size: 20rpx;
					border-left: 2rpx solid #F5F5F5;
					border-radius: 0;
				}
			}
			.dsdew{
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				border-radius: 100rpx;
				min-width: 60rpx;
				height: 60rpx;
				padding: 0 20rpx;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.selected{
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10rpx 10rpx 0 0;
			background-color: #fff;
			.btn{
				height: 66rpx;
				line-height: 66rpx;
				border-radius: 100rpx;
				background: $uni-color-primary;
				font-size: $font-base + 2rpx;
				color: #fff;
				margin: 60rpx auto 20rpx;
			}
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
		}
	}
	
	/* 底部操作菜单 */
	.page-bottom-score{
		background-color: #F23D3D!important;
		color: #fff;
		font-size: 36rpx;
	}
	.page-bottom{
		position:fixed;
		left: 30rpx;
		bottom:30rpx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690rpx;
		height: 100rpx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20rpx 0 rgba(0,0,0,.5);
		border-radius: 16rpx;
		
		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96rpx;
			height: 80rpx;
			.icon-fenxiang2{
				font-size: 42rpx;
				transform: translateY(-2rpx);
			}
			.icon-shoucang{
				font-size: 46rpx;
			}
		}
		.p-b-btn2{
			position: relative;
			.p-b-btn-bg{
				position: absolute;
				right: 0;
				top: 0;
				background-color: #F23D3D;
				color: #fff;
				font-size: 20rpx;
				display: inline-block;
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				text-align: center;
				line-height: 32rpx;
			}
		}
		.p-b-btn.active{
			color:#F23D3D;
		}
		.action-btn-group{
			display: flex;
			height: 76rpx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20rpx 40rpx -16rpx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
			margin-left: 20rpx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28rpx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 180rpx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	
</style>
