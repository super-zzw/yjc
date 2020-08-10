<template>
	<view>
		<view class="top0 top" v-if="type==0">
			<text class="money">¥2020.00</text>
			<text class="desc">账户余额</text>
			<text class="desc1">（包含物质福利金¥203.00，不可提现）</text>
		</view>
		<view class="top1 top" v-if="type==1">
			<text class="money">¥2020.00</text>
			<text class="desc">聚财卡余额</text>
		</view>
		<view class="s-item">
			<view class="wrap" @tap="navTo('/pages/account/cashOut?type=')">
				<view class="left">
					<i class="iconfont icontixian" :style="{color:type==0?'#F23F3F':'#FFA31A'}"></i>
					<text class="txt">提现</text>
				</view>
				<i class="iconfont iconchakanquanbu"></i>
			</view>
			
		</view>
		<view class="s-item">
			<view class="wrap" @tap="navTo('/pages/account/transfer?type=')">
			<view class="left">
				<i class="iconfont iconzhuanzhang" :style="{color:type==0?'#F23F3F':'#FFA31A'}"></i>
				<text class="txt">转账</text>
			</view>
			<i class="iconfont iconchakanquanbu"></i>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:0
			};
		},
		onLoad(opt) {
			console.log(opt)
			this.type=opt.type
			if(opt.type==1){
				uni.setNavigationBarTitle({
					title:'我的聚财卡'
				});
			}
		},
		methods:{
			navTo(url){
				if(this.type==0){
					uni.navigateTo({
						url:url+2
					})
				}else{
					uni.navigateTo({
						url:url+3
					})
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: #F9FAFB
	}
   .top{
	  
	   background-size:100% 100%;
	   height: 380rpx;
	   display: flex;
	   flex-direction: column;
	   align-items: center;
	   .money{
		   font-size:48rpx;
		   font-weight:600;
		   color:rgba(255,255,255,1);
		   margin-top: 120rpx;
		}
		.desc{
			font-size:28rpx;
			font-weight:400;
			color:#FFDEDE;
			margin-top: 10rpx;
			justify-content: center;
		}
		.desc1{
	      margin-top: 20rpx;
		  font-size:28rpx;
		  font-weight:400;
		  color:rgba(255,185,185,1);
		}
   }
   .top0{
	   background: url(../../static/myaccount.png);
   }
   .top1{
	   background: url(../../static/jucaika.png);
   }
   .s-item{
	   background: #fff;
	  
	   padding: 0 32rpx;
	  
	   .wrap{
		    border-bottom: 2rpx solid #DBDBDB;
			display: flex;
			justify-content: space-between;
			  align-items: center;
			  height: 100rpx;
	   }
	   .left{
	      display: flex;
		  align-items: center;
		  width: 100%;
		   .txt{
			  font-size:30rpx;
			  font-weight:500;
			  color:rgba(48,49,51,1); 
		   }
	   }
	   .iconfont{
		   // color:#FFA31A ;
		   font-size: 48rpx;
		   margin-right: 15rpx;
	   }
	   .iconchakanquanbu{
		   color: #A8ABB3;
		   font-size: 28rpx;
	   }
   }
     .s-item:last-child .wrap{
	   border-bottom: none;
   }
</style>
