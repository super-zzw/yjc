<template>
	<view>
		<!-- 地址 -->
		<checkbox-group class="rw" name="" @change="changeSend">
			<label class="rwlabel">
				<text class="rwtext">选择自提</text>
				<checkbox value="1" checked/>
			</label>
		</checkbox-group>
		<view @tap="fetchAddr"  class="address-section" v-if="receiveWay == 0">
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

			<image class="a-bg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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"></image>
		</view>
		<view class="goods-section" >
			<!-- 商品列表 -->
			
			<view class="fightInfo" v-if="order">
				<view class="fightText">
					为您加入仅差{{order.groupTotal - order.group.length}}人的拼团，支付后即可
					<text v-if="order.groupTotal == order.group.length">拼购</text>
					<text v-else>参团</text>
					成功
				</view>
				<view class="fightImg">
					<view class="fpNumstImg" v-for="(imgItem,imgIndex) in order.group" :key="imgIndex">
						<image v-if="imgItem.icon && imgIndex < 10" class="img" :src="imgItem.icon" mode=""></image>
					</view>
					<view class="fpNumstImg">
						<image class="img" :src="userInfo.icon" mode=""></image>
					</view>
					<view class="fightImgMine">
						待支付
					</view>
				</view>
			</view>
			<view class="g-item">
				<image :src="order.picUrl"></image>
				<view class="right">
					<text class="title clamp">{{order.title}}</text>
					<text class="spec">
						<text class="spec-text" v-for="(item,index) in order.specSelected" :key="index">{{item.value}}</text>
					</text>
					<view class="price-box">
						<text class="price">￥{{order.price}}</text>
						<text class="number">x {{order.number}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品金额</text>
				<text class="cell-tip">￥{{total}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip">{{fee}}</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">备注</text>
				<input class="desc" type="text" v-model="desc" placeholder="请填写备注信息" placeholder-class="placeholder" />
			</view>
		</view>
		
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">{{total2}}</text>
			</view>
			<text class="submit" @click="submit">提交订单</text>
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
				receiveWay:1,  //1自提，0快递
				total:0,
				totalScore:0,
				desc: '', //备注
				fee:"0",
				orderList:[],
				addrText:"地址加载中...",  //
				total2:"加载中..."
			}
		},
		async onLoad(opt){
			console.log(this.userInfo)
		},
		async onShow(){
			this.total = 0;
			if(!this.selectAddr){
				await this.getAddr()
			}
			this.total = Number(this.order.price * this.order.number).toFixed(2)
			await this.getYf()
		},
		computed:{
			...mapState(['order','selectAddr','userInfo'])
		},
		methods: {
			...mapMutations(['setSelectAddr']),
			changeSend(e){
				let _i = e.detail.value[0];
				if(_i){
					this.receiveWay = 1;
				}else{
					this.receiveWay = 0
				}
			},
			fetchAddr(){
				uni.navigateTo({
					url:`/pages/address/address?source=1`
				})
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
				var that = this;
				var _skuJson = {};
				this.order.specSelected.map(item => {
					_skuJson[item.key] = item.value
				})
				await this.$http({
					apiName:"createFightOrder",
					type:"POST",
					data:{
						rulesId:this.order.rulesId,
						receiveWay:this.receiveWay,
						addressId:this.selectAddr.id,
						num:this.order.number,
						productId:this.order.productId,
						sourceType:'1',
						skuJson:JSON.stringify(_skuJson),
						remark:this.desc
					}
				}).then(res => {
					uni.redirectTo({
						url: `/pages/money/pay?money=${this.total2}&orderid=${res.data}&group=1`
					})
				}).catch(_ => {})
				
			},
			async submit2(){
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
				    content: '确定兑换积分兑换该商品？',
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
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100rpx;
	}
	.rw{
		background-color: #fff;
		padding: 20rpx 32rpx;
		border-bottom: 2rpx solid #e1e6ee;
		.rwlabel{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.rwtext{
				font-size: 32rpx;
				font-weight: bold;
				color: #F23D3D;
			}
		}
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
		background: #fff;
		padding-bottom: 1px;
		.fightInfo{
			padding: 32rpx;
			padding-bottom: 0;
			border-bottom: 16rpx solid #F9FAFB;
			.fightText{
				color: #303133;
				font-size: 30rpx;
			}
			.fightImg{
				margin-top: 40rpx;
				padding-left: 20rpx;
				font-size: 28rpx;
				display: flex;
				align-items: center;
				.fpNumstImg{
					margin-left: -20rpx;
					display: inline-block;
					.img{
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;
						border: 2rpx solid #fff;
					}
				}
				.fightImgMine{
					background-color: #F23D3D;
					color: #fff;
					font-size: 20rpx;
					border-radius: 20rpx;
					padding: 0 8rpx;
					align-self: flex-start;
					margin-left: -30rpx;
					z-index: 9;
				}
			}
			
		}
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
