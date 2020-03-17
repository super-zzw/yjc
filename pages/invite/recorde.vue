<template>
	<view class="sWrap">
		<view class="sir-top">
			<view class="sir-top-left">
				<view class="sirtl-text1">{{nums}}</view>
				<view class="sirtl-text2">已邀请好友</view>
				<view class="sirtl-text1">{{total}}</view>
				<view class="sirtl-text2">累计获得奖励积分</view>
			</view>
			<image class="sir-gold" src="/static/gold.png" mode="widthFix"></image>
		</view>
		<view class="sir-gang"></view>
		<view class="sir-cont">
			<view class="sir-cbox" v-if="dataList.length > 0">
				<view class="sir-title">
					<view class="sirt-cell1">我的好友</view>
					<view class="sirt-cell1">注册时间</view>
					<view class="sirt-cell3">奖励积分</view>
				</view>
				<view class="sir-title sir-items" v-for="(item,index) in dataList" :key="index">
					<view class="sirt-cell1 sirt-cell0">{{item.phone}}</view>
					<view class="sirt-cell1 sirt-cell0">{{item.createTime | dealTime}}</view>
					<view class="sirt-cell3">{{item.integration}}</view>
				</view>
			</view>
			<view class="sir-cbox sir-cbox2" v-else>
				暂无邀请数据
			</view>
		</view>
	</view>
</template>

<script>
import utils from '@/utils/method.js'
export default{
	data(){
		return {
			nums:0,
			total:0,
			dataList:[]
		}
	},
	methods:{
		async getData(){
			this.$http({
				apiName:"getInvite"
			}).then(res => {
				this.dataList = res.data
				this.nums = this.dataList.length
				for (let s of this.dataList) {
					this.total = this.total + s.integration
				}
			}).catch(_ => {})
		}
	},
	filters:{
		dealTime(val){
			return utils.unixToDatetime(val) || ""
		}
	},
	onLoad(){
		this.getData()
	}
}
</script>

<style lang="scss" scoped>
	.sWrap{
		min-height: 100vh;
		background-color: #F23D3D;
		padding: 16rpx;
		.sir-top{
			padding: 24rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.sir-top-left{
				color: #fff;
				.sirtl-text1{
					font-size: 40rpx;
					font-weight: bold;
				}
				.sirtl-text2{
					color: #FED4D4;
					font-size: 28rpx;
					margin-bottom: 30rpx;
				}
			}
			.sir-gold{
				width: 400rpx;
			}
		}
		.sir-gang{
			width: 100%;
			background-color: #FC8A8A;
			height: 32rpx;
			border-radius: 16rpx;
		}
		.sir-cont{
			margin-top: -16rpx;
			padding-left: 16rpx;
			padding-right: 16rpx;
			.sir-cbox{
				background-color: #fff;
				padding: 46rpx 20rpx;
				.sir-title{
					background-color: #FFE1E1;
					display: flex;
					line-height: 72rpx;
					color: #303133;
					font-size: 28rpx;
					.sirt-cell1{
						width: 35%;
						text-align: center;
						border-right: 4rpx solid #fff;
						box-sizing: border-box;
					}
					.sirt-cell3{
						flex: 1;
						text-align: center;
					}
				}
				.sir-items{
					font-size: 24rpx;
					color: #606266;
					border-bottom: 2rpx solid #fff;
					.sirt-cell0{
						border: none;
					}
				}
				.sir-items:nth-child(odd){
					background-color: #FCFAFA;
				}
				.sir-items:nth-child(even){
					background-color: #F6F2F2;
				}
				.sir-items:last-child{
					border-bottom: none;
				}
			}
			.sir-cbox2{
				text-align: center;
			}
		}
	}
</style>
