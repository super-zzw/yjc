<template>
	<view class="content">
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex === index}"
				@click="tabClick(index)"
			>
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view 
					class="list-scroll-content" 
					scroll-y
					@scrolltolower="getMore"
				>
					<!-- 空白页 -->
					<empty :desc="'暂无相关订单'" v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
					
					<!-- 订单列表 -->
					<view 
						v-for="(item,index) in tabItem.orderList" :key="index"
						class="order-item"
					>
						<view class="i-top b-b">
							<text class="time">{{item.createTime | dealTime}}</text>
							<text class="state">
								<!-- -1=已取消 0=待付款；1=待发货；2=待收货；3=已完成 4=已评价；5=退换货(售后) ;-99全部 -->
								<!-- 发货之后不可取消订单，只有联系售后 -->
								<text v-if="item.orderType == 2">
									<text v-if="currentTime < item.endGroupTime && item.groupMember < item.minMember">待成团</text>
									<text v-else-if="item.groupMember >= item.minMember">已成团，待发货</text>
									<text v-else>未成团</text>
								</text>
								<text v-else>
									<text v-if="item.status == -2">售后关闭</text>
									<text v-if="item.status == -1">已取消</text>
									<text v-if="item.status == 0">待付款</text>
									<text v-if="item.status == 1">待发货</text>
									<text v-if="item.status == 2">待收货</text>
									<text v-if="item.status == 3">已完成</text>
									<text v-if="item.status == 4">已评价</text>
									<text v-if="item.status == 5">售后处理中</text>
									<text v-if="item.status == 6">退款中</text>
									<text v-if="item.status == 7">退款完成</text>
								</text>
							</text>
							<text 
								v-if="item.status == 3 || item.status == 4" 
								class="del-btn iconfont iconshanchu"
								@click="deleteOrder(index,item.id)"
							></text>
						</view>
						<view class="i-group" v-if="item.orderType == 2 && currentTime < item.endGroupTime && item.groupMember < item.minMember">
							<image src="../../static/ptz.png" mode="widthFix" class="igImg"></image>
							<text class="igText">还差{{item.minMember - item.groupMember}}人拼成，剩{{item.endGroupTime | dealTimep}}结束</text>
						</view>
						<scroll-view v-if="item.itemList.length > 1" class="goods-box" scroll-x @tap="toDetail(item.id)">
							<view
								v-for="(goodsItem, goodsIndex) in item.itemList" :key="goodsIndex"
								class="goods-item"
							>
								<image class="goods-img" :src="goodsItem.picUrl" mode="aspectFill"></image>
							</view>
						</scroll-view>
						<view 
						  @tap="toDetail(item.id)"
							v-if="item.itemList.length === 1" 
							class="goods-box-single"
							v-for="(goodsItem, goodsIndex) in item.itemList" :key="goodsIndex"
						>
							<image class="goods-img" :src="goodsItem.picUrl" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{goodsItem.productName}}</text>
								<text class="attr-box">
									<text v-for="(aitem,akey,aindex) of JSON.parse(goodsItem.specifications)" :key="aindex">{{akey}}：{{aitem}};</text>
									<text>数量：{{goodsItem.productQuantity}}</text>
								</text>
								<text class="price" v-if="item.payType != 3">{{goodsItem.promotionPrice}}</text>
							</view>
						</view>
						<view class="good-box-sn">
							订单编号：{{item.orderSn}}
							<text class="iconfont iconfuzhi gbsc" @tap="copyOrderSn(item.orderSn)"></text>
						</view>
						<view class="price-box">
							共
							<text class="num">{{item.itemList.length}}</text>
							件商品 
							<text class="price1" v-if="item.payType == 3">消耗{{item.payAmount}}积分</text>
							<text class="price1" v-else>￥{{item.payAmount}}</text>
						</view>
						<view class="action-box b-t" v-if="item.status == 1 && currentTime >= item.endGroupTime && item.groupMember >= item.minMember">
							<!-- <button class="action-btn" @click="cancelOrder(index,item.id)">取消订单</button> -->
							<text v-if="item.payType == 3" class="b-t2">积分兑换订单</text>
							<text v-if="item.payType == 4" class="b-t2">货到付款订单</text>
							<button class="action-btn recom" @tap="afterSale(item.id)" v-if="item.payType != 3 && item.payType != 4">申请售后</button>
						</view>
						<!-- 非拼团订单 -->
						<view class="action-box b-t" v-if="item.orderType != 2">
							<button class="action-btn" v-if="item.status == 0 && item.payType != 4" @click="cancelOrder(index,item.id)">取消订单</button>
							<button class="action-btn recom" v-if="item.status == 0 && item.payType != 4" @tap="toPay(item.payAmount,item.id)">立即支付</button>
							<button class="action-btn recom" v-if="item.status == 1 && item.payType != 4" @tap="afterSale(item.id)">申请售后</button>
							<button class="action-btn" v-if="item.status == 2" @click="toDelivery(item.id)">查看物流</button>
							<button class="action-btn" v-if="item.status == 2" @click="getGood(index,item.id)">确认收货</button>
							<button class="action-btn recom" v-if="item.status == 2 && item.payType != 4" @tap="afterSale(item.id)">申请售后</button>
							<button class="action-btn" v-if="item.status == 3" @click="toDelivery(item.id)">查看物流</button>
							<button class="action-btn recom" v-if="item.status == 3" @tap="toAssess(item.id)">去评价</button>
							<button class="action-btn" v-if="item.status == 4" @click="toDelivery(item.id)">查看物流</button>
							<button class="action-btn recom" @tap="callService">联系客服</button>
							<button class="action-btn" v-if="item.status == 5 && item.payType != 4" @click="toDelivery(item.id)">查看物流</button>
							<button class="action-btn recom" @tap="toAfterSale(item.applyType,item.applyId,item.id)" v-if="item.status == 5 && item.payType != 4">售后进度</button>
						</view>
						<!-- 拼团订单 -->
						<view class="action-box b-t" v-else>
							<button class="action-btn" v-if="item.status == 1 && !(currentTime >= item.endGroupTime && item.groupMember < item.minMember)" @tap="share(item.ruleId)">邀请好友</button>
							<button class="action-btn" v-if="item.status == 2" @click="toDelivery(item.id)">查看物流</button>
							<button class="action-btn" v-if="item.status == 2" @click="getGood(index,item.id)">确认收货</button>
							<button class="action-btn recom" v-if="item.status == 2" @tap="afterSale(item.id)">申请售后</button>
							<button class="action-btn" v-if="item.status == 3" @click="toDelivery(item.id)">查看物流</button>
							<button class="action-btn recom" v-if="item.status == 3" @tap="toAssess(item.id)">去评价</button>
							<button class="action-btn" v-if="item.status == 4" @click="toDelivery(item.id)">查看物流</button>
							<button class="action-btn" v-if="item.status == 5" @click="toDelivery(item.id)">查看物流</button>
							<button class="action-btn recom" @tap="toAfterSale(item.applyType,item.applyId,item.id)" v-if="item.status == 5">售后进度</button>
							<button class="action-btn recom" @tap="callService">联系客服</button>
						</view>
					</view>
					 <view v-if="tabItem.orderList.length > 0 && tabItem.noMore" class="no_more">
					 	<text class="no_more_side"></text>
					 	<text class="no_more_text">没有更多数据了</text>
					 	<text class="no_more_side"></text>
					 </view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<share
			ref="share" 
			:contentHeight="400"
			:shareList="shareList"
			@invite="shareOthers"
		></share>
	</view>
