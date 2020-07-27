<template>
	<view class="container">
		<view class="topBox">
			<view class="row1">
				<view class="left">
					<text class="cText1">累计佣金(元)</text>
					<text class="value">288.35</text>
				</view>
				<view class="right" @tap="toNav('cashOut')">
					提现佣金
				</view>
			</view>
			<view class="row2">
				<view class="column L1">
					<text class="money">288.00</text>
					<text class="tip">可提现佣金(元)</text>
				</view>
				<view class="column L2">
					<text class="money">20.00</text>
					<text class="tip">待入账(元)</text>
				</view>
				<view class="column L3">
					<text class="money">0.35</text>
					<text class="tip">冻结佣金(元)</text>
				</view>
			</view>
		</view>
		<view class="section-list">
			<view class="section" v-for="item in list" :key="item.id" @tap="toNav(item.nav)">
				<view class="left">
					<!-- <image :src="imgsrc(item.id)" mode=""></image> -->
					<image :src="require('../image/icon'+item.id+'.png')" mode=""></image>
					<text class="title">{{item.title}}</text>
				</view>
				<view class="right">
					<text class="iconfont iconchakanquanbu"></text>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{id:1,title:'推广赚佣金',nav:'posters'},
					{id:2,title:'我的下属团队',nav:'myTeam'},
					{id:3,title:'我的直推客户',nav:'myClient'},
					{id:4,title:'我的佣金明细',nav:'commissionDetail'},
					{id:5,title:'佣金提现记录',nav:'commissionLog'},
					// {icon:'iconyongjintixianzhanghuguanli',title:'佣金提现账户管理'},
				]
			};
		},
		methods:{
			toNav(nav){
				console.log(nav)
				uni.navigateTo({
					url:'/pagesE/distribution/'+nav
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		background: #F9FAFB;
		height: 100vh;
	}
  .topBox{
	  background: url(../../static/background.png);
	  height: 340rpx;
	  display: flex;
	 flex-direction: column;
	 padding:50rpx 0 30rpx ;
	  justify-content: space-between;
	  .row1{
		  width: 100%;
		  display: flex;
		  padding:0 50rpx ;
		   justify-content: space-between;
		  .left{
			  display: flex;
			  flex-direction: column;
			  .cText1{
				  font-size:28rpx;
				  font-weight:400;
				  color: #fff;
			  }
			  .value{
				  font-size:52rpx;
				  font-family:PingFangSC-Semibold,PingFang SC;
				  font-weight:600;
				  color:rgba(255,255,255,1);
				  line-height:74rpx;
			  }
		  }
		  .right{
			 width:206rpx;
			 height:70rpx;
			 background:rgba(255,255,255,1);
			 border-radius:35rpx;
			 font-size:32rpx;
			 font-family:PingFangSC-Medium,PingFang SC;
			 font-weight:600;
			 color:rgba(242,61,61,1);
			 line-height: 70rpx;
			 text-align: center;
		  }
	  }
	  .row2{
		  width: 100%;
		  display: flex;
		  .column{
			  flex: 1;
			  display: flex;
			  flex-direction: column;
			  padding-left: 40rpx;
			  border-right: 2rpx solid #FF7474;
			  .money{
				  font-size:36rpx;
				  font-family:PingFangSC-Medium,PingFang SC;
				  font-weight:500;
				  color:rgba(255,255,255,1);
				  
			  }
			  .tip{
				  font-size:24rpx;
				  font-family:PingFangSC-Regular,PingFang SC;
				  font-weight:400;
				  color:rgba(255,185,185,1);
			  }
		  }
		  .column:last-child{
			  border-right: none;
		  }
	  }
  }
  .section-list{
	  padding-top: 42rpx;
	  background: #fff;
	  .section{
		  display: flex;
		  justify-content: space-between;
		  flex-direction: row;
		  height: 90rpx;
		  align-items: center;
		  margin: 0 32rpx;
		  border-bottom: 2rpx solid #F2F3F6;
		  .left{
			  display: flex;
			    flex-direction: row;
			  align-items: center;
			  image{
				 width: 48rpx;
				 height: 48rpx;
				  margin-right: 18rpx;
				 
			  }
			  .title{
				  font-size:28rpx;
				  color: #303133;
			  }
		  }
		  .right{
			
			  width: 36rpx;
			  height: 100%;
			  display: flex;
			   justify-content: flex-end;
			  align-items: center;
			  .iconfont{
				    font-size: 12rpx;
			  }
		  }
	  }
	  .section:last-child{
		  border-bottom: none;
	  }
  }
</style>
