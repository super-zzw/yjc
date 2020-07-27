<template>
	<view>
		<view class="top">
			<text class="number">159</text>
			<text class="ctxt">我的下属代理人数(人)</text>
			<view class="agents">
				<view class="agentTab ">
					<text @tap="tab=1" :class="tab==1?'active':''">一级代理</text>
				</view>
				<text class="divider"></text>
				<view class="agentTab">
					<text :class="tab==2?'active':''" @tap="tab=2">二级代理</text>
				</view>
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
						<text class="value">+20</text>
					</view>
				</view>
			</view>
		</view>
		<datePicker :dateSel="dateSel" @close="dateSel=false"/>
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
			}
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
				.right.value{
					font-size:32rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(48,49,51,1);
					line-height:44rpx;
				}
			}
		}
	}
	
</style>
