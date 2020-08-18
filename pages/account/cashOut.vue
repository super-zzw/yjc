<template>
	<view class="container" v-if="config">
		<view class="accountBox" @tap="accountSel">
			<view class="left" v-if="accountList.length > 0">
				<!-- 	<! <image src="../image/zhifubao.png" mode="" class="accountImg" v-if="accountList[selectFxAccount].type == 0"></image> -->
				<i mode="" class=" iconfont iconyinhangkazhanghu"></i>
				<view class="info">
					<text class="name">{{accountList[selectFxAccount].bankname}}</text>
					<text class="num">{{accountList[selectFxAccount].cardno}}</text>
				</view>
			</view>
			<view class="left" v-else>
				<view class="info">
					<text class="name">暂无提现账户，点击添加</text>
				</view>
			</view>
			<text class="iconfont iconchakanquanbu"></text>
		</view>
		<view class="moneyBox">
			<text class="txt1">提现金额</text>
			<view class="iptBox">￥<input type="number" value="" v-model="money" @blur="getFee"/></view>
			<text class="divider"></text>
			<view class="txts">
				<text class="txt2" v-if="type==1">可提现金额¥{{userInfo.yjcBalance-userInfo.yjcFreezeBalance.toFixed(2)}}</text>
				<text class="txt2" v-if="type==2">可提现金额¥{{userInfo.yjcCardBalance.toFixed(2)}}</text>
				<text class="txt2" v-if="isshow">手续费：¥{{fee}}</text>
				<!-- 	<view v-if="config.DISTRIBUTE_WITHDRAW.withdrawType == 1" class="txt2">
					手续费：¥{{config.DISTRIBUTE_WITHDRAW.withdrawAmount}}
				</view>
				<view v-if="config.DISTRIBUTE_WITHDRAW.withdrawType == 2" class="txt2">
					手续费：{{config.DISTRIBUTE_WITHDRAW.withdrawRatio * money}}
				</view> -->
			</view>
			<button type="default" hover-class="none" @tap="tx">提交</button>
		</view>
		<pwdValidate :sModal="sModal" @validateOk="validateOk" @close="close" ref="pwdValidate" @navTo="toPayPwd"/>

	</view>
</template>

<script>
	import utils from '../../utils/method.js'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				money: '',
				accountList: [], //提现账户
				ableMoney: "", //可提现金额
				sModal: false,
				password: '',
                type:'',
				fee:0,
				isshow:false
			};
		},
		onLoad(opt) {
			if(opt.type==2){
				this.type=1
			}else{
				this.type=2
			}
		},
		async onShow() {
			uni.showLoading({
				title: "加载中..."
			})
			await this.getInfo();
			await this.getAccount();
			uni.hideLoading()
		},

		computed: {
			...mapState(['selectFxAccount', 'config', 'userInfo']),
			
		},
		methods: {
			//获取账户详情
			getInfo() {
				this.$http({
					apiName: "DistributionInfo"
				}).then(res => {

					this.ableMoney = res.data.extractAmount;
				}).catch(err => {})
			},
			//获取账户列表
			getAccount() {
				this.$http({
					apiName: "fxyjAccountList",
				}).then(res => {
					this.accountList = res.data;
				}).catch(err => {})
			},
			accountSel() {
				if (this.accountList.length > 0) {
					uni.navigateTo({
						url: 'accountSel'
					})
				}else{
					uni.navigateTo({
						url:'./addAccount'
					})
				}
				
			},
			// 获取手续费
			async getFee(){
				if(this.money){
					await this.$http({
						apiName:'getFee',
						data:{
							amount:this.money,
							type:this.type
						}
					}).then(res=>{
						this.fee=res.data
						this.isshow=true
					})
				}
				
			},
			async validateOk(pass) {
				this.password = pass
				
				uni.showLoading({
					title: "提交中..."
				})
				await this.$http({
					apiName: "fxWithdraw",
					type: "POST",
					data: {
						amount: this.money,
						tradepwd:utils.md5(this.password),
						withdrawAccountId: this.accountList[0].id,
						type:this.type
					}
				}).then(res => {
					uni.hideLoading();
					uni.navigateTo({
						url: './successTip?status=' + 1
					})
				}).catch(err => {
					uni.hideLoading()
					uni.showToast({
						icon: "none",
						title: err.message
					})
				})
			},
			close() {
				this.sModal = false
			},
			toPayPwd(nav){
				uni.navigateTo({
					url:nav
				})
			},
			async tx() {
				if (!this.accountList.length) {
					uni.showToast({
						icon: "none",
						title: "请创建提现账户"
					})
				} else if (!this.money) {
					uni.showToast({
						icon: "none",
						title: "请输入可提现金额"
					})
				} else {
					// 	uni.showLoading({
					// 		title:"提交中..."
					// 	})
					// 	await this.$http({
					// 		apiName:"fxWithdraw",
					// 		type:"POST",
					// 		data:{
					// 			amount:this.money,
					// 			withdrawAccountId:this.accountList[0].id
					// 		}
					// 	}).then(res => {
					// 		uni.hideLoading();
					// 		uni.navigateTo({
					// 			url:'./txTip?status='+1
					// 		})
					// 	}).catch(err => {
					// 		uni.hideLoading()
					// 		uni.showToast({
					// 			icon:"none",
					// 			title:err.message
					// 		})
					// 	})
					this.sModal = true
				}



				// uni.redirectTo({
				// 	url:'successTip?status=1'
				// })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		background: #F9FAFB;
		;
	}

	.accountBox {
		background: #fff;
		padding: 36rpx 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.left {
			display: flex;

			.accountImg {
				width: 88rpx;
				height: 88rpx;
				margin-right: 28rpx
			}

			.info {
				display: flex;
				flex-direction: column;
				margin-left: 30rpx;

				.name {
					font-size: 32rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 500;
					color: rgba(48, 49, 51, 1);
				}

				.num {
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(168, 171, 179, 1);
				}
			}
		}
	}

	.moneyBox {
		margin-top: 20rpx;
		padding: 32rpx 32rpx 80rpx;
		background: #fff;
		display: flex;
		flex-direction: column;

		.txt1 {
			font-size: 30rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 600;
			color: rgba(48, 49, 51, 1);
			line-height: 42px;
		}

		.iptBox,
		.iptBox input {
			display: flex;
			font-size: 44rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(48, 49, 51, 1);
			line-height: 60rpx;

		}

		.divider {

			height: 2rpx;
			width: 100%;
			background: #DBDBDB;
			margin-top: 20rpx;
		}

		.txts {
			display: flex;
			justify-content: space-between;
		}

		.txt2 {
			margin-top: 20rpx;
			font-size: 30rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(144, 147, 153, 1);
			line-height: 42rpx;
		}

		button {
			background: rgba(242, 61, 61, 1);
			border-radius: 44rpx;
			width: 100%;
			margin-top: 60rpx;
			font-size: 30rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: rgba(255, 255, 255, 1);
		}
	}

	.masks {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(52, 52, 52, 0.7);
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

	.iconyinhangkazhanghu {
		color: #f89809;
		font-size: 88rpx;
	}
</style>
