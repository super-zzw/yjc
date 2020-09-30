<template>
	<view class="container">
		<view class="navList" >
			<view class="navItem" ><text :class="status==0?'active':''" @tap="getMyCoupon(0)">未使用</text></view>
			<view class="navItem"><text :class="status==1?'active':''" @tap="getMyCoupon(1)">已使用</text></view>
			<view class="navItem" ><text :class="status==-1?'active':''" @tap="getMyCoupon(-1)">已过期/失效</text></view>
		</view>
		<view class="list" v-if="flag">
			<view class="card-item" v-if="datalist.length" v-for="(item,index) in datalist" :key="index">
				<view class="fengmian" :class="status==-1?'':'active'">
					<view class="content" >
						￥<text>{{item.amount}}</text>
					</view>
				</view>
				<view class="main">
					<text class="title">{{item.title}}</text>
					<view class="info">
						<text class="txt">{{item.minConsumption|useMethod}}</text>
					</view>
					<text class="date">{{item.startTime|date}} 至 {{item.endTime|date}} 有效</text>
				</view>
				<image src="../../static/yishiyong.png" mode="" class="tag" v-if="status==1"></image>
				
				<image src="../../static/yiguoqi.png" mode="" class="tag" v-if="status==-1&&item.status==2"></image>
				<image src="../../static/yishixiao.png" mode="" class="tag" v-if="status==-1&&item.status==3"></image>
			</view>
			<view class="nodata" v-if="datalist.length==0">
				<image src="../../static/null.png" mode="widthFix"></image>
				<text>暂无记录</text>
			</view>
			<navigator url="./getCoupons" class="getCoupons" hover-class="none">去领券</navigator>
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
				flag:false
			};
		},
		async onLoad() {
			// this.getMyCoupon(this.status)
		
			
		},
		onShow() {
			this.getMyCoupon(this.status)
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
		methods:{
			 async getMyCoupon(status){
				this.status=status
				uni.showLoading({
					title:'加载中...'
				})
			 await this.$http({
					apiName:'myCoupon',
					data:{
						status:status
					}
				}).then(res=>{
					
					// uni.hideLoading()
				this.datalist= res.data.list
				this.flag=true
				uni.hideLoading()
			}).catch(err=>{})
			
			}
		}
	}
</script>

<style lang="scss">
    .container{
		height: calc(100vh - 88rpx);
		// overflow: hidden;
		background-color: $page-color-base;
		.navList{
			height: 88rpx;
			display: flex;
			background: #fff;
			.navItem{
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				text{
					display: flex;
					line-height: 88rpx;
					font-size:30rpx;
					align-items: center;
					font-family:PingFangSC-Medium,PingFang SC;
					font-weight:600;
					color:rgba(48,49,51,1);
				}	
			}
			.navItem text.active{
				color:$base-color;
				border-bottom: 4rpx solid rgba(242,61,61,1);
				
			}
		}
		.list{
			overflow: scroll;
			.card-item{
					margin:40rpx 32rpx;
					background: #fff;
					height: 200rpx;
					display: flex;
					.fengmian{
						width: 200rpx;
						height: 200rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					background:url(../../static/guoqi.png) ;
					background-size: 100% 100%;
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
				.fengmian.active{
					background:url(../../static/yhq.png) ;
					background-size: 100% 100%;
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
		
	.tag{
		width: 100rpx;
		height: 100rpx;
		}
	.getCoupons{
		
			// width:100%;
			height:80rpx;
			border-radius:40rpx;
			border:2rpx solid rgba(242,61,61,1);
			font-size:28rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:500;
			color:rgba(242,61,61,1);
			display: flex;
			align-items: center;justify-content: center;
			margin:0 32rpx 80rpx;
	}
	.nodata{
		margin: 80rpx 0;
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
	}
</style>
