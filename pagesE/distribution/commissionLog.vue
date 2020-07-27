<template>
	<view>
		<view class="top">
			<text class="number">-1260</text>
			<text class="ctxt">累计提现佣金(元)</text>
		</view>
		<view class="content-List">
			<view class="filters">
				
			</view>
			<view class="fList">
				<view class="fItem">
					<view class="left">
						<text class="title">提现</text>
						<text class="info">2019.12.23 10:00</text>
					</view>
					<view class="right">
						<text class="value">-88</text>
						<text class="result">审核中</text>
					</view>
					
				</view>
				<button type="default" hover-class="none" class="loadmore" @tap="loadmore">加载更多</button>
			</view>
		</view>
		<datePicker :dateSel="dateSel" @close="dateSel=false" />
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
			this.getDate()
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
			loadmore(){}
			//   getDate(type) {
			//             const date = new Date();
			//             let year = date.getFullYear();
			//             let month = date.getMonth() + 1;
			//             // let day = date.getDate();
			
			//             if (type === 'start') {
			//                 year = year - 60;
			//             } else if (type === 'end') {
			//                 year = year + 2;
			//             }
			//             month = month > 9 ? month : '0' + month;;
			//             // day = day > 9 ? day : '0' + day;
			//             return `${year}-${month}`;
			//         },
			// 		   bindDateChange: function(e) {
			// 		            this.date = e.target.value
			// 		   },
		},
		  computed: {
		        startDate() {
		            return this.getDate('start');
		        },
		        endDate() {
		            return this.getDate('end');
		        }
		    },
	}
</script>

<style lang="scss" scoped>
    .top{
		text-align: center;
		display: flex;
		flex-direction: column;
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
			margin-bottom: 46rpx;
		}
		.agents{
			margin-top: 44rpx;
			display: flex;
			align-items: center;
			.agentTab{
				flex: 1;
				box-sizing: border-box;
				text{
					font-size:28rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(48,49,51,1);
					line-height: 88rpx;
					display: inline-block;
					height: 88rpx;
				}
			}
			.agentTab text.active{
				border-bottom: 4rpx solid #F23D3D;
			}
			.divider{
				width:2rpx;
				height:30rpx;
				background: #DBDBDB;
			}
		}
	}
	.content-List{
		
	
		// display: flex;
		
		.filters{
			display: flex;
			justify-content: space-between;
		   padding: 20rpx;
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
			margin: 0 32rpx;
			.loadmore{
				border-radius:40rpx;
				border:2rpx solid rgba(242,61,61,1);
				font-size:28rpx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:500;
				color:rgba(242,61,61,1);
				margin-top: 50rpx;
			}
		.fItem{
			display: flex;
		
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
	
</style>
