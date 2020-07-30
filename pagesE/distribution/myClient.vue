<template>
	<view>
		<view class="top">
			<text class="number">{{oneCustmerNum}}</text>
			<text class="ctxt">我的直推客户人数(人)</text>
		</view>
		<view class="content-List">
			<view class="filters">
				<view class="leftFilter">
					<view class="fTxt">
						<picker @change="bindPickerChange1" :value="index" :range="array1">
							<text class="uni-input">{{array1[index]}}</text>
							<text class="iconfont iconriqishaixuan"></text>
						</picker>
						<!-- <text>近7天</text> -->

					</view>
				</view>
				<view class="rightFilter">
					<view class="fTxt" @tap="selDate">

						<text class="iconfont iconzidingyishaixuan"></text>
						<text class="uni-input">{{date}}</text>


						<!-- <text>自定义筛选</text> -->
					</view>
				</view>
			</view>
			<view class="fList" v-if="list.length > 0">
				<view class="fItem" v-for="(item,index) in list" :key="index">
					<view class="left">
						<text class="title">{{item.title}}</text>
						<text class="info">{{item.content}}</text>
					</view>
					<view class="right">
						<text class="value">+{{item.amount}}</text>
					</view>
				</view>
			</view>
			<empty v-if="list.length == 0" :height="'71vh'"></empty>
		</view>
		<datePicker :dateSel="dateSel" @close="colseTime" />
	</view>
</template>

<script>
	import empty from "@/components/empty";
	export default {
		components:{empty},
		data() {
			return {
				array1: ['昨日', '近7天', '全部'],
				index: 1,
				date: '自定义筛选',
				dateSel: false,
				startTime: '',
				endTime: '',
				type: 7,
				list:[],
				oneCustmerNum:""
			};
		},
		async onLoad() {
			uni.showLoading({
				title: "加载中..."
			})
			await this.getInfo();
			await this.getData();
			uni.hideLoading()
		},
		methods: {
			getInfo(){
				this.$http({
					apiName:"DistributionInfo"
				}).then(res => {
					this.oneCustmerNum = res.data.oneCustomerNum;
				}).catch(err => {})
			},
			async getData() {
				await this.$http({
					apiName: "fxCustomerList",
					data: {
						type:this.type,
						timeE:this.endTime,
						timeS:this.startTime
					}
				}).then(res => {
					this.list = res.data
				}).catch(err => {})
				
			},
			async bindPickerChange1(e) {
				this.index = e.detail.value;
				if (this.index == 0) {
					this.type = 1;
				} else if (this.index == 1) {
					this.type = 7
				} else if (this.index == 2) {
					this.type = ""
				}
				await this.getData()
			},
			selDate() {
				this.dateSel = true
			},
			async colseTime(e) {
				this.dateSel = false;
				this.startTime = e.startTime;
				this.endTime = e.endTime;
				await this.getData()
			}

		},
		async onPullDownRefresh() {
			uni.showLoading({
				title: "加载中..."
			})
			await this.getInfo();
			await this.getData();
			uni.stopPullDownRefresh();
			uni.hideLoading()
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		text-align: center;
		display: flex;
		flex-direction: column;
		padding-bottom: 44rpx;

		.number {
			margin-top: 44rpx;
			font-size: 44rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(242, 61, 61, 1);
			line-height: 60rpx;
			margin-bottom: 8rpx;
		}

		.ctxt {
			font-size: 30rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(48, 49, 51, 1);
			line-height: 42rpx;
		}

		.agents {
			margin-top: 44rpx;
			display: flex;
			align-items: center;

			.agentTab {
				flex: 1;
				box-sizing: border-box;

				text {
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(48, 49, 51, 1);
					line-height: 88rpx;
					display: inline-block;
					height: 88rpx;
				}
			}

			.agentTab text.active {
				border-bottom: 4rpx solid #F23D3D;
			}

			.divider {
				width: 2rpx;
				height: 30rpx;
				background: #DBDBDB;
			}
		}
	}

	.content-List {


		// display: flex;

		.filters {
			display: flex;
			justify-content: space-between;
			padding: 30rpx;
			background: #F9FAFB;

			.fTxt {
				font-size: 30rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(48, 49, 51, 1);

			}

			.iconfont {
				margin-left: 5rpx;
			}

			.iconzidingyishaixuan {
				margin-right: 5rpx;
			}


		}

	}

	.fList {
		height: 800rpx;

		.fItem {
			display: flex;
			margin: 0 32rpx;
			padding: 26rpx 0 20rpx;
			border-bottom: 2rpx solid #DBDBDB;
			justify-content: space-between;

			.left {
				display: flex;
				flex-direction: column;

				.title {
					font-size: 32rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(48, 49, 51, 1);
					line-height: 44rpx;
				}

				.info {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(144, 147, 153, 1);
					line-height: 34rpx;
					margin-top: 10rpx;
				}

				.right.value {
					font-size: 32rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(48, 49, 51, 1);
					line-height: 44rpx;
				}
			}
		}
	}
</style>
