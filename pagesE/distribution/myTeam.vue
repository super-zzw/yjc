<template>
	<view>
		<view class="top">
			<text class="number">{{teamNum}}</text>
			<text class="ctxt">我的下属代理人数(人)</text>
			<view class="agents">
				<view class="agentTab ">
					<text @tap="changeTab(1)" :class="tab==1?'active':''">一级代理</text>
				</view>
				<text class="divider"></text>
				<view class="agentTab">
					<text :class="tab==2?'active':''" @tap="changeTab(2)">二级代理</text>
				</view>
			</view>
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
			<view class="fList">
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
		</view>
		<datePicker :dateSel="dateSel" @close="colseTime" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tab: 1,
				array1: ['昨日', '近7天', '全部',],
				index: 1,
				date: '自定义筛选',
				dateSel: false,
				startTime: '',
				endTime: '',
				type:7,
				list:[],
				teamNum:""
			};
		},
		async onLoad() {
			this.getInfo();
			await this.getData();
		},
		methods: {
			changeTab(tab){
				if(tab == this.tab){return}else{this.tab = tab;this.getData()}
			},
			async getInfo(){
				await this.$http({
					apiName:"DistributionInfo"
				}).then(res => {
					this.teamNum = res.data.teamNum;
				}).catch(err => {})
			},
			async getData(){
				uni.showLoading({
					title:"加载中..."
				})
				let _api = "fxTeamOne";
				if(this.tab == 2){
					_api = "fxTeamTwo"
				}
				await this.$http({
					apiName:_api,
					data:{
						type:this.type,
						timeE:this.endTime,
						timeS:this.startTime
					}
				}).then(res => {
					this.list = res.data
				}).catch(err => {});
				uni.hideLoading()
			},
			async bindPickerChange1(e) {
				this.index = e.detail.value;
				if(this.index == 0){
					this.type = 1;
				}else if(this.index == 1){
					this.type = 7
				}else if(this.index == 2){
					this.type = ""
				}
				await this.getData()
			},
			selDate() {
				this.dateSel = true
			},
			async colseTime(e){
				this.dateSel = false;
				this.startTime = e.startTime;
				this.endTime = e.endTime;
				await this.getData()
			}
		},
		async onPullDownRefresh() {
			await this.getData();
			uni.stopPullDownRefresh()
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		text-align: center;
		display: flex;
		flex-direction: column;

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
