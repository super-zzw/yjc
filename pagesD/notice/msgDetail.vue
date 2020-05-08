<template>
	<view class="sWrap">
		<view class="asdtitle">{{title}}</view>
		<view class="asdtime">
			<text>{{time | dealTime}}</text>
			<text v-if="orderId" class="asdtimebtn" @tap="toDetail()">查看详情</text>
		</view>
		<view class="asdcont">
			<rich-text :nodes="content"></rich-text>
		</view>
	</view>
</template>

<script>
import utils from '@/utils/method.js'
export default{
	data(){
		return {
			title:"",
			time:"",
			content:"",
			id:"",
			orderId:null
		}
	},
	methods:{
		getData(){
			this.$http({
				apiName:"msgDetail",
				data:{id:this.id}
			}).then(res => {
				this.title = res.data.title
				this.time = res.data.createTime
				this.content = res.data.content.replace(/\<img/gi, '<img class="cont_img" ');
				this.orderId = res.data.orderId || null
			}).catch(_ => {})
		},
		toDetail(){
			uni.navigateTo({
				url:"/pages/order/orderDetail?id=" + this.orderId
			})
		},
	},
	filters:{
		dealTime(val){
			return utils.unixToDatetime(val) || ""
		}
	},
	onLoad(opt) {
		this.id = opt.id
		this.getData()
		this.$getMsgNms()
	}
}
</script>

<style lang="scss" scoped>
.sWrap{
	padding: 32rpx;
	min-height: 100vh;
	box-sizing: border-box;
	background-color: #F9FAFB;
	.asdtitle{
		text-align: center;
		color: #303133;
		font-size: 32rpx;
	}
	.asdtime{
		margin-top: 20rpx;
		color: #909399;
		font-size: 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.asdtimebtn{
			color: #4399fc;
		}
	}
	.asdcont{
		margin-top: 20rpx;
		font-size: 28rpx;
	}
}
</style>
