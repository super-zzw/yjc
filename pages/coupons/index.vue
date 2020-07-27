<template>
	<view class="container">
		<view class="navList" >
			<view class="navItem" ><text :class="status==0?'active':''" @tap="status=0">未使用</text></view>
			<view class="navItem"><text :class="status==1?'active':''" @tap="status=1">已使用</text></view>
			<view class="navItem" ><text :class="status==2?'active':''" @tap="status=2">已过期/失效</text></view>
		</view>
		<view class="list">
			<view class="card-item" v-if="!datalist.length">
				<view class="fengmian" :style="{'background':status==2?'url(../../static/guoqi.png)':'url(../../static/yhq.png)','background-size':'100%'}">
					<view class="content" >
						￥<text>1299</text>
					</view>
				</view>
				<view class="main">
					<text class="title">全场通用文文文文文字最全场通用文文文文文字最</text>
					<view class="info">
						<text class="txt">订单满3000使用</text>
						<text class="btn btn1" v-if="status==0">领取</text>
						<!-- <text class="btn btn2">已领取</text> -->
					</view>
					<text class="date">2020.06.06 至 2020.12.05 有效</text>
				</view>
				<image src="../../static/yishiyong.png" mode="" class="tag" v-if="status==1"></image>
				<image src="../../static/yiguoqi.png" mode="" class="tag" v-if="status==2"></image>
			</view>
			<view class="nodata" v-else>
				<image src="../../static/null.png" mode="widthFix"></image>
				<text>暂无记录</text>
			</view>
		</view>
		
		
		
		<navigator url="./getCoupons" class="getCoupons">去领券</navigator>
	</view> 
</template>

<script>
	export default {
		data() {
			return {
				status:0,
				datalist:[]
			};
		}
	}
</script>

<style lang="scss">
    .container{
		height: calc(100vh - 88rpx);
		overflow: hidden;
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
		
		.card-item{
			margin:40rpx 32rpx;
			background: #fff;
		
			height: 200rpx;
			display: flex;
			
			.fengmian{
				width: 200rpx;
				height: 200rpx;
				// position: absolute;
				// left: 0;
				// top: 0;
				// background: url(../../static/yhq.png) no-repeat;
				
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
	.tag{
		width: 100rpx;
		height: 100rpx;
		}
	.getCoupons{
			margin-top: 80rpx;
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
			margin: 0 32rpx;
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
