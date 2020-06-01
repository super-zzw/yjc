<template>
	<view>
		<!-- 地址 -->
		<view @tap="fetchAddr"  class="address-section">
			<view class="order-content order-content2" v-if="!selectAddr">
				<text class="iconfont icondizhi"></text>
				<view class="cen">
					<view class="top">
						<text class="name">{{addrText}}</text>
						<text class="mobile"></text>
					</view>
					<text class="address"></text>
				</view>
				<text class="iconfont iconright"></text>
			</view>
			<view class="order-content" v-else>
				<text class="iconfont icondizhi"></text>
				<view class="cen">
					<view class="top">
						<text class="name">{{selectAddr.name}}</text>
						<text class="mobile">{{selectAddr.phoneNumber}}</text>
					</view>
					<text class="address">{{selectAddr.province}}{{selectAddr.city}}{{selectAddr.region}}{{selectAddr.detailAddress}}</text>
				</view>
				<text class="iconfont iconright"></text>
			</view>

			<image class="a-bg" src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/orderLine.png"></image>
		</view>
		
		<view class="goods-section" v-if="cart == 1">
			<view class="g-item" v-for="(item,index) in orderList" :key="index" v-if="item.checkedFlag">
				<image :src="item.picUrl"></image>
				<view class="right">
					<text class="title clamp">{{item.title}}</text>
					<text class="spec">
						<text class="spec-text" v-for="(aitem,akey,aindex) in item.specificationsMap" :key="aindex">{{akey}}:{{aitem}};</text>
					</text>
					<view class="price-box">
						<text class="price nm-font">￥{{item.minPrice || item.promotionPrice}}</text>
						<text class="number">x {{item.number}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="goods-section" v-else>
			<!-- 商品列表 -->
			
			<view class="g-item">
				<image :src="order.picUrl"></image>
				<view class="right">
					<text class="title clamp">{{order.title}}</text>
					<text class="spec">
						<text class="spec-text" v-for="(item,index) in order.specSelected" :key="index">{{item.value}}</text>
					</text>
					<view class="price-box" v-if="!isScore">
						<text class="price">￥{{order.price}}</text>
						<text class="number">x {{order.number}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b" v-if="isScore">
				<text class="cell-tit clamp">消耗{{config.MALL_POINT_TITLE}}</text>
				<text class="cell-tip">{{totalScore}}</text>
			</view>
			<view class="yt-list-cell b-b" v-else>
				<text class="cell-tit clamp">商品金额</text>
				<text class="cell-tip">￥{{total}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip" v-if="isScore">{{config.MALL_POINT_TITLE}}兑换免运费</text>
				<text class="cell-tip" v-else>{{fee}}</text>
			</view>
			<view class="yt-list-cell desc-cell b-b">
				<text class="cell-tit clamp">备注</text>
				<input class="desc" type="text" v-model="desc" placeholder="请填写备注信息" placeholder-class="placeholder" />
			</view>
			<view class="yt-list-cell desc-cell" v-if="order.productType == 3">
				<text class="cell-tit clamp">提示：</text>
				<input class="desc" type="text" value="虚拟商品付款后请联系客服获取相关信息" disabled/>
			</view>
		</view>
		
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content" v-if="isScore">
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">0.00</text>
			</view>
			<view class="price-content" v-else>
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">{{total2}}</text>
			</view>
			<text class="submit" @click="scoreEx" v-if="isScore">立即兑换</text>
			<text class="submit" @click="submit2" v-else-if="cart == 1">提交订单</text>
			<text class="submit" @click="submit" v-else>提交订单</text>
		</view>

	</view>
</template>

<script>
	import {
	   mapState,
	   mapMutations
    } from 'vuex';
	export default {
		data() {
			return {
				total:0,
				totalScore:0,
				desc: '', //备注
				isScore:"",
				fee:"0",
				cart:"",
				orderList:[],
				addrText:"地址加载中...",  //
				total2:"加载中..."
			}
		},
		async onLoad(opt){
			this.cart = opt.cart;
			if(opt.score == 'true'){
				this.isScore = true
			}
			if(!this.selectAddr){
				// await this.getAddr()
				this.total2 = "请选择地址"
			}
			// if(opt.cart == 1){
			// 	this.cart = opt.cart
			// 	await this.getCart()
			// 	await this.getCartYf()
			// }else{
			// 	this.total = Number(this.order.price * this.order.number).toFixed(2)
			// 	console.log(this.order)
			// 	await this.getYf()
			// 	if(opt.score == 'true'){
			// 		this.isScore = true
			// 		this.totalScore = this.order.exchangePoints
			// 	}
			// }
		},
		onUnload() {
			this.$store.commit('setOrder',[])
			// this.setOrder([])
		},
		async onShow(){
			this.total = 0;
			if(!this.selectAddr){
				await this.getAddr()
			}
			if(this.cart == 1){
				await this.getCart()
				await this.getCartYf()
			}else{
				this.total = Number(this.order.price * this.order.number).toFixed(2)
				if(this.isScore == true){
					this.totalScore = this.order.exchangePoints
				}else{
					await this.getYf()
				}
			}
		},
		computed:{
			...mapState(['order','selectAddr','config','setOrder'])
		},
		methods: {
			...mapMutations(['setSelectAddr']),
			fetchAddr(){
				if(this.cart == 1){
					uni.navigateTo({
						url:`/pages/address/address?score=${this.isScore}&source=3`
					})
				}else{
					uni.navigateTo({
						url:`/pages/address/address?score=${this.isScore}&source=1`
					})
				}
			},
			async getCart(){
				let that = this
				await this.$http({
					apiName:"getCartList"
				}).then(res => {
					this.orderList = res.data
					this.orderList.map(item => {
						if(item.checkedFlag){
							that.total = that.total + Number((Number(Number(item.promotionPrice * item.number).toFixed(2))).toFixed(2))
							// that.total = (that.total + Number(Number(item.promotionPrice * item.number).toFixed(2)))
							// console.log(that.total)
						}
					})
				}).catch(_ => {})
			},
			async submit(){
				if(!this.selectAddr){
					uni.showToast({
						title:"请先选择地址",
						mask:true,
						icon:"none"
					})
					return
				}
				var that = this;
				var _skuJson = {};
				this.order.specSelected.map(item => {
					_skuJson[item.key] = item.value
				})
				await this.$http({
					apiName:"createOrder",
					type:"POST",
					data:{
						addressId:this.selectAddr.id,
						num:this.order.number,
						productId:this.order.productId,
						// #ifdef APP-PLUS
						sourceType:'1',
						// #endif
						// #ifdef H5
						sourceType:'2',
						// #endif
						// #ifdef MP-WEIXIN
						sourceType:'3',
						// #endif
						skuJson:JSON.stringify(_skuJson),
						remark:this.desc
					}
				}).then(res => {
					if(that.isScore){
						uni.redirectTo({
							url:"/pages/money/paySuccess?isDh=1"
						})
					}else{
						uni.redirectTo({
							url: `/pages/money/pay?money=${this.total2}&orderid=${res.data}`
						})
					}
				}).catch(_ => {})
				
			},
			async submit2(){
				if(!this.selectAddr){
					uni.showToast({
						title:"请先选择地址",
						mask:true,
						icon:"none"
					})
					return
				}
				var that = this
				await this.$http({
					apiName:"createCartOrder",
					type:"POST",
					data:{
						addressId:this.selectAddr.id,
						sourceType:'1',
					}
				}).then(res => {
					uni.redirectTo({
						url: `/pages/money/pay?money=${this.total2}&orderid=${res.data.order.id}`
					})
				}).catch(_ => {})
				
			},
			scoreEx(){
				var that = this
				uni.showModal({
				    title: '提示',
				    content: '确定兑换' + this.config.MALL_POINT_TITLE + '兑换该商品？',
				    success: function (res) {
				        if (res.confirm) {
				           that.submit()
				        }
				    }
				});
			},
			//获取默认地址
			async getAddr(){
				await this.$http({
					apiName:"addrList",
					data:{
						page:1,
						size:1
					}
				}).then(res => {
					this.setSelectAddr(res.data.list[0])
					if(res.data.list.length == 0){
						this.addrText = "暂无可用地址请点击添加"
					}
				}).catch(_ => {})
			},
			async getYf(){
				if(this.selectAddr){
					await this.$http({
						apiName:"getYunfei",
						type:"POST",
						data:{
							productId:this.order.productId,
							province:this.selectAddr.province
						}
					}).then(res => {
						this.fee = res.data.fee
						this.total2 = (Number(this.total) + Number(this.fee)).toFixed(2)
					}).catch(_ =>{})
				}
			},
			async getCartYf(){
				if(this.selectAddr){
					await this.$http({
						apiName:"cartYunfei",
						type:"POST",
						data:{
							province:this.selectAddr.province
						}
					}).then(res => {
						this.fee = res.data
						this.total2 = (Number(this.total) + Number(this.fee)).toFixed(2)
					}).catch(_ =>{})
				}
			},
			stopPrevent(){}
		},
		onBackPress(e){
			if(this.cart == 1){
				uni.switchTab({
				// uni.reLaunch({
					url:'/pages/cart/cart'
				})
				return true
			}
			// else if(this.isScore){
			// 	uni.redirectTo({
			// 		url:"/pages/product/product?id=" + this.order.productId + "&score=true"
			// 	})
			// 	return true
			// }else{
			// 	uni.redirectTo({
			// 		url:"/pages/product/product?id=" + this.order.productId
			// 	})
			// 	return true
			// }
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100rpx;
	}

	.address-section {
		padding: 30rpx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icondizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90rpx;
			color: #888;
			font-size: 44rpx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28rpx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34rpx;
			margin-right: 24rpx;
		}

		.address {
			margin-top: 16rpx;
			margin-right: 20rpx;
			color: $font-color-light;
		}

		.iconright {
			font-size: 32rpx;
			color: $font-color-light;
			margin-right: 30rpx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5rpx;
		}
	}

	.goods-section {
		margin-top: 16rpx;
		background: #fff;
		padding-bottom: 1px;

		.g-header {
			display: flex;
			align-items: center;
			height: 84rpx;
			padding: 0 30rpx;
			position: relative;
		}

		.logo {
			display: block;
			width: 50rpx;
			height: 50rpx;
			border-radius: 100px;
		}

		.name {
			font-size: 30rpx;
			color: $font-color-base;
			margin-left: 24rpx;
		}

		.g-item {
			padding-top: 20rpx;
			display: flex;
			margin: 20rpx 30rpx;

			image {
				flex-shrink: 0;
				display: block;
				width: 140rpx;
				height: 140rpx;
				border-radius: 4rpx;
			}

			.right {
				flex: 1;
				padding-left: 24rpx;
				overflow: hidden;
			}

			.title {
				font-size: 30rpx;
				color: $font-color-dark;
			}

			.spec {
				font-size: 26rpx;
				color: $font-color-light;
				.spec-text{
					margin-right: 10rpx;
				}
			}

			.price-box {
				display: flex;
				align-items: center;
				font-size: 32rpx;
				color: $font-color-dark;
				padding-top: 10rpx;

				.price {
					margin-bottom: 4rpx;
				}
				.number{
					font-size: 26rpx;
					color: $font-color-base;
					margin-left: 20rpx;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}
	.yt-list {
		margin-top: 16rpx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10rpx 30rpx 10rpx 40rpx;
		line-height: 70rpx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30rpx;
		}

		.cell-icon {
			height: 32rpx;
			width: 32rpx;
			font-size: 22rpx;
			color: #fff;
			text-align: center;
			line-height: 32rpx;
			background: #f85e52;
			border-radius: 4rpx;
			margin-right: 12rpx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24rpx;
			color: $font-color-light;
			margin-left: 8rpx;
			margin-right: -10rpx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26rpx;
			color: $font-color-light;
			margin-right: 10rpx;
		}

		.cell-tip {
			font-size: 26rpx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}
			&.red{
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90rpx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}
	
	/* 支付列表 */
	.pay-list{
		padding-left: 40rpx;
		margin-top: 16rpx;
		background: #fff;
		.pay-item{
			display: flex;
			align-items: center;
			padding-right: 20rpx;
			line-height: 1;
			height: 110rpx;	
			position: relative;
		}
		.icon-weixinzhifu{
			width: 80rpx;
			font-size: 40rpx;
			color: #6BCC03;
		}
		.icon-alipay{
			width: 80rpx;
			font-size: 40rpx;
			color: #06B4FD;
		}
		.iconchenggong{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60rpx;
			height: 60rpx;
			font-size: 40rpx;
			color: $base-color;
		}
		.tit{
			font-size: 32rpx;
			color: $font-color-dark;
			flex: 1;
		}
	}
	
	.footer{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90rpx;
		justify-content: space-between;
		font-size: 30rpx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0,0,0,.1);
		.price-content{
			padding-left: 30rpx;
		}
		.price-tip{
			color: $base-color;
			margin-left: 8rpx;
		}
		.price{
			font-size: 36rpx;
			color: $base-color;
		}
		.submit{
			display:flex;
			align-items:center;
			justify-content: center;
			width: 280rpx;
			height: 100%;
			color: #fff;
			font-size: 32rpx;
			background-color: $base-color;
		}
	}
	
	/* 优惠券面板 */
	.mask{
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 9995;
		transition: .3s;
		
		.mask-content{
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y:scroll;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			
			.mask-content{
				transform: translateY(0);
			}
		}
	}

	/* 优惠券列表 */
	.coupon-item{
		display: flex;
		flex-direction: column;
		margin: 20rpx 24rpx;
		background: #fff;
		.con{
			display: flex;
			align-items: center;
			position: relative;
			height: 120rpx;
			padding: 0 30rpx;
			&:after{
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}
		.left{
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100rpx;
		}
		.title{
			font-size: 32rpx;
			color: $font-color-dark;
			margin-bottom: 10rpx;
		}
		.time{
			font-size: 24rpx;
			color: $font-color-light;
		}
		.right{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26rpx;
			color: $font-color-base;
			height: 100rpx;
		}
		.price{
			font-size: 44rpx;
			color: $base-color;
			&:before{
				content: '￥';
				font-size: 34rpx;
			}
		}
		.tips{
			font-size: 24rpx;
			color: $font-color-light;
			line-height: 60rpx;
			padding-left: 30rpx;
		}
		.circle{
			position: absolute;
			left: -6rpx;
			bottom: -10rpx;
			z-index: 10;
			width: 20rpx;
			height: 20rpx;
			background: #f3f3f3;
			border-radius: 100px;
			&.r{
				left: auto;
				right: -6rpx;
			}
		}
	}

</style>