</template> 

<script>
	import {
	   mapState
	} from 'vuex';
	import empty from "@/components/empty";
	import utils from "@/utils/method.js"
	import Share from "../../components/share.vue";
	export default {
		components: {
			empty,
			Share
		},
		computed:{
			...mapState(['userInfo'])
		},
		data() {
			return {
				// payType,只有4是到付
				currentTime:"",  //服务器当前时间戳
				id: "",
				tabCurrentIndex: 0,
				// -1=已取消 0=待付款；1=待发货；2=待收货；3=已完成 4=已评价；5=退换货(售后) ;-99全部
				navList: [{
						state: -99,
						text: '全部',
						orderList: [],
						page:1,
						size:8,
						dataLoading:false,  //是否是在加载数据
						noMore:false,
					},
					{
						state: 0,
						text: '待付款',
						orderList: [],
						page:1,
						size:8,
						dataLoading:false,  //是否是在加载数据
						noMore:false,
					},
					{
						state: 1,
						text: '待发货',
						orderList: [],
						page:1,
						size:8,
						dataLoading:false,  //是否是在加载数据
						noMore:false,
					},
					{
						state: 2,
						text: '待收货',
						loadingType: 'more',
						orderList: [],
						page:1,
						size:8,
						dataLoading:false,  //是否是在加载数据
						noMore:false,
					},
					{
						state: 5,
						text: '售后',
						loadingType: 'more',
						orderList: [],
						page:1,
						size:8,
						dataLoading:false,  //是否是在加载数据
						noMore:false,
					}
				],
				shareList:[
					{
						icon: require( "../../static/wxhy.png"),
						text: "微信好友"
					},
					{
						icon: require("../../static/pyq.png"),
						text: "朋友圈"
					},
					{
						icon: require("../../static/fzlj.png"),
						text: "复制链接"
					},
				],
			};
		},
		filters:{
			dealTime(val){
				return utils.unixToDatetime(val) || ""
			},
			dealTimep(val){
				let _str = utils.transToDate(val);
				return _str.h + "小时" + _str.m + "分钟"
			}
		},
		onLoad(options){
			this.tabCurrentIndex = +options.state;
			this.loadData()
		},
		 
		methods: {
			toDelivery(id){
				uni.navigateTo({
					url:`/pages/order/delivery?id=${id}`
				})
			},
			callService(){
				// uni.showToast({
				// 	icon:"none",
				// 	title:"客服系统努力开发中..."
				// })
				uni.navigateTo({
					url:"/pages/service/service"
				})
			},
			//售后进度type：0=仅退款 1=退货退款 
			toAfterSale(type,prgsId,orderId){
				if(type == 0){
					//仅退款
					uni.navigateTo({
						url: `/pages/afterSale/onlyRefundPrgs?prgsId=${prgsId}&orderId=${orderId}`
					})
				}else{
					//退货退款
					uni.navigateTo({
						url: `/pages/afterSale/reGoodfundPrgs?prgsId=${prgsId}&orderId=${orderId}`
					})
				}
				
			},
			//立即支付
			toPay(total,orderid){
				uni.navigateTo({
					url: `/pages/money/pay?money=${total}&orderid=${orderid}`
				})
			},
			//售后
			afterSale(id){
				uni.navigateTo({
					url:`/pages/afterSale/afterSale?id=${id}`
				})
			},
			//确定确认收货
			async getGood(index,orderId){
				uni.showLoading({
					title: '加载中...'
				})
				await this.$http({
					apiName:"getGood",
					type:"POST",
					data:{orderId:orderId}
				}).then(res => {
					this.$set(this.navList[this.tabCurrentIndex].orderList[index],"status",3)
					uni.showToast({
						title:"已收货"
					})
				}).catch(_ => {})
				uni.hideLoading();
			},
			//评价
			toAssess(id){
				uni.navigateTo({
					url:`/pages/order/assess?id=${id}`
				})
			},
			//查看订单详情
			toDetail(id){
				uni.navigateTo({
					url:"/pages/order/orderDetail?id=" + id
				})
			},
			//获取订单
			async getOrder(){
				uni.showLoading({
					title:"加载中..."
				})
				let index = this.tabCurrentIndex
				if(this.navList[index].dataLoading){
					return
				}
				this.$set(this.navList[index],"dataLoading",true)
				await this.$http({
					"apiName":"getOrderList",
					"data":{
						page:this.navList[index].page,
						size:this.navList[index].size,
						status:this.navList[index].state,
					}
				}).then(res => {
					this.$set(this.navList[index],"noMore",!res.data.hasNextPage);
					this.$set(this.navList[index],"orderList",this.navList[index].orderList.concat(res.data.list));
					this.currentTime = res.timestamp;
				}).catch(_ => {})
				this.$set(this.navList[index],"dataLoading",false)
				uni.hideLoading()
			},
			//获取订单列表
			 async loadData(source){
				let navItem = this.navList[this.tabCurrentIndex];
				if(source === 'tabChange' && navItem.loaded === true){
					return;
				}
				await this.getOrder()
				this.$set(this.navList[this.tabCurrentIndex],"loaded",true)
				// setTimeout(()=>{
					
				// }, 600);	
			}, 

			//swiper 切换数据
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
			},
			//删除订单
			async deleteOrder(index,orderId){
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除该订单？',
					success: function (res) {
						if (res.confirm) {
							that.deleteOrderOk(index,orderId)
						}
					}
				})
			},
			//确定删除
			async deleteOrderOk(index,orderId){
				uni.showLoading({
					title: '删除中...'
				})
				await this.$http({
					apiName:"deleteOrder",
					type:"POST",
					data:{id:orderId}
				}).then(res => {
					this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
					uni.showToast({
						title:"删除成功"
					})
				}).catch(_ => {})
				uni.hideLoading();
			},
			//取消订单
			cancelOrder(index,id){
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定取消该订单？',
					success: function (res) {
						if (res.confirm) {
							that.cancelOrderOk(index,id)
						} else if (res.cancel) {
							
						}
					}
				})
			},
			//确定取消订单
			async cancelOrderOk(index,id){
				uni.showLoading({
					title:"取消中..."
				})
				await this.$http({
					apiName:"cancelOrder",
					type:"POST",
					data:{orderId:id}
				}).then(res => {
					this.$set(this.navList[this.tabCurrentIndex].orderList[index],"status",-1)
					uni.showToast({
						title:"订单已取消"
					})
				}).catch(_ => {})
				uni.hideLoading()
			},
			//触底加载更多
			getMore(){
				let _index = this.tabCurrentIndex
				if(this.navList[_index].noMore){
					return
				}
				
				let _nextPage = this.navList[_index].page + 1
				this.$set(this.navList[_index],"page",_nextPage)
				this.getOrder()
			},
			//复制订单号
			copyOrderSn(order) {
				let _self = this
				uni.setClipboardData({
					data: order,
					success() {
						uni.showToast({
							title:"复制成功",
							icon: 'none'
						})
					}
				});
			},
			//分享
			share(id){
				this.$refs.share.toggleMask();	
				this.id = id;
			},

			shareOthers(e){
				let name = "";
				if(e == "微信好友" ){
					name = "WXSceneSession";
					// #ifdef APP-PLUS
					utils.wxShare({
						name,
						type: e,
						gid: this.id
					})
					// #endif
					
				}else if(e == "朋友圈"){
					name = "WXSenceTimeline";
					// #ifdef APP-PLUS
					utils.wxShare({
						name,
						type: e,
						gid: this.id
					})
					// #endif
				}else if(e == "复制链接"){
					const code = this.userInfo.inviteCode;
					utils.setClip({
						code,
						id:this.id
					})
				}
				
			}
		},
		//下拉刷新
		async onPullDownRefresh(){
			let _index = this.tabCurrentIndex
			this.$set(this.navList[_index],"orderList",[])
			this.$set(this.navList[_index],"page",1)
			await this.getOrder()
			uni.stopPullDownRefresh();
			uni.showToast({
				title: '刷新成功'
			})
		},
		onBackPress(e){
			uni.switchTab({
				url:"/pages/user/user"
			})
			return true
		}
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	
	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
	}
	
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30rpx;
		background: #fff;
		margin-top: 16rpx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80rpx;
			padding-right:30rpx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.time{
				flex: 1;
			}
			.state{
				color: $base-color;
			}
			.del-btn{
				padding: 10rpx 0 10rpx 36rpx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30rpx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20rpx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		.i-group{
			margin-left: -30rpx;
			background-color: #FFF2F2;
			padding-left: 30rpx;
			height: 70rpx;
			display: flex;
			align-items: center;
			.igImg{
				width: 74rpx;
			}
			.igText{
				margin-left: 20rpx;
				color: #606266;
				font-size: 28rpx;
			}
		}
		/* 多条商品 */
		.goods-box{
			height: 160rpx;
			padding: 20rpx 0;
			white-space: nowrap;
			.goods-item{
				width: 120rpx;
				height: 120rpx;
				display: inline-block;
				margin-right: 24rpx;
			}
			.goods-img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20rpx 0;
			.goods-img{
				display: block;
				width: 120rpx;
				height: 120rpx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30rpx 0 24rpx;
				overflow: hidden;
				.title{
					font-size: $font-base + 2rpx;
					color: $font-color-dark;
					line-height: 1;
				}
				.attr-box{
					font-size: $font-sm + 2rpx;
					color: $font-color-light;
					padding: 10rpx 12rpx;
					padding-left: 0;
				}
				.price{
					font-size: $font-base + 2rpx;
					color: $font-color-dark;
					&:before{
						content: '￥';
						font-size: $font-sm;
						margin: 0 2rpx 0 8rpx;
					}
				}
				
			}
		}
		.good-box-sn{
			font-size: 24rpx;
			color: #999;
			.gbsc{
				padding-left: 20rpx;
				padding-right: 20rpx;
				color:#477CE5;
				font-size: 30rpx;
				font-weight: bold;
			}
		}
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20rpx 30rpx;
			font-size: $font-sm + 2rpx;
			color: $font-color-light;
			.num{
				margin: 0 8rpx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				&:before{
					content: '￥';
					font-size: $font-sm;
					margin: 0 2rpx 0 8rpx;
				}
			}
			.price1{
				margin-left: 20rpx;
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100rpx;
			position: relative;
			padding-right: 30rpx;
			.b-t2{
				font-size: 26rpx;
			}
		}
		.action-btn{
			width: 160rpx;
			height: 60rpx;
			margin: 0;
			margin-left: 24rpx;
			padding: 0;
			text-align: center;
			line-height: 60rpx;
			font-size: $font-sm + 2rpx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}
	

	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
</style>
