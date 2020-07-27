<template>
	<view>
		<view class="mask" v-if="dateSel" @tap.stop="close"></view>
		<view class="datePicker" :class="dateSel?'active':''" >
			<view class="dateIpt">
				
				<view class="startTime Time">
					<picker mode="date"   @change="bindDateChange2" fields="month">
					<!-- 	<text>{{startTime}}</text>
						<text class="iconfont iconzidingyishaixuan-shijianshaixuan"></text> -->
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
		    <button type="default" @tap="close">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				startTime:'',
				endTime:''
			};
		},
		props:{
			dateSel:{
				default:false
			}
		},
		methods:{
			close(){
				// console.log(this.$parent.dateSel)
				// this.$parent.dateSel=false
				this.$emit('close')
			},
			bindDateChange2(e){
				this.startTime=e.detail.value
			},
			bindDateChange3(e){
				this.endTime=e.detail.value
			}
		}
	}
</script>

<style lang="scss" scoped>
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
