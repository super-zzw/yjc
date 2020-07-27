<template>
	<view>
		<view class="top">
			<view class="left">
				<text class="number">-1260</text>
				<text class="ctxt">累计提现佣金(元)</text>
			</view>
			<view class="right">
				<text class="number">+2300</text>
				<text class="ctxt">累计佣金收入(元)</text>
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
			<view class="fList">
				<view class="fItem">
					<view class="left">
						<text class="title">_JungYumi业绩收入</text>
						<text class="info">TA在2020.02.03加入你的三级代理团队</text>
					</view>
					<view class="right">
						<text class="value">-168</text>
						<text class="result">审核中</text>
					</view>
				</view>
			</view>
		</view>
		<datePicker :dateSel="dateSel" @close="dateSel=false"/>
		<!-- <view class="mask" v-if="dateSel" @tap.stop="dateSel=false"></view>
		<view class="datePicker" :class="dateSel?'active':''" >
			<view class="dateIpt">
				
				<view class="startTime Time">
					<picker mode="date"   @change="bindDateChange2" fields="month">
				
						<input type="text" v-model="startTime" disabled placeholder-class="placeholder" placeholder="起始日期"/>
					</picker>
				</view>
				<text class="txt">至</text>
				<view class="endTime Time">
					<picker mode="date"  @change="bindDateChange3" fields="month">
					    <input type="text" v-model="endTime" disabled placeholder-class="placeholder" placeholder="结束日期"/>
					</picker>
				</view>
			</view>
		    <button type="default">确定</button>
			
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tab:2,
				array1:['昨日','近7天','全部'],
				index:2,
				date:'自定义筛选',
				dateSel:false,
				startTime:'',
				endTime:''
			};
		},
		onLoad() {
			// this.startTime=this.endTime=new Date().getFullYear()+'.'+ (new Date().getMonth()+1)
			// this.getDate()
		},
		methods:{
			bindPickerChange1(e){
				console.log(e)
				this.index=e.detail.value
			},
			selDate(){
				this.dateSel=true
			},
			getDate(){
				let year = new Date().getFullYear();
				let month =new Date().getMonth() + 1;
				month=month<10?'0'+month:month,
				this.startTime=this.endTime=year+'.'+month
			}, 
			// bindDateChange2(e){
			// 	this.startTime=e.detail.value
			// },
			// bindDateChange3(e){
			// 	this.endTime=e.detail.value
			// }
			
		},
		
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
		height: 800rpx;
		.fItem{
			display: flex;
			margin: 0 32rpx;
			padding: 26rpx 0 20rpx;
			border-bottom: 2rpx solid #DBDBDB;
			justify-content: space-between;
			.left{
				display: flex;
				flex-direction: column;
				.title{
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
					font-weight:500;
					color:rgba(48,49,51,1);
					line-height:44rpx;
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
