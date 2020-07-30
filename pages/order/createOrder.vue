<template>
	<view>
		<!-- 地址 -->
		<view @tap="fetchAddr" class="address-section">
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
				<input class="desc" type="text" v-model="desc" placeholder="请填写备注信息" placeholder-class="placeholder1" />
			</view>
			<view class="yt-list-cell desc-cell" v-if="order.productType == 3">
				<text class="cell-tit clamp">提示：</text>
				<input class="desc" type="text" value="虚拟商品付款后请联系客服获取相关信息" disabled />
			</view>
		</view>

		<!-- 优惠 -->
		<view class="yt-list">

			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠券</text>
				<view class="cell-tip" @tap="yhqSel">
					<text class="cell-right" v-if="yhq">优惠¥{{yhq}}</text>
					<text class="iconfont iconright"></text>

				</view>

			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">储值余额抵扣</text>
				<view class="flex align-items">
					<text class="cell-tip" v-if="checked">储值余额抵扣¥{{storeValue}}</text>
					<image src="../../static/off.png" mode="" class="switch" @tap="switchChecked" v-if="!checked"></image>
					<image src="../../static/on.png" mode="" class="switch" @tap="switchChecked" v-else></image>
				</view>
				
				<!-- <text class="cell-tip" v-else>{{fee}}</text> -->
			</view>
			<view class="yt-list-cell desc-cell b-b">
				<text class="cell-tit clamp">剩余待支付</text>
				<text class="cell-right">¥{{total2}}</text>
				<!-- <input class="desc" type="text" v-model="desc" placeholder="请填写备注信息" placeholder-class="placeholder" /> -->
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

		<!-- 弹出验证框 -->
		<view class="masks" v-if="sMask"></view>
		<view class="validateBox" :class="sModal?'active':''">
			<text class="iconfont iconclose-hei" @tap="closePass"></text>
			<text class="txt1">支付密码验证</text>
			<view class="input_area">
				<passwordInput :numLng='password' @open="openKeyboard" />
				<!-- <input class="box" disabled v-for="(item,index) in 6" :key="index" ></input> -->
				<!-- <input type="password" value="" class="box" maxlength="1" v-for="(item,index) in 6" :key="index" @input="input(index)" :focus="currentIpt==index?true:false"
				:disabled="currentIpt>=index?false:true"/> -->
			</view>
			<text class="txt2">请输入6位数字支付密码</text>
			<numberKeyboard psdLength='6' ref='KeyboarHid' @input='clickInput' />
		</view>

		<!-- 选择优惠券 -->
		<view class="yhqSel" :class="sModal1?'active':''">
			<text class="titles">选择优惠券</text>
			<text class="cancel" @tap="sModal1=false,sMask=false">取消</text>
			<view class="card-item" v-for="(item,index) in couponsList" :key="index" @tap="selCoupon(item)">
				<view class="fengmian">
					<view class="content">
						￥<text>{{item.amount}}</text>
					</view>
				</view>
				<view class="main">
					<text class="title">{{item.title}}</text>
				
					<text class="date">{{item.startTime|date}} 至 {{item.endTime|date}} 有效</text>
				</view>
				<view class="circle" v-if="item.useFlag">
					<text></text>
				</view>
                <image src="../../static/nouse.png" mode="" class="nouse" v-if="!item.useFlag"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import passwordInput from '../../components/password-input/password-input.vue'
	import numberKeyboard from '../../components/number-keyboard/number-keyboard.vue'
	import utils from '../../utils/method.js'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			passwordInput,
			numberKeyboard
		},
		data() {
			return {
				total: 0,
				totalScore: 0,
				desc: '', //备注
				isScore: "",
				fee: "0",
				cart: "",
				orderList: [],
				addrText: "地址加载中...", //
				total2: "加载中...",
				checked: false,
				sModal: false,
				currentIpt: 0,
				password: '',
				sMask: '',
				sModal1: false,
				couponsList:[],
				yhq:0,   //优惠券数值
				storeValue:0,  ///使用的储值
				wuserCouponId:''
			}
		},
		watch:{
			password(data){
				let all=(Number(this.total) + Number(this.fee)-Number(this.yhq)).toFixed(2)
				if(data.length>=6){
					this.$http({
						apiName:'checkPayPwd',
						type:'POST',
						data:{
							tradepwd:utils.md5(this.password) 
						}
					}).then(res=>{
						this.closePass()
						this.checked=true
					
						if(this.userInfo.cardAmount>=all){
							this.storeValue=all
							 this.total2=0
						}else{
							// console.log(this.userInfo)
							// console.log(Number(this.userInfo.cardAmount))
							this.storeValue=this.userInfo.cardAmount
							this.total2=Number(this.total)-Number(this.userInfo.cardAmount) 
						}
						
						// this.storeValue=
					}).catch(err=>{
						this.$refs.KeyboarHid.iptNum=[]
					})
				}
			}
		},
		async onLoad(opt) {
			console.log(this.userInfo)
			this.cart = opt.cart;
			if (opt.score == 'true') {
				this.isScore = true
				
			}
			if (!this.selectAddr) {
				await this.getAddr()
				this.total2 = "请选择地址"
			}
			if(opt.cart == 1){
				this.cart = opt.cart
				await this.getCart()
				await this.getCartYf()
				await this.getCoupons()
			}else{
				this.total = Number(this.order.price * this.order.number).toFixed(2)
				await this.getCoupons()
				await this.getYf()
				if(opt.score == 'true'){
					this.isScore = true
					this.totalScore = this.order.exchangePoints
				}
			}
		},


		onUnload() {
			this.$store.commit('setOrder', [])
			// this.setOrder([])
		},
		async onShow() {
			// this.total = 0;
			// if (this.selectAddr) {
			// 	this.total2=this.total
			// }
			// if (this.cart == 1) {
			// 	await this.getCart()
			// 	await this.getCartYf()
			// } else {
			// 	this.total = Number(this.order.price * this.order.number).toFixed(2)
			// 	if (this.isScore == true) {
			// 		this.totalScore = this.order.exchangePoints
			// 	} else {
			// 		await this.getYf()
			// 	}
			// }
		},
		filters:{
			date(data){
				return utils.unixToDatetime(data,9)
			}
		},
		computed: {
			...mapState(['order', 'selectAddr', 'config', 'setOrder','userInfo'])
		},
		methods: {
			...mapMutations(['setSelectAddr']),
			switchChecked() {
				if (!this.checked) {
					this.sModal = true
					this.sMask = true
					this.$refs.KeyboarHid.open();
				}else{
					this.$refs.KeyboarHid.iptNum=[]
					this.checked=false
					this.total2=(Number(this.total) + Number(this.fee)-this.yhq).toFixed(2)
				}
			},
			clickInput(val) {
				this.password = val;
			},
			closePass() {
				this.sModal = false
				this.sMask = false
				this.$refs.KeyboarHid.close();
				
			},
			openKeyboard() {

				if (!this.$refs.KeyboarHid.KeyboarHid) {
					this.$refs.KeyboarHid.open();
					
				}

			},
			yhqSel() {
				this.sMask = true
				this.sModal1 = true
			},
			fetchAddr() {
				if (this.cart == 1) {
					uni.navigateTo({
						url: `/pages/address/address?score=${this.isScore}&source=3`
					})
				} else {
					uni.navigateTo({
						url: `/pages/address/address?score=${this.isScore}&source=1`
					})
				}
			},

			async getCart() {
				let that = this
				await this.$http({
					apiName: "getCartList"
				}).then(res => {
					this.orderList = res.data
					
					this.orderList.map(item => {
						if (item.checkedFlag) {
							that.total = that.total + Number((Number(Number(item.promotionPrice * item.number).toFixed(2))).toFixed(2))
							
						}
					})
				}).catch(_ => {})
			},
			async submit() {
				if (!this.selectAddr) {
					uni.showToast({
						title: "请先选择地址",
						mask: true,
						icon: "none"
					})
					return
				}
				var that = this;
				var _skuJson = {};
				this.order.specSelected.map(item => {
					_skuJson[item.key] = item.value
				})
                   let cardAmountFlag=this.checked?1:0
				await this.$http({
					apiName: "createOrder",
					type: "POST",
					data: {
						addressId: this.selectAddr.id,
						num: this.order.number,
						productId: this.order.productId,
						// #ifdef APP-PLUS
						sourceType: '1',
						// #endif
						// #ifdef H5
						sourceType: '2',
						// #endif
						// #ifdef MP-WEIXIN
						sourceType: '3',
						// #endif
						skuJson: JSON.stringify(_skuJson),
						remark: this.desc,
						tradepwd:this.password,
						cardAmountFlag:cardAmountFlag,
						wuserCouponId:this.wuserCouponId
					}
				}).then(res => {
					// if (that.isScore) {
					// 	uni.redirectTo({
					// 		url: "/pages/money/paySuccess?isDh=1"
					// 	})
					// } else {
					// 	uni.redirectTo({
					// 		url: `/pages/money/pay?money=${this.total2}&orderid=${res.data}`
					// 	})
					// }
					if(this.total2>0){
							uni.redirectTo({
								url: `/pages/money/pay?money=${this.total2}&orderid=${res.data}`
							})
					}else{
							uni.redirectTo({
								url: "/pages/money/paySuccess"
							})
					}
				}).catch(_ => {})

			},
			async submit2() {
				if (!this.selectAddr) {
					uni.showToast({
						title: "请先选择地址",
						mask: true,
						icon: "none"
					})
					return
				}
              let cardAmountFlag=this.checked?1:0
				var that = this
				await this.$http({
					apiName: "createCartOrder",
					type: "POST",
					data: {
						addressId: this.selectAddr.id,
						// #ifdef APP-PLUS
						sourceType: '1',
						// #endif
						// #ifdef H5
						sourceType: '2',
						// #endif
						// #ifdef MP-WEIXIN
						sourceType: '3',
						// #endif
						tradepwd:this.password,
						cardAmountFlag:cardAmountFlag,
						wuserCouponId:this.wuserCouponId
					}
				}).then(res => {
					if(this.total2>0){
							uni.redirectTo({
								url: `/pages/money/pay?money=${this.total2}&orderid=${res.data.order.id}`
							})
					}else{
							uni.redirectTo({
								url: "/pages/money/paySuccess"
							})
					}
					// uni.redirectTo({
					// 	url: `/pages/money/pay?money=${this.total2}&orderid=${res.data.order.id}`
					// })
				}).catch(_ => {})

			},
			scoreEx() {
				var that = this
				uni.showModal({
					title: '提示',
					content: '确定兑换' + this.config.MALL_POINT_TITLE + '兑换该商品？',
					success: function(res) {
						if (res.confirm) {
							that.submit()
						}
					}
				});
			},
			//获取默认地址
			async getAddr() {
				await this.$http({
					apiName: "addrList",
					data: {
						page: 1,
						size: 1
					}
				}).then(res => {
					this.setSelectAddr(res.data.list[0])
					if (res.data.list.length == 0) {
						this.addrText = "暂无可用地址请点击添加"
					}
				}).catch(_ => {})
			},
			async getYf() {
				if (this.selectAddr) {
					// this.getCoupons()
					await this.$http({
						apiName: "getYunfei",
						type: "POST",
						data: {
							productId: this.order.productId,
							province: this.selectAddr.province
						}
					}).then(res => {
						this.fee = res.data.fee
						this.total2 = (Number(this.total) + Number(this.fee)).toFixed(2)
					}).catch(_ => {})
				}
			},
			async getCartYf() {
				if (this.selectAddr) {
					await this.$http({
						apiName: "cartYunfei",
						type: "POST",
						data: {
							province: this.selectAddr.province
						}
					}).then(res => {
						this.fee = res.data
						this.total2 = (Number(this.total) + Number(this.fee)).toFixed(2)
					}).catch(_ => {})
				}
			},
			stopPrevent() {},
			async getCoupons(){
				await this.$http({
					apiName:'getOrderCoupon',
					// type:'POST',
					data:{
						payAmount:this.total
					}
				}).then(res=>{
					this.couponsList=res.data
				}).catch(err=>{})
			},
			selCoupon(item){
				if(item.useFlag){
					this.sMask = false
					this.sModal1 = false
					this.yhq=item.amount
					this.wuserCouponId=item.wuserCouponId
					if(this.total<=item.amount){
						this.total2=0
						this.checked=false
					}else{
						if(this.checked){
							if((Number(this.total) + Number(this.fee)).toFixed(2)>this.userInfo.cardAmount){
								this.storeValue=this.userInfo.cardAmount
							}else{
								this.storeValue=(this.total-Number(item.amount)).toFixed(2)
							}
							
						}
						this.total2=(Number(this.total)-Number(item.amount)-Number(this.storeValue)).toFixed(2)
					}
					
				}else{
					uni.showToast({
						title:'该优惠券不可用'
					})
				}
				
			}
		},
		onBackPress(e) {
			if (this.cart == 1) {
				uni.switchTab({
					// uni.reLaunch({
					url: '/pages/cart/cart'
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

<style lang="scss" scoped>
	page {
		background: $page-color-base;
		padding-bottom: 100rpx;
	}

	.masks {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(52, 52, 52, 0.7);
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

				.spec-text {
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

				.number {
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
        justify-content: space-between;
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
			// flex: 1;
			font-size: 26rpx;
			color: $font-color-light;
			margin-right: 60rpx;
		}

		.cell-right {
			font-size: 30rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 600;
			color: rgba(242, 61, 61, 1);
			line-height: 40rpx;
			margin-right: 10rpx;
			flex: 1;
			text-align: right;
		}

		.cell-tip {
			font-size: 28rpx;
			color: #303133;
			flex: 1;
			text-align: right;
			font-weight: 500;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				// max-width: 90rpx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}

	/* 支付列表 */
	.pay-list {
		padding-left: 40rpx;
		margin-top: 16rpx;
		background: #fff;

		.pay-item {
			display: flex;
			align-items: center;
			padding-right: 20rpx;
			line-height: 1;
			height: 110rpx;
			position: relative;
		}

		.icon-weixinzhifu {
			width: 80rpx;
			font-size: 40rpx;
			color: #6BCC03;
		}

		.icon-alipay {
			width: 80rpx;
			font-size: 40rpx;
			color: #06B4FD;
		}

		.iconchenggong {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60rpx;
			height: 60rpx;
			font-size: 40rpx;
			color: $base-color;
		}

		.tit {
			font-size: 32rpx;
			color: $font-color-dark;
			flex: 1;
		}
	}

	.footer {
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
		box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		.price-content {
			padding-left: 30rpx;
		}

		.price-tip {
			color: $base-color;
			margin-left: 8rpx;
		}

		.price {
			font-size: 36rpx;
			color: $base-color;
		}

		.submit {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 280rpx;
			height: 100%;
			color: #fff;
			font-size: 32rpx;
			background-color: $base-color;
		}
	}

	/* 优惠券面板 */
	.mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		transition: .3s;

		.mask-content {
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y: scroll;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.mask-content {
				transform: translateY(0);
			}
		}
	}

	/* 优惠券列表 */
	.coupon-item {
		display: flex;
		flex-direction: column;
		margin: 20rpx 24rpx;
		background: #fff;

		.con {
			display: flex;
			align-items: center;
			position: relative;
			height: 120rpx;
			padding: 0 30rpx;

			&:after {
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

		.left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100rpx;
		}

		.title {
			font-size: 32rpx;
			color: $font-color-dark;
			margin-bottom: 10rpx;
		}

		.time {
			font-size: 24rpx;
			color: $font-color-light;
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26rpx;
			color: $font-color-base;
			height: 100rpx;
		}

		.price {
			font-size: 44rpx;
			color: $base-color;

			&:before {
				content: '￥';
				font-size: 34rpx;
			}
		}

		.tips {
			font-size: 24rpx;
			color: $font-color-light;
			line-height: 60rpx;
			padding-left: 30rpx;
		}

		.circle {
			position: absolute;
			left: -6rpx;
			bottom: -10rpx;
			z-index: 10;
			width: 20rpx;
			height: 20rpx;
			background: #f3f3f3;
			border-radius: 100px;

			&.r {
				left: auto;
				right: -6rpx;
			}
		}
	}

	.switch {
		width: 66rpx;
		height: 40rpx;
		margin-left: 20rpx;
	}

	.validateBox {
		height: 0;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #fff;
		z-index: 999;
		display: flex;
		// justify-content: center;
		flex-direction: column;
		align-items: center;
		// position: relative;
		overflow: hidden;

		// opacity: 0;
		.iconfont {
			font-size: 30rpx;
			position: absolute;
			left: 20rpx;
			top: 20rpx;
			// left: 0;
		}

		.txt1 {
			margin: 38rpx 0;
		}

		.input_area {
			margin-top: 30rpx;
			display: flex;

			.box {
				width: 80rpx;
				height: 80rpx;
				border: 2rpx solid rgba(192, 196, 204, 1);
				text-align: center;
				margin-right: 20rpx;
			}

			.box:last-child {
				margin-right: 0;
			}
		}

		.txt2 {
			font-size: 30rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(192, 196, 204, 1);
			margin-top: 30rpx;
			margin-bottom: 100rpx;
		}
	}

	.validateBox.active {
		transition: .4s;
		// opacity: 1;
		// min-height: 410rpx;
		height: auto;
	}

	.yhqSel {
		height: 0;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #fff;
		z-index: 999;
		display: flex;
		flex-direction: column;
		align-items: center;
        background: #F9FAFB;
		overflow: scroll;
		// padding:0 32rpx 60rpx;
		.titles {
			margin: 38rpx 0 58rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 600;
			color: rgba(48, 49, 51, 1);
		}
       .cancel{
		   position: absolute;
		   right: 30rpx;
		   top: 48rpx;
		   font-size:24rpx;
		   font-family:PingFangSC-Regular,PingFang SC;
		   font-weight:400;
		   color:rgba(242,61,61,1);
	   }
		.card-item {
			// margin:0 32rpx;
			background: #fff;
			width: 700rpx;
			height: 200rpx;
			display: flex;
			margin-bottom: 40rpx;
			// align-items: center;
      
			.fengmian {
				width: 200rpx;
				height: 200rpx;
				// position: absolute;
				// left: 0;
				// top: 0;
				background: url(../../static/yhq.png) no-repeat;
				background-size: 100%;
				display: flex;
				align-items: center;
				justify-content: center;

				.content {
					font-size: 28rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: rgba(255, 255, 255, 1);
					display: flex;
					align-items: flex-end;

					text {
						font-size: 52rpx;
						line-height: 58rpx;
					}
				}

			}

			.main {
				flex: 1;
				margin: 0 10rpx 0 30rpx;
				overflow: hidden;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				height: 100%;

				.title {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-size: 32rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 500;
					color: rgba(48, 49, 51, 1);
					// width: 100%;
					width: 100%;
				}

				.info {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.txt {
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: rgba(168, 171, 179, 1);
					}

					.btn {
						border-radius: 22rpx;

						padding: 0 18rpx;
						line-height: 44rpx;
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;

					}

					.btn1 {
						border: 2rpx solid rgba(242, 61, 61, 1);
						color: rgba(242, 61, 61, 1);
					}

					.btn2 {
						border: 2rpx solid rgba(144, 147, 153, 1);
						color: rgba(144, 147, 153, 1);
					}
				}

				.date {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(168, 171, 179, 1);
				}
			}
		}

		.card-item:last-child {
			margin-bottom: 60rpx;
		}

		.circle {
			text{
				width: 36rpx;
				height: 36rpx;
				border: 2rpx solid rgba(217, 217, 217, 1);
				border-radius: 50%;
			}
			height: 100%;
			margin-right: 30rpx;
			display: flex;
			align-items: center;
		}
		.nouse{
			width: 104rpx;
			height: 104rpx;
			
		}
	}

	.yhqSel.active {
		transition: .4s;
		height: 700rpx;
	}
</style>
