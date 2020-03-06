<template>
	<view class="sWrap">
		<view class="s-box1" @tap="setSign" v-if="!hasQd">
			<view class="s-boxbgk">
				<view class="s-boxtext">今日</view>
				<view class="s-boxtext">签到</view>
			</view>
		</view>
		<view class="s-box1" v-else>
			<view class="s-boxbgk">
				<view class="s-boxtext">今日</view>
				<view class="s-boxtext">已签到</view>
			</view>
		</view>
		<view class="s-box2">
			<view v-for="(item,index) in qiandao2" :key="item.lable" class="s-box2-item">
				<view class="s2-item-top">
					<view class="s2-item-right" v-if="index != 0"></view>
					<text class="iconfont iconduigou i1"></text>
				</view>
				<view class="s2-item-boo">第{{item.num}}天</view>
			</view>
			<view v-for="(item2,index2) of noqiandao2" :key="item2.lable" class="s-box2-item">
				<view class="s2-item-top">
					<view class="s2-item-right"></view>
					<text class="iconfont iconshenglvehao i2"></text>
				</view>
				<!-- <view class="s2-item-boo" v-if="qiandao == 0">第{{item2 + qiandao + 1}}天</view> -->
				<!-- <view class="s2-item-boo" v-else>第{{item2 + qiandao}}天</view> -->
				<view class="s2-item-boo">第{{item2.num}}天</view>
			</view>
		</view>
		<view class="s-box3">
			<view class="s-box3-left">
				<image :src="userInfo.icon" class="s-box3img" v-if="userInfo.icon"></image>
				<image src="/static/defaultface.png" class="s-box3img" v-else></image>
				<view class="s-box3-text">{{userInfo.wusername}}</view>
			</view>
			<view class="s-box3-right">
				<text class="s-box3-text2">总积分：</text>
				<text class="s-box3-text3">{{userInfo.integration}}</text>
			</view>
		</view>
		<view class="s-box4">
			<view class="s-box4-item" v-for="(item,index) in dataList" :key="index">
				<view class="s-box4-text1">{{item.createTime | dealTime}}</view>
				<view class="s-box4-text2">{{item.sourceTypeStr}}</view>
				<view class="s-box4-text3">
					<text v-if="item.type == 0">+</text>
					<text v-else>-</text>
					{{item.cou}}
				</view>
			</view>
			<view v-if="dataList.length > 0 && noMore" class="no_more">
				<text class="no_more_side"></text>
				<text class="no_more_text">没有更多数据了</text>
				<text class="no_more_side"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
	    mapState,mapMutations
	} from 'vuex';
	import utils from '@/utils/method.js'
	export default {
		data() {
			return {
				qiandao:0,  //已签到天数
				qiandao2:[],
				noqiandao:0,
				noqiandao2:[],
				hasQd:true,  //当天是否已经签到
				dataList:[],
				page:1,
				size:16,
				dataLoading:false,  //是否是在加载数据
				noMore:false,
			}
		},
		computed: {
			...mapState(['userInfo']),
		},
		onLoad() {
			this.initData()
		},
		filters:{
			dealTime(val){
				return utils.unixToDatetime(val) || ""
			}
		},
		methods: {
			...mapMutations(['setUserInfo']),
			initData(){
				uni.showLoading({ title: '加载中' });
				this.getUserInfo()
				this.getList()
				this.getSigin()
				uni.hideLoading()
			},
			//获取用户信息
			async getUserInfo(){
				await this.$http({
					apiName:"getUserInfo"
				}).then(res => {
					this.setUserInfo(res.data)
				}).catch(_ => {})
			},
			async getList(){
				await this.$http({
					apiName:"getScore",
					data:{
						page:this.page,
						size:this.size
					}
				}).then(res => {
					this.noMore = !res.data.hasNextPage
					this.dataList = this.dataList.concat(res.data.list)
				}).catch(_ => {})
			},
			//获取用户签到天数
			async getSigin(){
				await this.$http({
					apiName:"siginCount",
				}).then(res => {
					this.qiandao = res.data.num
					for(let i = 1; i <= this.qiandao; i ++){
						this.qiandao2.push({
							num:i,
							lable: i + "a"
						})
					}
					this.noqiandao = 7 - this.qiandao
					for(let j = 1; j <= this.noqiandao; j ++){
						this.noqiandao2.push({
							num:j + this.qiandao,
							lable: j + "b"
						})
					}
					this.hasQd = !res.data.flag
				}).catch(_ => {})
			},
			//用户签到
			async setSign(){
				await this.$http({
					apiName:"setSigin",
					type:"POST"
				}).then(res => {
					uni.showToast({
						title:"签到成功"
					})
					this.noqiandao --
					this.qiandao ++
					this.qiandao2 = []
					for(let i = 1; i <= this.qiandao; i ++){
						this.qiandao2.push({
							num:i,
							lable: i + "a"
						})
					}
					this.noqiandao2 = []
					for(let j = 1; j <= this.noqiandao; j ++){
						this.noqiandao2.push({
							num:j + this.qiandao,
							lable: j + "b"
						})
					}
					this.hasQd = true
					//更新签到数据
					this.dataList = [];
					this.noMore = false
					this.page = 1;
					this.getList()
				}).catch(_ => {})
			}
		},
		//下拉刷新
		async onPullDownRefresh(){
			this.qiandao2 = []
			this.noqiandao2 = []
			this.dataList = [];
			this.noMore = false
			this.page = 1;
			this.qiandao = 0;
			this.noqiandao = 0;
			await this.initData()
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
			this.getList()
		},
		onNavigationBarButtonTap(e) {
			const index = e.index;
			// #ifdef APP-PLUS
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			const currentWebview = page.$getAppWebview();
			currentWebview.hideTitleNViewButtonRedDot({
				index
			});
			// #endif
			if (index === 0) {
				uni.navigateTo({
					url:"/pages/product/typeList?score=true"
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
.sWrap{
	.s-box1{
		width: 100%;
		height: 276rpx;
		background-image: url("/static/scorebgk.png");
		background-repeat: no-repeat;
		background-size: cover;
		text-align: center;
		.s-boxbgk{
			margin-top: 60rpx;
			display: inline-block;
			width:140rpx;
			height:140rpx;
			border-radius: 50%;
			padding-top: 26rpx;
			box-sizing: border-box;
			text-align: center;
			background:linear-gradient(180deg,rgba(255,190,0,1) 0%,rgba(254,122,58,1) 100%);
			box-shadow:0px 6px 40px 0px rgba(206,51,47,0.3);
			color: #fff;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
	.s-box2{
		background-color: #DD423E;
		padding: 22rpx 32rpx;
		display: flex;
		justify-content: space-between;
		.s-box2-item{
			flex: 1;
			.s2-item-top{
				display: flex;
				align-items: center;
				.s2-item-right{
					flex: 1;
					height: 4rpx;
					background-color: #FF8077;
				}
				.i1{
					width: 48rpx;
					height: 48rpx;
					background-color: #FD817A;
					border-radius: 50%;
					font-size: 24rpx;
					text-align: center;
					line-height: 48rpx;
					color: #fff;
				}
				.i2{
					width: 48rpx;
					height: 48rpx;
					background-color: #D5D3D3;
					border-radius: 50%;
					font-size: 28rpx;
					text-align: center;
					line-height: 48rpx;
					color: #fff;
				}
				.i3{
					width: 48rpx;
					height: 48rpx;
					background-color: #F5B6B2;
					border-radius: 50%;
					font-size: 20rpx;
					text-align: center;
					line-height: 48rpx;
					color: #fff;
				}
			}
			.s2-item-boo{
				text-align: right;
				color: #FBE3E3;
				font-size: 22rpx;
				margin-right: -8rpx;
			}
		}
		.s-box2-item:nth-child(1){
			display: block;
			flex: inherit;
			width: 48rpx;
			.s2-item-top{
				width: 48rpx;
			}
			.s2-item-boo{
				margin-left: -8rpx;
				width: 48rpx;
				white-space: nowrap;
				text-align: left;
			}
		}
	}
	.s-box3{
		border-top: 20rpx solid #F9FAFB;
		border-bottom: 2rpx solid #DBDBDB;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 34rpx 32rpx;
		background: #fff;
		.s-box3-left{
			display: flex;
			align-items: center;
			.s-box3img{
				width: 72rpx;
				height: 72rpx;
				border-radius: 50%;
				margin-right: 12rpx;
			}
			.s-box3-text{
				colo:#303133;
				font-size: 28rpx;
			}
		}
		.s-box3-right{
			display: flex;
			align-items: center;
			.s-box3-text2{
				color: #909399;
				font-size: 26rpx;
			}
			.s-box3-text3{
				color: #F23D3D;
				font-size: 40rpx;
				font-weight: bold;
			}
		}
	}
	.s-box4{
		padding-left: 32rpx;
		padding-right: 32rpx;
		box-sizing: border-box;
		background: #fff;
		.s-box4-item{
			display: flex;
			justify-content: space-between;
			padding-top: 24rpx;
			padding-bottom: 32rpx;
			border-bottom: 2rpx solid #DBDBDB;
			.s-box4-text1{
				width: 35%;
				font-size: 28rpx;
				color:#303133;
			}
			.s-box4-text2{
				width: 35%;
				text-align: center;
				font-size: 28rpx;
				color:#303133;
			}
			.s-box4-text3{
				flex: 1;
				text-align: right;
				color: #F23D3D;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
	}
}
</style>
