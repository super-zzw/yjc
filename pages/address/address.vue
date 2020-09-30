<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in dataList" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="index == 0" class="tag">默认</text>
					<text class="address">{{item.province}}{{item.city}}{{item.region}}{{item.detailAddress}}</text>
				</view>
				<view class="u-box">
					<text class="name">{{item.name}}</text>
					<text class="mobile">{{item.phoneNumber}}</text>
				</view>
			</view>
			<text class="iconfont iconbianji" @click.stop="toEdit(item.id)"></text>
		</view>
		<view class="dsaw1weq" v-if="dataList.length == 0 && noMore">
			<image src="https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/nomsg.png" class="emsdds" mode=""></image>
			<view class="dsadwqtext">暂无收货地址，请点击新增地址</view>
		</view>
		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
	import {
	   mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				dataList:[],
				page:1,
				size:8,
				dataLoading:false,  //是否是在加载数据
				noMore:false,
				source: 0,
				score:""
			}
		},
		onLoad(option){
			console.log(option.source);
			this.source = option.source;
			this.score = option.score
		},
		async onShow() {
			this.dataList = []
			this.getAddr()
		},
		methods: {
			...mapMutations(['setSelectAddr']),
			async getAddr(){
				uni.showLoading({
					title:'加载中...'
				})
				await this.$http({
					apiName:"addrList",
					data:{
						page:this.page,
						size:this.size
					}
				}).then(res => {
					uni.hideLoading()
					this.noMore = !res.data.hasNextPage
					this.dataList = this.dataList.concat(res.data.list)
					if(this.dataList == 0){
						this.setSelectAddr(null)
					}
				}).catch(_ => {})
			},
			toEdit(id){
				uni.navigateTo({
					url: `/pages/address/addressManage?id=${id}&source=${this.source}&score=${this.score}`
				})
			},
			
			
			//选择地址
			checkAddress(item){
				if(this.source == 1 || this.source == 3){
					this.setSelectAddr(item)
					uni.navigateBack()
				}
			},
			addAddress(type, item){
				uni.navigateTo({
					url: `/pages/address/addressManage?source=${this.source}&score=${this.score}`
				})
			},
			// //添加或修改成功之后回调
			// refreshList(data, type){
			// 	//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
			// 	this.addressList.unshift(data);
				
			// 	console.log(data, type);
			// }
		},
		//下拉刷新
		async onPullDownRefresh(){
			this.dataList = [];
			this.page = 1;
			await this.getAddr()
			uni.stopPullDownRefresh();
			uni.showToast({
				title: '刷新成功'
			})
		},
		//触底加载更多
		onReachBottom(){
			if(this.noMore){
				return
			}
			this.page ++;
			this.getAddr()
		},
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120rpx;
	}
	.dsaw1weq{
		text-align: center;
		.emsdds{
			margin-top: 300rpx;
			width: 312rpx;
			height: 260rpx;
		}
		.dsadwqtext{
			
			color: #909399;
			font-size: 28rpx;
		}
	}
	.content{
		position: relative;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;;
		background: #fff;
		position: relative;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24rpx;
			color: $base-color;
			margin-right: 10rpx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4rpx;
			padding: 4rpx 10rpx;
			line-height: 1;
		}
		.address{
			font-size: 30rpx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28rpx;
		color: $font-color-light;
		margin-top: 16rpx;
		.name{
			margin-right: 30rpx;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80rpx;
		font-size: 40rpx;
		color: $font-color-light;
		padding-left: 30rpx;
	}
	
	.add-btn{
		position: fixed;
		left: 30rpx;
		right: 30rpx;
		bottom: 50rpx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		height: 80rpx;
		font-size: 32rpx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10rpx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
</style>
