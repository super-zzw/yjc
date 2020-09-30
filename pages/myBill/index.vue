<template>
	<view>
		<view class="top">
			<view class="left">
				<text class="number">+{{totalAmountIn}}</text>
				<text class="ctxt">累计收入金额(元)</text>
			</view>
			<view class="right">
				<text class="number numberx">-{{totalAmountOut}}</text>
				<text class="ctxt">累计支出金额(元)</text>
			</view>
		</view>
		<view class="content-List">
			<view class="filters">
				<view class="leftFilter">
					<view class="fTxt">
						  <picker @change="bindPickerChange1" :value="index" :range="array1">
						            <text class="uni-input">{{array1[index]}}</text>
									<text class="iconfont iconriqishaixuan"></text>
						  </picker>
						<!-- <text>近7天</text> -->
						
					</view>
				</view>
				<view class="rightFilter">
					<view class="fTxt" @tap="selDate">
						
							 <text class="iconfont iconzidingyishaixuan"></text>
						     <text class="uni-input">{{date}}</text>
						
						
						<!-- <text>自定义筛选</text> -->
					</view>
				</view>
			</view>
			<view class="fList" v-if="dataList.length > 0">
				<view class="fItem" v-for="(item,index) in dataList" :key="index" @tap="toDetail(item.id)">
					<view class="left">
						<text class="tt">{{item.title}}</text>
						<text class="tt">{{item.cardno}}</text>
						<text class="info">{{item.createTime}}</text>
					</view>
					<view class="right">
						<text class="value" v-if="item.type == 0">-{{item.amountStr}}</text>
						<text class="value value1" v-if="item.type == 1">+{{item.amountStr}}</text>
						<text class="result" v-if="item.withdrawStatus == 0">待处理</text>
						<text class="result" v-if="item.withdrawStatus == 1">通过</text>
						<text class="result" v-if="item.withdrawStatus == -1">失败</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="dataList.length > 0 && noMore" class="no_more">
			<text class="no_more_side"></text>
			<text class="no_more_text">没有更多数据了</text>
			<text class="no_more_side"></text>
		</view>
		<empty v-if="dataList.length == 0 && noMore" :height="'75vh'"></empty>
		<datePicker :dateSel="dateSel" @close="colseTime" ref="datapicker"/>
	</view>
</template>

<script>
	import empty from "@/components/empty";
	export default {
		components:{
			empty
		},
		data() {
			return {
				tab:1,
				array1:['昨日','近7天','全部'],
				index:2,
				date:'自定义筛选',
				dateSel:false,
				startTime:'',
				endTime:'',
				dataList:[],
				page:1,
				size:20,
				noMore:false,
				type:"",
				totalAmountOut:"",
				totalAmountIn:"",
				tradeType:[]
			};
		},
		
		async onLoad() {
			// uni.showLoading({
			// 	title:"加载中..."
			// })
			await this.getList(1);
			 this.getInfo()
			
			
			
		},
		methods:{
			async getInfo(){
				
				await this.$http({
					apiName:'getOrderTotal'
				}).then(res=>{
				
					this.totalAmountIn=res.data.shouRuStr
					this.totalAmountOut=res.data.zhiChuStr
				})
			},
			 getList(type){
				
				uni.showLoading({
					title:"加载中..."
				})
				if(type==1){  //筛选或下拉刷新
					this.dataList = [];
					this.page = 1;
					this.noMore = false;
				}
				 this.$http({
					apiName:"getOrderLog",
					data:{
						page:this.page,
						size:this.size,
						timeE:this.endTime,
						timeS:this.startTime,
						type:this.type,
						typeList:this.tradeType
					}
				}).then(res => {
					// if(this.dataList.length>=res.data.total){
					// 	return
					// }
					uni.hideLoading()
					this.noMore = !res.data.hasNextPage
					
					this.dataList = this.dataList.concat(res.data.list)
					
					
				}).catch(err => {})
			},
			async bindPickerChange1(e){
				this.index=e.detail.value;
				this.endTime=''
				this.startTime=''
				this.$refs.datapicker.startTime=''
				
				this.$refs.datapicker.endTime=''
				if(this.index == 0){
					
					this.type = 1;
				}else if(this.index == 1){
					this.type = 7
				}else if(this.index == 2){
					this.type = ""
				}
				
				await this.getList(1)
			},
			selDate(){
				this.dateSel=true
			},
			async colseTime(e){
				this.dateSel = false;
				// if(e && e.startTime && e.endTime){
					this.type='';
					this.startTime = e.startTime;
					this.endTime = e.endTime;
					this.tradeType=e.tradeType
				
					await this.getList(1)
				// }
			},
			toDetail(id){
				uni.navigateTo({
					url:'/pages/myBill/billDetail?id='+id
				})
			},
		},
		
		onReachBottom(){
			if(this.noMore){
				return
			}
			this.page ++;
			this.getList()
		},
		async onPullDownRefresh() {
			
			await this.getInfo();
			await this.getList(1);
			uni.stopPullDownRefresh()
		}
	}
</script>

<style lang="scss" scoped>
    .top{
		text-align: center;
		display: flex;
		// flex-direction: column;
		justify-content: space-around;
		padding-bottom: 46rpx;
		.left,.right{
			display: flex;
			flex-direction: column;
		}
		.number{
			margin-top:44rpx;
			font-size:44rpx;
			font-family:PingFangSC-Medium,PingFang SC;
			font-weight:500;
			color:rgba(242,61,61,1);
			line-height:60rpx;
			margin-bottom: 8rpx;
		}
		.number.numberx{
			color:#303133;
		}
		.ctxt{
			font-size:30rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(48,49,51,1);
			line-height:42rpx;
		}
	
	}
	.content-List{
		
	
		// display: flex;
		
		.filters{
			display: flex;
			justify-content: space-between;
		   padding: 30rpx;
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
		
		.fItem{
			display: flex;
			margin: 0 32rpx;
			padding: 26rpx 0 20rpx;
			border-bottom: 2rpx solid #DBDBDB;
			justify-content: space-between;
			.left{
				display: flex;
				flex-direction: column;
				.tt{
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
					font-weight:600;
					color:rgba(48,49,51,1);
					line-height:44rpx;
				}
				.value1{
					color:rgba(242,61,61,1);
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
	.mask{
		 position: fixed;
		  top: 0;
		  left: 0;
		  width: 100vw;
		  height: 100vh;
		  background:rgba(52,52,52,0.7);
	}
	.datePicker{
		background: #fff;
		height: 0;
		position: fixed;
		left: 0;
		top: 88rpx;
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		overflow: hidden;
		.dateIpt{
			margin: 50rpx 0;
			display: flex;
			
			.Time{
				width:208rpx;
				height:60rpx;
				background:rgba(245,245,245,1);
				border-radius:8rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size:32rpx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(242,61,61,1);
				.iconfont{
					color:#AAA;
					margin-left: 10rpx;
				}
				
			}
			.txt{
				margin: 0 40rpx;
				line-height: 60rpx;
				height: 60rpx;
				font-size:28rpx;
			}
		}
		.picker-item{
			margin: 0 32rpx;
			display: flex;
			justify-content: space-between;
			// width: 100%;
			height: 264rpx;
			.years,.months{
				width: 320rpx;
				flex-direction: column;	
				text-align: center;
			}
			.year-item,.month-item{
					line-height: 88rpx;
			}
		}
	}
	.datePicker.active{
		height: 300rpx;
		transition: .4s;
	}
	input{
		text-align: center;
	}
</style>
