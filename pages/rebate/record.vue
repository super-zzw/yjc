<template>
	<view class="content">
		<view class="top flex justify-between">
			<view class="top-left flex">
				<view class="icon flex align-items justify-center">
					<text class="iconfont iconyichenggongyaoqinghaoyoushuicon-yaoqingjiluye"></text>
				</view>
				<view class="top-left-text flex flex-column justify-between">
					<text class="number">108</text>
					<text class="tips">已成功邀请好友数</text>
				</view>
			</view>
			<view class="top-left flex">
				<view class="icon two flex align-items justify-center">
					<text class="iconfont iconyixiadanhaoyoushuicon-yaoqingjiluye"></text>
				</view>
				<view class="top-left-text flex flex-column justify-between">
					<text class="number">108</text>
					<text class="tips">已下单好友数</text>
				</view>
			</view>
		</view>
		<view class="item"></view>
		<view class="botBlock">
			<view class="botBlock-row flex">
				<view class="botBlock-col" v-for="item in textArr" :key="item.id">{{item}}</view>
			</view>
			<view class="botBlock-table">
				<view class="botBlock-tr flex" v-for="list in dataList" :key="list.id">
					<view class="botBlock-td flex flex-column justify-center align-items">
						<text class="tel">{{list.mobile}}</text>
						<text class="time">{{list.createTime}} </text>
					</view>
					<view class="botBlock-td flex align-items justify-center">
						<text class="money">¥{{list.orderAmount}}</text>
					</view>
					<view class="botBlock-td flex align-items justify-center">
						<text class="date">{{list.createTime}}</text>
					</view>
					<view class="botBlock-td flex align-items justify-center">
						<text class="money">{{list.rebateAmount}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Utils from "../../utils/method.js"
	export default{
		data(){
			return{
				textArr:['我的好友','订单金额','订单时间','返利金额'],
				dataList:[],
				peoples:{}
			}
		},
		onLoad() {
			this.getList();
			this.getPeople();
		},
		methods:{
			async getList(){
				try{
					const res = await this.$http({
						apiName: "getMyRebateList"
					});
					res.data.forEach(item => {
						item['mobile'] = item['mobile'].substring(0,3)+"****"+item['mobile'].substring(7);
						item['createTime'] = Utils.unixToDatetime(item['createTime']).split(" ")[0];
					})
					this.dataList = res.data;
					console.log(this.dataList);
				}catch(e){
					
				}
			},
			async getPeople(){
				try{
					const res = await this.$http({
						apiName: "getInvite"
					});
					console.log(res);
				}catch(e){
					console.log(e)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #F9FAFB;
	}
	.top{
		background-color: #ffffff;
		padding: 30rpx 32rpx 30rpx 40rpx;
		.top-left{
			height: 80rpx;
			.icon{
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				background-color: #FFEECB;
				&.two{background-color: #CBFFD3;  .iconfont{ color: rgb(30, 234, 60);}}
				.iconfont{
					color: rgb(255, 170, 0);
					font-size: 40rpx;
				}
			}
			.top-left-text{
				margin-left: 20rpx;
				.number{font-size: 40rpx;color: #F23D3D;font-weight: bold;line-height: 48rpx;}
				.tips{line-height: 40rpx;font-size: 28rpx;}
			}
		}
	}
	.item{
		background-color: #F23D3D;
		width: 720rpx;
		height: 32rpx;
		border-radius: 16rpx;
		margin: 40rpx auto 0;
	}
	.botBlock{
		width: 686rpx;
		height: 962rpx;
		box-shadow:0px 4rpx 20rpx 0px rgba(255,158,158,0.2);
		background-color: #FFFFFF;
		margin: 0 auto;
		position: relative;
		top: - 12rpx;
		padding: 0 22rpx;
		overflow: hidden;
		.botBlock-row{margin-top: 46rpx;}
		.botBlock-col{
			padding: 16rpx 23rpx;
			font-size: 28rpx;
			color: #FFFFFF;
			background: #F23D3D;
			margin-right: 2rpx;
			flex-basis: 24.9%;
		}
		.botBlock-table{
			.botBlock-tr{font-size: 24rpx; color:#606266;height: 86rpx;background-color: #F6F2F2;margin-bottom: 2rpx;
			.time{font-size: 18rpx; color:#BCC0C8}
			&:nth-of-type(odd){
				background-color: #FCFAFA;
			}
			}
			.botBlock-td{flex-basis: 25%;}
		}
	}
	.botBlock::after{
		content: "";
		position: absolute;
		top: 0;
		width: 100%;
		height: 12rpx;
		background: rgba(242,61,61,.2);
		filter: blur(4px);
	}
</style>
