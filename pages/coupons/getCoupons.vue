<template>
	<view class="container">
		<view class="card-item" v-for="item in datalist" :key="item.id" v-if="datalist.length&&loading">
			<view class="fengmian">
				<view class="content">
					￥<text>{{item.amount}}</text>
				</view>
			</view>
			<view class="main">
				<text class="title">{{item.title}}</text>
				<view class="info">
					<text class="txt">{{item.minConsumption|useMethod}}</text>
					<button class="btn btn1" v-if="!item.wuserFlag" @click="recieve(item.id)" :disabled="isDisable">领取</button>
					<text class="btn btn2" v-else >已领取</text>
				</view>
				<text class="date">{{item.startTime|date}} 至 {{item.endTime|date}} 有效</text>
			</view>
			
		</view>
		<view class="nodata" v-if="datalist.length==0&&loading">
			<image src="../../static/null.png" mode="widthFix"></image>
			<text>暂无记录</text>
		</view>
	</view> 
</template>

<script>
	import utils from '@/utils/method.js'
	export default {
		data() {
			return {
				status:0,
				datalist:[],
				loading:false,
				isDisable:false
			};
		},
		filters:{
			useMethod(data){
				if(data==-1){
					return '无条件使用'
				}else{
					return '订单满'+data+'使用'
				}
			},
			date(data){
				return utils.unixToDatetime(data,9)
			}
		},
		onLoad() {
			uni.showLoading({
				title:'加载中...'
			})
			this.getAllCoupon()
			uni.hideLoading()
		},
		methods:{
			async getAllCoupon(){
				await this.$http({
					apiName:'getAllCoupon',

				}).then(res=>{
					this.loading=true
					this.datalist=res.data.list
				}).catch(err=>{})
			},
			async recieve(id){
				this.isDisable=true
				await this.$http({
					apiName:'receiveCoupon',
					type:'POST',
					data:{
						couponId:id
					}
				}).then(res=>{
				     
					uni.showToast({
						title:'领取成功',
					})
					this.getAllCoupon()
					uni.hideLoading()
				}).catch(err=>{
				})
				setTimeout(()=>{
					this.isDisable=false
				},2000)
				
			}
		}
	}
</script>

<style lang="scss">
    .container{
		height: calc(100vh - 88rpx);
		// overflow: hidden;
		background-color: $page-color-base;
	
		.card-item{
			margin:40rpx 32rpx;
			background: #fff;
		
			height: 200rpx;
			display: flex;
			
			.fengmian{
				width: 200rpx;
				height: 200rpx;
				background: url(../../static/yhq.png) no-repeat;
				background-size: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				.content{
					font-size:28rpx;
					font-family:PingFangSC-Semibold,PingFang SC;
					font-weight:600;
					color:rgba(255,255,255,1);
					display: flex;
					align-items: flex-end;
					
					text{
						font-size:52rpx;
						line-height: 58rpx;
					}
				}
			
		}
		.main{
			flex: 1;
			margin: 0 10rpx 0 30rpx;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			.title{
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				font-size:32rpx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:500;
				color:rgba(48,49,51,1);
				width: 100%;
			}
			.info{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.txt{
					font-size:28rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(168,171,179,1);
				}
				.btn{
					border-radius:22rpx;
					
					padding: 0 18rpx;
					line-height: 44rpx;
					font-size:28rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					
				}
				.btn1{
					border:2rpx solid rgba(242,61,61,1);
					color:rgba(242,61,61,1);
				}
				.btn2{
					border:2rpx solid rgba(144,147,153,1);
					color:rgba(144,147,153,1);
				}
			}
			.date{
				font-size:24rpx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(168,171,179,1);
			}
		}
	}
	
	
	}
	.nodata{
		padding: 200rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		image{
			width: 164rpx;
			margin-bottom: 26rpx;
		}
		text{
			font-size:28rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(144,147,153,1);
		}
	}
	button{
		height: auto;
		margin: 0;
	}
</style>
