<template>
	<view class="content">
		<!-- #ifdef MP-WEIXIN -->
		<view class="mtb_center">
			<input class="minput" confirm-type="search" @confirm="bindinput" type="text" placeholder="请输入商品名称" placeholder-class/>
			<text class="iconfont iconsearch"></text>
		</view>
		<!-- #endif -->
		
		<view class="contentBox" v-if="(searchVal || categoryId != '') && goodsList.length > 0">
			<view class="navbar" :style="{position:headerPosition,top:headerTop}">
				<view class="nav-item" :class="{current: sort === 0}" @click="tabClick(0)">
					综合排序
				</view>
				<view class="nav-item" :class="{current: sort === 1 || sort === 2}" @click="tabClick([1,2])">
					<text>时间</text>
					<view class="p-box">
						<text :class="{active: sort === 1}" class="iconfont iconshang2"></text>
						<text :class="{active: sort === 2}" class="iconfont iconshang2 xia"></text>
					</view>
				</view>
				<view class="nav-item" :class="{current: sort === 3 || sort === 4}" @click="tabClick([3,4])">
					<text>销量</text>
					<view class="p-box">
						<text :class="{active: sort === 3}" class="iconfont iconshang2"></text>
						<text :class="{active: sort === 4}" class="iconfont iconshang2 xia"></text>
					</view>
				</view>
				<view class="nav-item" :class="{current: sort === 5 || sort === 6}" @click="tabClick([5,6])">
					<text>价格</text>
					<view class="p-box">
						<text :class="{active: sort === 5}" class="iconfont iconshang2"></text>
						<text :class="{active: sort === 6}" class="iconfont iconshang2 xia"></text>
					</view>
				</view>
			</view>
			<view class="goods-list">
				<view 
					v-for="(item, index) in goodsList" :key="index"
					class="goods-item"
					@click="navToDetailPage(item.id)"
				>
					<view class="image-wrapper">
						<image :src="item.picUrl" mode="aspectFill"></image>
					</view>
					<text class="title clamp">{{item.title}}</text>
					<view class="price-box">
						<text class="price">{{item.minPrice}}</text>
						<text>已售 {{item.totalSale}}</text>
					</view>
				</view>
				<view v-if="goodsList.length > 0 && noMore" class="no_more">
					<text class="no_more_side"></text>
					<text class="no_more_text">没有更多数据了</text>
					<text class="no_more_side"></text>
				</view>
			</view>
		</view>
		<view class="re-wrap" v-if="!searchVal && !categoryId">
			<view class="re-his" v-if="history.length > 0">
				<view class="re-histop">
					<view class="re-his-text">历史记录</view>
					<image @tap="clearHis" src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/laji.png" mode="widthFix" class="re-his-img"></image>
				</view>
				<view class="re-his-list">
					<text class="rehl-item" v-for="item in history" :key="item" @tap="kewSearch(item)">{{item}}</text>
				</view>
			</view>
			<view class="re-his" v-if="keyWords.length > 0">
				<view class="re-histop">
					<view class="re-his-text">热门搜索</view>
				</view>
				<view class="re-his-list">
					<text class="rehl-item" v-for="(item,index) in keyWords" :key="index" @tap="kewSearch(item)">{{item}}</text>
				</view>
			</view>
		</view>
		<view class="empty"  v-if="(searchVal || categoryId) && goodsList.length == 0 && isShow">
			<image src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/empty.png" mode="widthFix" class="empty-img"></image>
			<view class="empty-text">暂无此类商品，换个关键词试试</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				salesOrder:0,  //1销量从低到高 2销量从高到低
				timeOrder:0,  //1时间上架最晚 2时间上架最早
				searchVal:"",  //搜索词
				page:1,
				size:8,
				sort:0,  //0=按相关度；1=按时间从近到远  2=按时间从远到近；3=按销量高到低 4=按销量高到低；5=价格从低到高；6=价格从高到低
				dataLoading:false,  //是否是在加载数据
				noMore:false,
				goodsList: [],
				headerPosition:"fixed",
				headerTop:"0px",
				keyWords:[],  //热门关键字
				history:[],  //历史记录
				categoryId:"",
				isShow: false
			};
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			if(e.scrollTop>=0){
				this.headerPosition = "fixed";
			}else{
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		async onPullDownRefresh(){
			this.isShow = false;
			this.goodsList = [];
			this.page = 1;
			this.sort = 0;
			await this.judgeSearch()
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
			this.judgeSearch()
		},
		//点击键盘搜索
		onNavigationBarSearchInputConfirmed(e){
			if(!e.text.trim()){
				uni.showToast({
					title:"请输入商品名称",
					icon:"none"
				})
				return
			}
			uni.hideKeyboard();
			this.goodsList = []
			this.searchVal = e.text
			this.search()
			let _index = this.history.indexOf(this.searchVal)
			if(_index >= 0){
				this.history.splice(_index,1)
			}else{
				if(this.history.length >= 20){
					this.history.pop()
				}
			}
			
			this.history.push(this.searchVal)
			uni.setStorageSync("yzhsearch_words",this.history)
		},
		onLoad(opt){
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px';
			// #endif
			this.history = uni.getStorageSync("yzhsearch_words") || []
			if(opt.categoryid){
				this.categoryId = opt.categoryid
				this.getCateList()
			}else{
				this.initData()
			}
		},
		methods: {
			bindinput(e){
				if(!e.detail.value.trim()){
					uni.showToast({
						title:"请输入商品名称",
						icon:"none"
					})
					return
				}
				this.goodsList = []
				this.searchVal = e.detail.value
				this.search()
				let _index = this.history.indexOf(this.searchVal)
				if(_index >= 0){
					this.history.splice(_index,1)
				}else{
					if(this.history.length >= 20){
						this.history.pop()
					}
				}
				
				this.history.push(this.searchVal)
				uni.setStorageSync("yzhsearch_words",this.history)
			},
			navToDetailPage(id){
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			initData(){
				uni.showLoading({ title: '加载中' });
				this.getKeyWords()
				uni.hideLoading()
			},
			//根据分类id查询列表
			async getCateList(){
				await this.$http({
					apiName:"getCateList2",
					data:{
						categoryId:this.categoryId,
						page:this.page,
						size:this.size,
						sort:this.sort
					}
				}).then(res => {
					this.noMore = res.data.last;
					this.goodsList = this.goodsList.concat(res.data.content);
					this.isShow = true;
				}).catch(_ => {})
			},
			async search(){
				uni.showLoading({
					title:"搜索中...",
					mask:true
				})
				this.categoryId = ""
				await this.$http({
					apiName:"search",
					data:{
						keyword:this.searchVal,
						page:this.page,
						size:this.size,
						sort:this.sort
					},
					type:"POST"
				}).then(res => {
					this.noMore = res.data.last
					this.goodsList = this.goodsList.concat(res.data.content);
					this.isShow = true;
				}).catch(_ => {})
				uni.hideLoading()
			},
			//点击关键字搜索
			kewSearch(word){
				this.searchVal = word
				//将搜索关键字赋值到搜索框，只有app有效
				// #ifdef APP-PLUS
				let webView = this.$mp.page.$getAppWebview();
				webView.setTitleNViewSearchInputText(this.searchVal);
				// #endif
				this.goodsList = [];
				this.page = 1;
				this.sort = 0;
				this.search()
			},
			//获取热门搜索关键字
			async getKeyWords(){
				await this.$http({
					apiName:"keyWords",
					type:"POST"
				}).then(res => {
					res.data.map(item => {
						this.keyWords.push(item.keyword)
					})
				}).catch(_ => {})
			},
			//筛选点击
			tabClick(sortBy){
				if(sortBy === 0){
					//点击综合排序
					if(this.sort === 0){
						return
					}else{
						this.sort = 0
					}
				}else{
					let _index = sortBy.indexOf(this.sort)
					if(_index < 0){
						this.sort = sortBy[0]
					}else{
						this.sort = _index == 0 ? sortBy[1] : sortBy[0]
					}
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.goodsList = [];
				this.page = 1;
				this.judgeSearch()
			},
			clearHis(){
				this.history = []
				uni.removeStorageSync('yzhsearch_words');
			},
			//判断分类搜索还是关键字搜索
			judgeSearch(){
				if(this.searchVal){
					this.search()
				}else{
					this.getCateList()
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.mtb_center{
		position: relative;
		flex: 1;
		height: 96rpx;
		background-color: #fff;
		padding-left: 32rpx;
		padding-right: 32rpx;
		box-sizing: border-box;
		.minput{
			background-color: #f2f2f4;
			border-radius: 12rpx;
			height: 80rpx;
			padding-left: 60rpx;
			padding-right: 20rpx;
			box-sizing: border-box;
		}
		.input-placeholde{
			color: #f2f2f4;
			font-size: 40rpx;
		}
		.iconfont{
			position: absolute;
			left: 40rpx;
			top: 10rpx;
			font-size: 50rpx;
			
		}
	}
	page, .content,.contentBox{
		background: #f8f8f8;
		min-height: 100vh;
	}
	.iconshang2{
		height: 26rpx;
	}
	.content{
		padding-top: 96rpx;
		/* #ifdef MP-WEIXIN */
		padding-top:0;
		/* #endif */
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
		/* #ifdef MP-WEIXIN */
		margin-top: 0;
		/* #endif */
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
			.iconfont{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30rpx;
				height: 14rpx;
				line-height: 1;
				margin-left: 4rpx;
				font-size: 26rpx;
				color: #888;
				&.active{
					color: $base-color;
				}
			}
			.xia{
				transform: scaleY(-1);
				margin-left: 5rpx;
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
		// background: #F9FAFB;
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
