<template>
	<view class="container">
		
		<view class="card-item">
			<view class="fengmian">
				<view class="content">
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
			
		</view>
		
	</view> 
</template>

<script>
	export default {
		data() {
			return {
				status:0
			};
		}
	}
</script>

<style lang="scss">
    .container{
		height: calc(100vh - 88rpx);
		overflow: hidden;
		background-color: $page-color-base;
	
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
</style>
