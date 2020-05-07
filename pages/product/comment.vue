<template>
	<view class="sWrap">
		<view class="sbox">
			<view class="sitem" v-for="(item,index) in dataList" :key="index">
				<view class="item-top">
					<view class="item-top-left">
						<image class="itl-pic" :src="item.wuserIcon || 'https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/defaultface.png'" mode=""></image>
						<text class="itl-name">{{item.wuserName}}</text>
					</view>
				</view>
				<view class="item-cont">{{item.content}}</view>
				<view class="item-good" v-if="item.cpics.length > 0">
					<view class="item-good-img" v-for="(pitem,pindex) in item.cpics" :key="pindex" @tap="seeImg(pitem)">
						<image :src="pitem" mode=""></image>
					</view>
				</view>
				<view class="item-time">{{item.createTime | dealTime}}</view>
				<view class="item-replay" v-if="item.replayContent">
					<image src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/sanjiao.png" class="item-sanjiao" mode=""></image>
					<view class="item-retex">{{item.replayName}}回复：{{item.replayContent}}</view>
				</view>
			</view>
		</view>
		<view class="s-empty" v-if="dataList.length == 0 && noMore">
			<image src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/nomsg.png" class="no-img" mode="widthFix"></image>
			<view class="empty-text">暂无评价</view>
		</view>
		<view v-if="dataList.length > 0 && noMore" class="no_more">
			<text class="no_more_side"></text>
			<text class="no_more_text">没有更多数据了</text>
			<text class="no_more_side"></text>
		</view>
		<view class="bigImg" v-if="showBgImg">
			<view class="bigImg-close">
				<text class="iconfont iconclose-hei" @tap="showBgImg = false"></text>
			</view>
			<image :src="bgImg" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script>
	import utils from '@/utils/method.js'
	export default{
		data(){
			return {
				showBgImg:false,
				bgImg:"",  //大图
				id:"",
				dataList:[],
				page:1,
				size:8,
				noMore:false,
			}
		},
		methods:{
			seeImg(img){
				this.showBgImg = true;
				this.bgImg = img
			},
			async getData(){
				var that = this
				await this.$http({
					apiName:"getComment",
					data:{
						productId:this.id,
						page:this.page,
						size:this.size
					}
				}).then(res => {
					// this.noMore = !res.data.hasNextPage
					this.dataList = this.dataList.concat(res.data)
					this.dataList.map(item => {
						that.$set(item,"cpics",JSON.parse(item.pics))
					})
				}).catch(_ => {})
			},
		},
		filters:{
			dealTime(val){
				return utils.unixToDatetime(val) || ""
			}
		},
		//下拉刷新
		async onPullDownRefresh(){
			this.dataList = [];
			this.page = 1;
			await this.getData()
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
			this.getData()
		},
		async onLoad(opt) {
			this.id = opt.id
			await this.getData()
		}
	}
</script>

<style lang="scss" scoped>
	.sWrap{
		min-height: calc(100vh - 88rpx);
		background-color: #F9FAFB;
		box-sizing: border-box;
		.sbox{
			.sitem{
				margin-bottom: 20rpx;
				padding: 32rpx;
				background-color: #fff;
				.item-top{
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 2rpx solid #CCCCCC;
					padding-bottom: 20rpx;
					.item-top-left{
						display: flex;
						align-items: center;
						.itl-name{
							color: #606266;
							font-size: 30rpx;
							font-weight: bold;
						}
						.itl-pic{
							width: 30rpx;
							height: 30rpx;
							margin-right: 20rpx;
						}
					}
					.item-top-right{
						padding: 0 16rpx;
						border: 2rpx solid #F23D3D;
						border-radius: 32rpx;
						line-height: 42rpx;
						font-size: 24rpx;
						color: #F23D3D;
					}
				}
				.item-cont{
					margin-top: 20rpx;
					color: #606266;
					font-size: 26rpx;
				}
				.item-good{
					margin-top: 20rpx;
					// padding: 16rpx;
					// background-color: #F8F8F9;
					display: flex;
					align-items: center;
					// border-radius: 8rpx;
					.item-good-img{
						width: 128rpx;
						height: 128rpx;
						background-color: #C0C4CC;
						border-radius: 4rpx;
						margin-right: 16rpx;
						image{
							width: 128rpx;
							height: 128rpx;
							border-radius: 4rpx;
						}
					}
					.item-good-info{
						flex: 1;
						.item-gtitle{
							color: #303133;
							font-size: 30rpx;
						}
						.item-gtext{
							margin-top: 14rpx;
							display: flex;
							align-items: center;
							.item-price{
								color: #606266;
								font-size: 32rpx;
								margin-right: 30rpx;
							}
							.item-status{
								color: #F23D3D;
								font-size: 24rpx;
							}
						}
					}
				}
				.item-time{
					margin-top: 10rpx;
					color: #C0C4CC;
					font-size: 22rpx;
				}
				.item-replay{
					margin-top: -14rpx;
					.item-sanjiao{
						margin-left: 30rpx;
						width: 24rpx;
						height: 16rpx;
					}
					.item-retex{
						border-radius: 8rpx;
						margin-top: -10rpx;
						background-color: #F8F8F9;
						padding: 20rpx 28rpx;
						color: #909399;
						font-size: 24rpx;
						line-height: 30rpx;
					}
				}
			}
		}
		.s-empty{
			text-align: center;
			.no-img{
				margin-top: 300rpx;
				width: 312rpx;
				height: auto;
			}
			.empty-text{
				color: #909399;
				font-size: 28rpx;
				margin-top: 20rpx;
			}
		}
		.bigImg{
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background-color: rgba(0,0,0,0.7);
			text-align: center;
			padding: 32rpx;
			padding-top: 88rpx;
			box-sizing: border-box;
			.bigImg-close{
				text-align: right;
				margin-top: 40rpx;
				margin-bottom: 40rpx;
				.iconfont{
					color: #fff;
					font-size: 40rpx;
					font-weight: bold;
				}
			}
			.bgImg{
				width: 100%;
				height: auto;
			}
		}
	}
</style>
