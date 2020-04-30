<template>
	<view class="container wxPage" :style="{paddingTop:paddingTop}">
		<!-- #ifdef MP-WEIXIN -->
		<wxTabbar></wxTabbar>
		<!-- #endif -->
		<!-- 空白页 -->
		<view v-if="cartList.length == 0" class="empty">
			<view class="emptybox">
				<image src="/static/emptyCart.png" mode="aspectFit"></image>
				<view v-if="hasLogin" class="empty-tips">
					购物车是空哒～
					<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛></navigator>
				</view>
				<view v-else class="empty-tips">
					购物车是空哒
					<view class="navigator" @click="navToLogin">去登录></view>
				</view>
			</view>
			<view class="guess-section">
				<view class="guess-section-top">
					<view class="guess-section-top1"></view>
					<view class="guess-section-top2">为你推荐</view>
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
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.id">
					<view
						class="cart-item" 
						:class="{'b-b': index!==cartList.length-1}"
					>
						<view class="cart-item-box">
							<view
								class="iconfont iconchenggong checkbox"
								:class="{checked: item.checkedFlag}"
								@click="check('item', index,item.id)"
							></view>
							<view class="image-wrapper" @tap="navToDetailPage(item.productId)">
								<image :src="item.picUrl"
									mode="aspectFill"
									class="loaded"
								></image>
							</view>
						</view>
						<view class="item-right">
							<text class="clamp title"  @tap="navToDetailPage(item.productId)">{{item.title}}</text>
							<text class="attr"  @tap="navToDetailPage(item.productId)">
								<text v-for="(aitem,akey,aindex) of item.specificationsMap" :key="aindex">{{akey}}:{{aitem}};</text>   
							</text>
							<view class="item-right-box">
								<uni-number-box
									class="step"
									:cartId="String(item.id)"
									:min="1" 
									:max="item.stock"
									:value="item.number>item.stock?item.stock:item.number"
									:isMax="item.number>=item.stock?true:false"
									:isMin="item.number===1"
									:index="index"
									@eventChange="numberChange"
								></uni-number-box>
								<text class="price nm-font">¥{{item.promotionPrice}}</text>
							</view>
						</view>
						<text class="del-btn iconfont iconclose-hei" @click="deleteCartItem(index,item.id)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="checkbox">
					<image 
						:src="allChecked?'/static/selected.png':'/static/select.png'" 
						mode="aspectFit"
						@click="check('all')"
					></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view>
				<view class="total-box">
					<text class="price nm-font">合计：¥{{total}}</text>
					<!-- <text class="coupon">
						已优惠
						<text class="nm-font">74.35</text>
						元
					</text> -->
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,mapMutations
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue'
	import utils from '@/utils/method.js'
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				cartList: [],
				topicsList:[]
			};
		},
		onLoad() {
			utils.setBadgeText(0,this.msgNms)
		},
		async onShow(){
			this.total = 0
			this.allChecked = false
			this.cartList = []
			this.topicsList = []
			if(this.hasLogin){
				await this.getCart()
				this.getCartNms()
			}else{
				await this.getTj()
			}
		},
		computed:{
			...mapState(['hasLogin','utils','msgNms','paddingTop'])
		},
		methods: {
			...mapMutations(['setAfterLoginUrl','setAfterLoginIsTab']),
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
			navToDetailPage(id){
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			//获取购物车列表
			async getCart(){
				await this.$http({
					apiName:"getCartList"
				}).then(res => {
					if(res.data.length > 0){
						this.loadData(res.data)
					}else{
						this.getTj()
					}
				}).catch(_ => {})
			},
			//处理数据
			loadData(list){
				let cartList = list.map(item => {
					return item;
				});
				this.cartList = cartList;
				console.log(this.cartList);
				this.calcTotal();  //计算总价
			},
			//获取推荐商品
			async getTj(){
				await this.$http({
					apiName:"getMoreModule",
					data:{
						type:4,
						page:1,
						size:20
					}
				}).then(res => {
					this.topicsList = res.data.list
				}).catch(_ => {})
			},
			navToLogin(){
				this.setAfterLoginUrl('/pages/cart/cart')
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
			 //选中状态处理
			check(type, index,cartId){
				if(type === 'item'){
					this.cartList[index].checkedFlag = !this.cartList[index].checkedFlag;
					this.checkOne(cartId,this.cartList[index].checkedFlag)
				}else{
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item=>{
						item.checkedFlag = checked;
					})
					this.allChecked = checked;
					this.checkAll()
				}
				this.calcTotal();
			},
			//单选单不选
			async checkOne(cartId,checked){
				uni.showLoading()
				await this.$http({
					apiName:"checkCartGood",
					type:"POST",
					data:{
						cartId:cartId,
						checked:checked ? 1 : 0
					}
				}).then(res => {}).catch(_ => {})
				uni.hideLoading();
			},
			//全选
			async checkAll(){
				uni.showLoading()
				await this.$http({
					apiName:"checkCartAll",
					type:"POST",
				}).then(res => {}).catch(_ => {})
				uni.hideLoading();
			},
			//数量
			numberChange(data){
				this.cartList[data.index].number = data.number;
				this.calcTotal();
				this.$http({
					apiName:"changeCartGoodNm",
					type:"POST",
					data:{
						cartId:data.cartId,
						num:data.number
					}
				}).then(res => {}).catch(_ => {})
			},
			//删除
			async deleteCartItem(index,cartId){
				uni.showLoading()
				let list = this.cartList;
				let row = list[index];
				let id = row.id;
				this.cartList.splice(index, 1);
				this.calcTotal();
				await this.$http({
					apiName:"deleteCartGood",
					type:"POST",
					data:{cartId:cartId}
				}).then( _ => {
					this.getCartNms()
					if(this.cartList.length == 0){
						this.getTj()
					}
				}).catch( _ => {})
				uni.hideLoading();
			},
			//清空
			clearCart(){
				uni.showModal({
					content: '清空购物车？',
					success: (e)=>{
						if(e.confirm){
							this.cartList = [];
							this.rmCart()
						}
					}
				})
			},
			//清空http
			async rmCart(){
				uni.showLoading()
				await this.$http({
					apiName:"clearCart",
					type:"POST"
				}).then( _ => {}).catch( _ => {})
				uni.hideLoading();
			},
			//计算总价
			calcTotal(){
				let list = this.cartList;
				if(list.length === 0){
					return;
				}
				let total = 0;
				// let checked = true;
				list.forEach(item=>{
					if(item.checkedFlag == true){
						total += item.promotionPrice * item.number;
					}
				})
				this.total = Number(total.toFixed(2));
			},
			//创建订单
			createOrder(){
				let _checkNm = 0
				this.cartList.map(item => {
					if(item.checkedFlag){
						_checkNm ++ 
					}
				})
				if(_checkNm === 0){
					uni.showToast({
						title:"请勾选商品",
						icon:"none"
					})
					return
				}
				uni.navigateTo({
					url: `/pages/order/createOrder?cart=1`
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

<style lang='scss' scoped>
	.container{
		min-height: calc(100vh - 100rpx);
		box-sizing: border-box;
		.empty{
			/* padding-bottom: 40rpx; */
			.emptybox{
				background-color: #F9FAFB;
				width: 100%;
				/* height: 610rpx; */
				padding-top: 180rpx;
				text-align: center;
				padding-bottom: 200rpx;
			}
			image{
				width: 240rpx;
				height: 160rpx;
				margin-bottom:30rpx;
			}
			.empty-tips{
				justify-content: center;
				display:flex;
				font-size: $font-sm+2rpx;
				color: $font-color-disabled;
				.navigator{
					color: $uni-color-primary;
					margin-left: 16rpx;
				}
			}
		}
		.guess-section{
			width: 100%;
			box-sizing: border-box;
			margin-top: 20rpx;
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
	}
	/* 购物车列表项 */
	.cart-item{
		background-color: #fff;
		display:flex;
		padding:30rpx 40rpx;
		position: relative;
		.cart-item-box{
			display: flex;
			align-items: center;
		}
		.image-wrapper{
			width: 230rpx;
			height: 230rpx;
			flex-shrink: 0;
			position:relative;
			image{
				border-radius:8rpx;
			}
		}
		.checkbox{
			font-size: 44rpx;
			line-height: 1;
			padding: 4rpx;
			color: $font-color-disabled;
			background:#fff;
			border-radius: 50px;
			margin-right: 10rpx;
		}
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 30rpx;
			.item-right-box{
				display: flex;
				width: 100%;
				justify-content: space-between;
				align-items: center;
				position: absolute;
				bottom: 0;
				left: 0;
				padding-left: 30rpx;
				/deep/ .uni-numbox{
					position: unset;
					border-radius: 8rpx;
					border: 2rpx solid #F5F5F5;
					background: #fff;
					height: 44rpx;
					width: 144rpx;
					.uni-numbox-minus{
						background-color: #fff;
						line-height: 44rpx;
						font-size: 20rpx;
						border-right: 2rpx solid #F5F5F5;
					}
					.uni-numbox-value{
						background: transparent;
						line-height: 44rpx;
						width: 70rpx;
						height: 100%;
						font-size: 26rpx;
						color: #909399;
					}
					.uni-numbox-plus{
						background-color: #fff;
						line-height: 44rpx;
						font-size: 20rpx;
						border-left: 2rpx solid #F5F5F5;
					}
				}
			}
			.title,.price{
				font-size:$font-base + 2rpx;
				color: $font-color-dark;
				height: 40rpx;
				line-height: 40rpx;
			}
			.title{
				padding-right: 60rpx;
			}
			.price{
				font-size: 32rpx;
				color: #F23D3D;
			}
			.attr{
				font-size: $font-sm + 2rpx;
				color: $font-color-light;
				height: 50rpx;
				line-height: 50rpx;
			}
			.price{
				height: 50rpx;
				line-height:50rpx;
			}
		}
		.del-btn{
			position: absolute;
			right: 40rpx;
			top: 30rpx;
			padding:4rpx 10rpx;
			font-size:34rpx; 
			height: 50rpx;
			color: $font-color-light;
		}
	}
	/* 底部栏 */
	.action-section{
		/* #ifdef H5 */
		margin-bottom:100rpx;
		/* #endif */
		position:fixed;
		left: 30rpx;
		bottom:30rpx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690rpx;
		height: 100rpx;
		padding: 0 30rpx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20rpx 0 rgba(0,0,0,.5);
		border-radius: 16rpx;
		.checkbox{
			height:52rpx;
			position:relative;
			image{
				width: 52rpx;
				height: 100%;
				position:relative;
				z-index: 5;
			}
		}
		.clear-btn{
			position:absolute;
			left: 26rpx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52rpx;
			line-height: 52rpx;
			padding-left: 38rpx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius:0 50px 50px 0;
			opacity: 0;
			transition: .2s;
			&.show{
				opacity: 1;
				width: 120rpx;
			}
		}
		.total-box{
			flex: 1;
			display:flex;
			flex-direction: column;
			text-align:right;
			padding-right: 40rpx;
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
			}
			.coupon{
				font-size: $font-sm;
				color: $font-color-light;
				text{
					color: $font-color-dark;
				}
			}
		}
		.confirm-btn{
			padding: 0 38rpx;
			margin: 0;
			border-radius: 100px;
			height: 76rpx;
			line-height: 76rpx;
			font-size: $font-base + 2rpx;
			background:#f23d3d;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked{
		color: #f23d3d;
	}
</style>
