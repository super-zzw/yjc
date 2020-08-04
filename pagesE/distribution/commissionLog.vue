<template>
	<view>
		<view class="top">
			<text class="number">-{{totalAmount}}</text>
			<text class="ctxt">累计提现佣金(元)</text>
		</view>
		<view class="content-List">
			<view class="filters">
				
			</view>
			<view class="fList" v-if="dataList.length > 0">
				<view class="fItem" v-for="(item,index) in dataList" :key="index">
					<view class="left">
						<text class="title">{{item.name}}</text>
						<text class="info">{{item.createTime}}</text>
					</view>
					<view class="right">
						<text class="value">-{{item.amount}}</text>
						<text class="result" v-if="item.status == 0">审核中</text>
						<text class="result" v-if="item.status == 1">提现成功</text>
						<text class="result" v-if="item.status == -1">提现失败</text>
					</view>
					
				</view>
			</view>
			<empty v-if="dataList.length == 0 && noMore" :height="'76vh'"></empty>
		</view>
		
		<view v-if="dataList.length > 0 && noMore" class="no_more">
			<text class="no_more_side"></text>
			<text class="no_more_text">没有更多数据了</text>
			<text class="no_more_side"></text>
		</view>
	</view>
</template>

<script>
	import empty from "@/components/empty";
	export default {
		components:{empty},
		data() {
			return {
				dataList:[],
				page:1,
				size:8,
				noMore:false,
				totalAmount:""
			};
		},
		async onLoad() {
			uni.showLoading({
				title:"加载中..."
			})
			await this.getInfo();
			await this.getData();
			uni.hideLoading()
		},
		methods:{
			getInfo(){
				this.$http({
					apiName:"DistributionInfo"
				}).then(res => {
					this.totalAmount = res.data.totalAmountOut;
				}).catch(err => {})
			},
			async getData(){
				this.dataList = [];
				await this.$http({
					apiName:"fxWithdrawList",
					data:{
						page:this.page,
						size:this.size,
					}
				}).then(res => {
					
					this.noMore = !res.data.withdrawList.hasNextPage
					this.dataList = this.dataList.concat(res.data.withdrawList.list)
				}).catch(err => {})
			},
		},
		onReachBottom(){
			if(this.noMore){
				return
			}
			this.page ++;
			this.getData()
		},
		async onPullDownRefresh() {
			this.page = 1;
			this.noMore = false;
			await this.getInfo()
			await this.getData();
			uni.stopPullDownRefresh()
		}
	}
</script>

<style lang="scss" scoped>
    .top{
		text-align: center;
		display: flex;
		flex-direction: column;
		.number{
			margin-top:44rpx;
			font-size:44rpx;
			font-family:PingFangSC-Medium,PingFang SC;
			font-weight:500;
			color:rgba(242,61,61,1);
			line-height:60rpx;
			margin-bottom: 8rpx;
		}
		.ctxt{
			font-size:30rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(48,49,51,1);
			line-height:42rpx;
			margin-bottom: 46rpx;
		}
		.agents{
			margin-top: 44rpx;
			display: flex;
			align-items: center;
			.agentTab{
				flex: 1;
				box-sizing: border-box;
				text{
					font-size:28rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(48,49,51,1);
					line-height: 88rpx;
					display: inline-block;
					height: 88rpx;
				}
			}
			.agentTab text.active{
				border-bottom: 4rpx solid #F23D3D;
			}
			.divider{
				width:2rpx;
				height:30rpx;
				background: #DBDBDB;
			}
		}
	}
	.content-List{
		
	
		// display: flex;
		
		.filters{
			display: flex;
			justify-content: space-between;
		   padding: 20rpx;
					background: #F9FAFB;
				.fTxt{
					font-size:30rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(48,49,51,1);
					
				}
				.iconfont{
					margin-left: 5rpx;
				}
				.iconzidingyishaixuan{
					margin-right: 5rpx;
				}
			
			
		}
		
	}
	.fList{
			margin: 0 32rpx;
			.loadmore{
				border-radius:40rpx;
				border:2rpx solid rgba(242,61,61,1);
				font-size:28rpx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:500;
				color:rgba(242,61,61,1);
				margin-top: 50rpx;
			}
		.fItem{
			display: flex;
		
			padding: 26rpx 0 20rpx;
			border-bottom: 2rpx solid #DBDBDB;
			justify-content: space-between;
			.left{
				display: flex;
				flex-direction: column;
				.title{
					font-size:32rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(48,49,51,1);
					line-height:44rpx;
				}
				.info{
					font-size:24rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(144,147,153,1);
					line-height:34rpx;
					margin-top: 10rpx;
				}
				
			}
			.right{
				display: flex;
				flex-direction: column;
				.value{
					font-size:32rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:500;
					color:rgba(48,49,51,1);
					line-height:44rpx;
				}
				.result{
					font-size:24rpx;
					line-height:48rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:500;
					color:rgba(242,61,61,1);
				}
			}
		}
	}
	
</style>
