<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{money}}</text>
		</view>

		<view class="pay-type-list">
			<!-- 1=支付宝；2=微信 4=货到付款, -->
			<view class="" v-for="(item,index) in payTypes" :key="index">
				<view class="type-item b-b" @click="changePayType(1)" v-if="item.payType === 2">
					<text class="icon iconfont iconweixin"></text>
					<view class="con">
						<text class="tit">微信支付</text>
						<text>推荐使用微信支付</text>
					</view>
					<label class="radio">
						<radio value="" color="#F23D3D" :checked='payType == 1' />
						</radio>
					</label>
				</view>
				<!-- #ifndef MP-WEIXIN -->
				<view class="type-item b-b" @click="changePayType(2)"  v-if="item.payType === 1">
					<text class="icon iconfont iconzhifubao"></text>
					<view class="con">
						<text class="tit">支付宝支付</text>
					</view>
					<label class="radio">
						<radio value="" color="#F23D3D" :checked='payType == 2' />
						</radio>
					</label>
				</view>
				<!-- #endif -->
				<view class="type-item b-b" @click="changePayType(3)"  v-if="item.payType === 1">
					<text class="icon iconfont iconhuodaofukuan"></text>
					<view class="con">
						<text class="tit">货到付款</text>
					</view>
					<label class="radio">
						<radio value="" color="#F23D3D" :checked='payType == 3' />
						</radio>
					</label>
				</view>
			</view>
		</view>
		
		<text class="mix-btn" @click="confirm">
			<text v-if="payType == 3">确定</text>
			<text v-else>确认支付</text>
		</text>
	</view>
</template>

<script>
import {
	   mapMutations
    } from 'vuex';
	export default {
		data() {
			return {
				money:0,
				orderId:"",
				payType: 1,
				orderInfo: {},
				payTypes:[]
			};
		},
		computed: {
		
		},
		onLoad(opt) {
			this.money = opt.money
			this.orderId = opt.orderid
			this.getPayType()
		},

		methods: {
			...mapMutations(['setSelectAddr']),
			//获取支付方式
			async getPayType(){
				await this.$http({
					apiName:"payType"
				}).then(res => {
					this.payTypes = res.data
				}).catch(e => {
					
				})
			},
			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
			//确认支付
			confirm: async function() {
				if(this.payType == 1){
					await this.wxPay()
				}else if(this.payType == 2){
					await this.aliPay()
				}else if(this.payType == 3){
					let _self = this;
					uni.showModal({
					    title: '提示',
					    content: '为确保您能及时收到商品，请确认您的收货信息准确无误！',
					    success: function (res) {
					        if (res.confirm) {
					            _self.afterSale()
					        } else if (res.cancel) {
					            
					        }
					    }
					});
				}
			},
			async afterSale(){
				let that = this;
				await this.$http({
					apiName:"payAfter",
					type:"POST",
					data:{orderNo:this.orderId}
				}).then(res => {
					that.setSelectAddr(null);  //支付成功后清除选中的地址（测试要求的）
					uni.navigateTo({
						url:"/pages/money/paySuccess?isDh=2"
					})
				}).catch(err => {
					
				})
			},
			 async wxPay(){
				var _openId = "";
				var _wxPayType = "APP";
				// #ifdef APP-PLUS
				_openId = "";
				wxPayType = "APP";
				// #endif
				 
				var that = this;
				await this.$http({
					apiName:"wxPay",
					type:"POST",
					data:{
						orderNo:this.orderId,
						openId:_openId,
						wxPayType:_wxPayType
					}
				}).then(res => {
					let obj = {
						appId: res.data.appId,
						nonceStr: res.data.nonceStr,
						package: "prepay_id=" + res.data.prepayId, // 固定值，以微信支付文档为主
						timeStamp: res.data.timeStamp,
						paySign: res.data.sign ,// 根据签名算法生成签名
						signType:"MD5"
					}
					// 第一种写法，传对象
					// let orderInfo = obj
					// 第二种写法，传对象字符串
					// let orderInfo = JSON.stringify(obj)
					uni.requestPayment({
					    provider: 'wxpay',
					    ...obj,
					    success: function (res) {
							that.setSelectAddr(null);  //支付成功后清除选中的地址（测试要求的）
							console.log(res);
					        uni.navigateTo({
					        	url:"/pages/money/paySuccess"
					        })
					    },
					    fail: function (err) {
					        uni.navigateTo({
					        	url:"/pages/money/payFail"
					        })
					    }
					});
				}).catch(_ => {})
				
			},
			async aliPay(){
				await this.$http({
					apiName:"aliPay",
					type:"POST",
					data:{orderNo:this.orderId}
				}).then(res => {
					uni.requestPayment({
					    provider: 'alipay',
					    orderInfo: res.data, //微信、支付宝订单数据
					    success: function (data) {
					        that.setSelectAddr(null);  //支付成功后清除选中的地址（测试要求的）
					        uni.navigateTo({
					        	url:"/pages/money/paySuccess"
					        })
					    },
					    fail: function (err) {
					        uni.navigateTo({
					        	url:"/pages/money/payFail"
					        })
					    }
					});
				}).catch(_ => {})
				
			}
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #909399;

		.price{
			font-size: 50rpx;
			color: #303133;
			margin-top: 12rpx;
			&:before{
				content: '￥';
				font-size: 40rpx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20rpx;
		background-color: #fff;
		padding-left: 60rpx;
		
		.type-item{
			height: 120rpx;
			padding: 20rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60rpx;
			font-size: 30rpx;
			position:relative;
		}
		
		.icon{
			width: 100rpx;
			font-size: 52rpx;
		}
		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}
		.iconweixin {
			color: #36cb59;
		}
		.iconzhifubao {
			color: #01aaef;
		}
		.iconhuodaofukuan{
			color: #0FCE8D;
		}
		.tit{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4rpx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630rpx;
		height: 80rpx;
		margin: 80rpx auto 30rpx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10rpx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

</style>
