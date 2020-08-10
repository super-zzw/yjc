<template>
	<view class="container">
		<view class="sBox">
			<view class="sItem"  >
				 <image src="../../static/guoqi.png" mode="" class="image"></image>
				 <view class="info">
					 <text class="title" @tap="toDetail">一项企业服务的名字，文字做两行的长度限制…</text>
					 <view class="opt">
						 <text class="s-price">¥600</text>
						<nunSelect price="600" @changeValue="calcSum"></nunSelect>
					 </view>
				 </view>
				 
			</view>
			
		</view>
		<view class="bottomBar">
			<view class="left">
				实付款 <text class="price">¥{{sum}}</text>
			</view>
			<view class="right" @tap="handleSubmit">提交订单</view>
		</view>
		
		<view class="mask" v-if="sModal" @click.stop="sModal=false"></view>
		<view  :class="sModal?'active tipBox':'tipBox'">
			<text class="txt1">提示</text>
			<text class="txt2 mt">您本次购买的服务金额共计¥{{sum}}</text>
			<text class="txt2">是否进行提交？</text>
			<view class="btns">
				<view class="cancel btn" @tap="sModal=false">取消</view>
				<view class="submit btn" @tap="submitOK">提交</view>
			</view>
		</view>
	</view>
</template>

<script>
	import nunSelect from '../../components/numSelect.vue'
	export default {
		components:{nunSelect},
		data() {
			return {
				sum:0,
				list:[],
				sModal:false
			};
		},
		methods:{
			calcSum(value){
				this.sum+=Number(value) 
			},
			toDetail(){
				uni.navigateTo({
					url:'./detail'
				})
			},
			handleSubmit(){
				if(!this.sum){
					uni.showToast({
						title:'请至少选择一项服务',
						icon:'none'
					})
				}else{
					this.sModal=true
				}
			},
			submitOK(){
				uni.redirectTo({
					url:'./successTip'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		display: flex;
		flex-direction: column;
		height:calc(100vh - 88rpx);
		flex-flow: column;
		padding:0 40rpx;
	}
	.sBox{
		display: flex;
		flex-direction: column;
		height: calc(100% - 100rpx);
		overflow-y: scroll;
		
		.sItem{
			padding-top: 40rpx;
			padding-bottom: 40rpx;
            display: flex;
			justify-content: space-between;
			border-bottom: 2rpx solid #DBDBDB;
			.image{
				width: 180rpx;
				height: 180rpx;
			}
			.info{
				margin-left:30rpx;
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}
			.title{
				font-size:32rpx;
				font-weight:600;
				color:rgba(48,49,51,1);
				line-height:44rpx;
				overflow: hidden;
				width: 400rpx;
				// text-overflow:ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}
			.opt{
				display: flex;
				justify-content: space-between;
				.s-price{
					font-size:36rpx;
					font-weight:600;
					color:rgba(242,61,61,1);
				}
				
		}
	}
	}
   .bottomBar{
	   position: fixed;
	   left: 0;
	   bottom: 0;
	   height: 100rpx;
	   display: flex;
	   width: 100%;
	   border-top: 4rpx solid #ebebeb;
	   .left{
		   display: flex;
		
		   align-items: center;
		   padding-left: 32rpx;
		   font-size:32rpx;
		   font-weight:500;
		   color:#717376;
		   flex: 1;
		   .price{
			   font-size:32rpx;
			   font-weight:600;
			   color:rgba(242,61,61,1);
			   display: inline-block;
			   margin-left: 10rpx;
		   }
	   }
	   .right{
		   width: 300rpx;
		   background: #fa4269;
		   display: flex;
		   justify-content: center;
		   align-items: center;
		   color: #fff;
	   }
   }
   .tipBox{
   	background: #fff;
   	position: fixed;
   	left: 0;
   	bottom: 0;
   	width: 100%;
   	display: flex;
   	align-items: center;
   	flex-direction: column;
   	padding: 0 75rpx;
   	z-index: 101;
	height: 0;
   	.txt1{
   		margin-top:38rpx;
   		font-size:32rpx;
   		font-family:PingFangSC-Medium,PingFang SC;
   		font-weight:600;
   		color:rgba(48,49,51,1);
   	}
	
		
	.txt2{
		font-size:32rpx;
		font-weight:500;
		color:rgba(48,49,51,1);
		margin-top: 16rpx;
	}
	.mt{
		margin-top: 58rpx;
	}
   .btns{
	   margin-top: 58rpx;
	   display: flex;
	   justify-content: space-around;
	   width: 100%;
	   .btn{
		   width:264rpx;
		   height:56rpx;
		   border-radius:28rpx;
		   font-size:26rpx;
		   font-weight:500;
		   display: flex;
		   justify-content: center;
		   align-items: center;
	   }
	   .cancel{
		   border:2rpx solid rgba(242,61,61,1);
		   color: #F23D3D;
	   }
	   .submit{
		   background: #F23D3D;
		   color: #fff;
	   }
   }
   }
   .tipBox.active{
	   height: 400rpx;
	   transition: all .3s;
   }
</style>
