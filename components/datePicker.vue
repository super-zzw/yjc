<template>
	<view>
		<view class="masks" v-if="dateSel" ></view>
		<view class="datePicker" :class="dateSel?'active':''">
			<text class="tip">交易时间</text>
			<view class="dateIpt">
				
				<view class="startTime Time">
					<picker mode="date" @change="bindDateChange2" fields="day">
						<!-- 	<text>{{startTime}}</text>
						<text class="iconfont iconzidingyishaixuan-shijianshaixuan"></text> -->
						<input type="text" v-model="startTime" disabled placeholder-class="placeholder" placeholder="起始日期" />
					</picker>
				</view>
				<text class="txt">至</text>
				<view class="endTime Time">
					<picker mode="date" @change="bindDateChange3" fields="day">
						<input type="text" v-model="endTime" disabled placeholder-class="placeholder" placeholder="结束日期" />
					</picker>
				</view>
			</view>
			<view class="typeSel">
				<text class="tip">交易类型</text>
					<!-- <text >请选择交易类型</text> -->
				<checkbox-group @change="checkboxChange" class="uni-input">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in typeArr" :key="index">
							<checkbox :value="item.value" :checked="item.checked" />
							<text>{{item.title}}</text>
					</label>
				</checkbox-group>
					<!-- <text v-for="(item,index) in type_select" :key="index" class="checkedVal">{{item}}</text> -->
				
			</view>
			<button type="default" @tap="close">确定</button>
		</view>
		<!-- <view  :class="showType?'active multiBox':'multiBox'">
			<view class="buttons">
				<view class="cancel" @click="cancel">取消</view>
				<view class="comfirm" @click="comfirm">确定</view>
			</view>

			<scroll-view :scroll-y="true" class="check-box-group" v-if="typeArr.length > 0">
				<checkbox-group @change="checkboxChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in typeArr" :key="index">
						<view class="item">
							<checkbox :value="item.value" :checked="item.checked" />
							<text>{{item.title}}</text>
						</view>
					</label>
				</checkbox-group>
			</scroll-view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				startTime: '',
				endTime: '',
				typeArr: [{
						title: '转账转出',
						value: 'transfer_out'
					},
					{
						title: '转入',
						value: 'transfer_in'
					},
					{
						title: '余额支付',
						value: 'balancepay'
					},
					{
						title: '担保收入',
						value: 'sysdb_collect'
					},
					{
						title: '担保支出',
						value: 'sysdb_outamt'
					},
					{
						title: '充值',
						value: 'charge'
					},
					{
						title: '对私提现',
						value: 'withdraw_personal'
					},
					{
						title: '对公提现',
						value: 'withdraw_company'
					},
					{
						title: '微信支付',
						value: 'wechatpay'
					},
					{
						title: '余额退款',
						value: 'refurd'
					},
					{
						title: '支付宝支付',
						value: 'alipay'
					},
					
					
				],
				showBox: true,
				showType:false,
				type_select:[]
			};
		},
		props: {
			dateSel: {
				default: false
			}
		},
		methods: {
			close() {
				 if (this.startTime && this.endTime && (Number(this.startTime.split("-").join("")) > Number(this.endTime.split(
						"-").join("")))) {
					uni.showToast({
						icon: "none",
						title: "时间段不合理"
					})
				} else {
					this.$emit('close', {
						startTime: this.startTime,
						endTime: this.endTime,
						tradeType: this.type_select
					})
				}
			},
			closePicker() {
				this.$emit('close')
			},
			bindDateChange2(e) {
				this.startTime = e.detail.value
			},
			bindDateChange3(e) {
				this.endTime = e.detail.value
			},
			typeSel(){
				this.showType=true
			},
			checkboxChange(e) {
				console.log(e.detail.value)
              this.type_select=e.detail.value
			  console.log(this.type_select)
			},
			cancel(){
				this.showType=false
			},
			comfirm(){
				this.showType=false
			}
		}
	}
</script>

<style lang="scss">
	.masks {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(52, 52, 52, 0.7);
	}

	.datePicker {
		background: #fff;
		height: 0;
		position: fixed;
		left: 0;
		top: 0;
		/* #ifdef H5 */
		top: 88rpx;
		/* #endif */
		width: 100%;
		display: flex;
		
		flex-direction: column;
		overflow: hidden;
        .tip{
			font-size: 32rpx;
		}
		.dateIpt {
			margin: 20rpx 0 30rpx;
			display: flex;
             justify-content: center;
			.Time {
				width: 208rpx;
				height: 60rpx;
				background: rgba(245, 245, 245, 1);
				border-radius: 8rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(242, 61, 61, 1);

				.iconfont {
					color: #AAA;
					margin-left: 10rpx;
				}

			}

			.txt {
				margin: 0 40rpx;
				line-height: 60rpx;
				height: 60rpx;
				font-size: 28rpx;
			}
		}

		.picker-item {
			margin: 0 32rpx;
			display: flex;
			justify-content: space-between;
			// width: 100%;
			height: 264rpx;

			.years,
			.months {
				width: 320rpx;
				flex-direction: column;
				text-align: center;
			}

			.year-item,
			.month-item {
				line-height: 88rpx;
			}
		}
	}

	.datePicker.active {
		height: 620rpx;
		transition: .4s;
		padding: 0 60rpx;
	}

	input {
		text-align: center;
	}

	.typeSel {
		
		font-size: 32rpx;
		margin-bottom: 50rpx;

		.tip {
			margin-right: 30rpx;
			display: block;
			margin-bottom: 20rpx;
		}

		.uni-input {
			
			display: flex;
			flex-wrap: wrap;
			background: whitesmoke;
			color: #999999;
			padding:20rpx 10rpx ;
			// text-align: center;
		}
		.checkedVal{
			color:#303133;
			position: relative;
			margin-right: 10rpx;
			margin-top: 24rpx;
			display: inline-block;
		}
		.checkedVal:after{
			content: 'x';
			position: absolute;
			top: -20rpx;
			right: -20rpx;
			width: 15px;
		    height: 15px;
			font-size: 26rpx;
			line-height: 26rpx;
			background:#F23D3D ;
			color: #fff;
			text-align: center;
			border-radius: 50%;
		}
	}

	// .multiBox {
	// 	background: #fff;
	// 	height: 0;
	// 	position: absolute;
	// 	overflow: hidden;
	// 	left: 0;
	// 	bottom: 0;
	// 	width: 100%;
	// 	transition: all 0.3s;

	// 	.buttons {
	// 		display: flex;
	// 		justify-content: space-between;
	// 		color: red;
	// 		/* margin-bottom:40rpx; */
	// 		padding: 20rpx 40rpx;
	// 		font-family: 'Microsoft YaHei';
	// 		font-size: 36rpx;
	// 		border-bottom: 1rpx solid #f5f5f5;
	// 	}

	// 	.cancel {
	// 		color: #888;
	// 	}

	// 	.comfirm {
	// 		color: #007aff;
	// 	}

	// 	.check-box-group {
	// 		height: 85%;
	// 		padding-left: 35%;
	// 		padding-bottom: 20rpx;
	// 		padding-top: 20rpx;
	// 	}
	// 	.uni-list-cell .item{
	// 		margin: 10rpx;
	// 	}

	// }
	// .multiBox.active{
	// 	height: 40%;
	// }
	.uni-list-cell{
		width: 33.33%;
		margin: 5rpx 0;
		text{
			font-size: 30rpx;
		}
	}
</style>
