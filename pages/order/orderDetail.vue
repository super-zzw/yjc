<template>
	<view class="sWrap">
		<view class="swrap-box1">
			<view class="swb1-left">
				<view class="swrap-box1c">
					<image class="swb1-img" src="/static/location.png" mode=""></image>
				</view>
			</view>
			<view class="swb1-right" v-if="order.receiverWay != 1">
				<view class="swb1-right-top">
					<text class="swb1-rit1">{{order.receiverName}}</text>
					<text class="swb1-rit2">{{order.receiverPhone}}</text>
				</view>
				<view class="swb1-right-boo">
					<text class="swb1-right-boo-item">{{order.receiverProvince}}</text>
					<text class="swb1-right-boo-item">{{order.receiverCity}}</text>
					<text class="swb1-right-boo-item">{{order.receiverRegion}}</text>
					<text class="swb1-right-boo-item">{{order.receiverDetailAddress}}</text>
				</view>
			</view>
			<view class="swb1-right" v-else>
				<view class="swb1-right-top swb1-right-top2">
					自提地址：
				</view>
				<view class="swb1-right-boo">
					{{config.MALL_MENTION_ADDRESS}}
				</view>
			</view>
		</view>
		<view class="swrap-group">
			<view class="sgp1">
				<image class="img1" v-if="groupStatus == 1" src="../../static/ptz.png" mode="widthFix"></image>
				<image class="img2" v-if="groupStatus == 2 || groupStatus == 4" src="../../static/ptcg.png"  mode="widthFix"></image>
				<image class="img3" v-if="groupStatus == 3" src="../../static/ptwcg.png"  mode="widthFix"></image>
				<text class="text" v-if="groupStatus == 1">
					还差{{grouponRules.minMember - groupList.length - 1}}人拼成，剩{{grouponRules.endTime | dealTimep(currentTime)}}结束
				</text>
			</view>
			<view class="ptImgs">
				<view class="fpNumstImg" v-for="(imgItem,imgIndex) in groupList" :key="imgIndex">
					<image v-if="imgItem.icon && imgIndex < 10" class="img" :src="imgItem.icon" mode=""></image>
				</view>
				<view class="fpNumstImg">
					<image class="img" :src="userInfo.icon" mode=""></image>
				</view>
				<view class="fightImgMine">
					<text v-if="groupStatus == 3">已退款</text>
					<text v-else>已支付</text>
				</view>
			</view>
		</view>
		<view class="swrap-box2">
			<view class="swb2-item" v-for="(item,index) in orderItems" :key="index">
				<view class="swb2-item1">
					<image class="swb2-item-img" :src="item.picUrl" mode=""></image>
				</view>
				<view class="swb2-item3">
					<view class="swb2-item2">
						<view class="swb2-item2-title">{{item.productName}}</view>
						<view class="swb2-item2-cont">
							<text class="swb2-item2-text1" v-if="order.payType != 3">￥{{item.promotionPrice}}</text>
							<text class="swb2-item2-text2">
								<text v-for="(aitem,akey,aindex) of JSON.parse(item.specifications)" :key="aindex">{{aitem}}</text>
							</text>
						</view>
					</view>
					<view class="swb2-item4">{{item.productQuantity}}件</view>
				</view>
			</view>
			<view class="swb-total">
				<text class="swb-total-text1" v-if="order.payType != 3">订单总价：</text>
				<text class="swb-total-text2" v-if="order.payType == 3">消耗{{order.payAmount}}积分</text>
				<text class="swb-total-text2" v-else>￥{{order.payAmount}}</text>
			</view>
			<view class="swb2-foot" v-if="order.orderType != 2">
				<view class="swb2f-btn1" v-if="order.status == 0 && order.payType != 4" @click="cancelOrder">取消订单</view>
				<view class="swb2f-btn1 recom" v-if="order.status == 0 && order.payType != 4" @tap="toPay">立即支付</view>
				<view class="swb2f-btn1 recom" v-if="order.status == 1 && order.payType != 4" @tap="afterSale">申请售后</view>
				<view class="swb2f-btn1" v-if="order.status == 2" @click="toDelivery">查看物流</view>
				<view class="swb2f-btn1" v-if="order.status == 2" @click="getGood">确认收货</view>
				<view class="swb2f-btn1 recom" v-if="order.status == 2 && order.payType != 4" @tap="afterSale">申请售后</view>
				<view class="swb2f-btn1" v-if="order.status == 3" @click="toDelivery">查看物流</view>
				<view class="swb2f-btn1 recom" v-if="order.status == 3" @tap="toAssess">去评价</view>
				<view class="swb2f-btn1" v-if="order.status == 4" @click="toDelivery">查看物流</view>
				<view class="swb2f-btn1 recom" @tap="callService">联系客服</view>
				<view class="swb2f-btn1" v-if="order.status == 5 && order.payType != 4" @click="toDelivery">查看物流</view>
				<view class="swb2f-btn1 recom" @tap="afterSale" v-if="order.status == 5 && order.payType != 4">售后进度</view>
			</view>
			<view class="swb2-foot" v-else>
				<view class="swb2f-btn1" v-if="order.status == 0 && order.payType != 4" @click="cancelOrder">取消订单</view>
				<view class="swb2f-btn1 recom" v-if="order.status == 0 && order.payType != 4" @tap="toPay(1)">立即支付</view>
				<view class="swb2f-btn1" v-if="order.status == 1 && !(currentTime >= order.endGroupTime && order.groupMember < order.minMember)" @tap="share">邀请好友</view>
				<view class="swb2f-btn1" v-if="order.status == 2" @click="toDelivery">查看物流</view>
				<view class="swb2f-btn1" v-if="order.status == 2" @click="getGood">确认收货</view>
				<view class="swb2f-btn1 recom" v-if="order.status == 2" @tap="afterSale">申请售后</view>
				<view class="swb2f-btn1" v-if="order.status == 3" @click="toDelivery">查看物流</view>
				<view class="swb2f-btn1 recom" v-if="order.status == 3" @tap="toAssess">去评价</view>
				<view class="swb2f-btn1" v-if="order.status == 4" @click="toDelivery">查看物流</view>
				<view class="swb2f-btn1" v-if="order.status == 5" @click="toDelivery">查看物流</view>
				<view class="swb2f-btn1 recom" @tap="afterSale" v-if="order.status == 5">售后进度</view>
				<view class="swb2f-btn1 recom" @tap="callService">联系客服</view>
			</view>
		</view>
		<view class="swrap-box3">
			<view class="swrap-box3-title">订单信息</view>
			<view class="swrap-box3-cont">
				<view class="swrap-box3-item">订单编号：{{order.orderSn}}</view>
				<view class="swrap-box3-item">创建时间：{{order.createTime | dealTime}}</view>
				<!-- 支付方式0未支付，1支付宝，2微信，3积分 -->
				<view class="swrap-box3-item">
					<text v-if="order.payType == 1">支付方式：支付宝</text>
					<text v-if="order.payType == 2">支付方式：微信支付</text>
					<text v-if="order.payType == 3">支付方式：积分兑换</text>
				</view>
				<view class="swrap-box3-item" v-if="order.status == 2 || order.status == 3 ||order.status == 4 ||order.status == 5">物流公司：{{order.deliveryCompany}}</view>
				<view class="swrap-box3-item" v-if="order.status == 2 || order.status == 3 ||order.status == 4 ||order.status == 5">物流单号：
					<text class="swrap-box3-text1">{{order.deliverySn}}</text>
					<text class="iconfont iconfuzhi" @tap="copyOrderSn(order.deliverySn)"></text>
				</view>
			</view>
		</view>
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
import utils from '@/utils/method.js'
import Share from "../../components/share.vue";
export default{
	components:{
		Share
	},
	onShareAppMessage(res) {
		return {
			title: "分享标题",
			path: "/pages/fight/productDetail?id=" + this.grouponRules.id
		}
	},
	data(){
		return {
			orderId:"",
			orderItems:[],
			order:{},
			groupList:[],
			grouponRules:null,
			currentTime:"",  //服务器当前时间
			groupStatus:"",  //1待成团，时间没到，人数没满；2拼团成功，人够了，时间没到；3拼团失败，人没够，时间到了;4时间到了，人满了，正常订单
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
		}
	},
	computed:{
		...mapState(['userInfo','config'])
	},
	methods:{
		toDelivery(id){
			uni.navigateTo({
				url:`/pages/order/delivery?id=${this.order.id}`
			})
		},
		toPay(group){
			uni.redirectTo({
				url: `/pages/money/pay?money=${this.order.payAmount}&orderid=${this.orderId}&group={group}`
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
		cancelOrder(){
			let that = this
			uni.showModal({
				title: '提示',
				content: '确定取消该订单？',
				success: function (res) {
					if (res.confirm) {
						that.cancelOrderOk()
					} else if (res.cancel) {
						
					}
				}
			})
		},
		//评价
		toAssess(){
			uni.navigateTo({
				url:`/pages/order/assess?id=${this.orderId}`
			})
		},
		async cancelOrderOk(){
			uni.showLoading({
				title:"取消中..."
			})
			await this.$http({
				apiName:"cancelOrder",
				type:"POST",
				data:{orderId:this.orderId}
			}).then(res => {
				this.$set(this.order,"status",-1)
				uni.showToast({
					title:"订单已取消"
				})
			}).catch(_ => {})
			uni.hideLoading()
		},
		//确定确认收货
		async getGood(){
			uni.showLoading({
				title: '加载中...'
			})
			await this.$http({
				apiName:"getGood",
				type:"POST",
				data:{orderId:this.orderId}
			}).then(res => {
				this.$set(this.order,"status",3)
				uni.showToast({
					title:"已收货"
				})
			}).catch(_ => {})
			uni.hideLoading();
		},
		async getData(){
			await this.$http({
				apiName:"getOrderDetail",
				data:{orderId:this.orderId}
			}).then(res => {
				this.orderItems = res.data.orderItems;
				this.order = res.data.order;
				this.groupList = res.data.groupList;  //团成员不包括本人，本人单独放上去
				this.grouponRules = res.data.grouponRules;
				this.currentTime = res.timestamp;
				if(this.currentTime < this.grouponRules.endTime){  //时间没到
					if((this.groupList.length + 1) < this.grouponRules.minMember){  //时间没到人没够
						this.groupStatus = 1;
					}else{  //时间没到人够了
						this.groupStatus = 2;
					}
				}else{
					if((this.groupList.length + 1) < this.grouponRules.minMember){  //时间到了人没够
						this.groupStatus = 3;
					}else{  //时间到了人够了
						this.groupStatus = 4;
					}
				}
			}).catch(_ => {})
		},
		//售后
		afterSale(){
			uni.navigateTo({
				url:`/pages/afterSale/afterSale?id=${this.orderId}`
			})
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
		share(){
			this.$refs.share.toggleMask();	
		},

		shareOthers(e){
			let name = "";
			if(e == "微信好友" ){
				name = "WXSceneSession";
				// #ifdef APP-PLUS
				utils.wxShare({
					name,
					type: e,
					gid: this.grouponRules.id
				})
				// #endif
				
			}else if(e == "朋友圈"){
				name = "WXSenceTimeline";
				// #ifdef APP-PLUS
				utils.wxShare({
					name,
					type: e,
					gid: this.grouponRules.id
				})
				// #endif
			}else if(e == "复制链接"){
				const code = this.userInfo.inviteCode;
				utils.setClip({
					code,
					id: this.grouponRules.id
				})
			} 
			
		}
	},
	onLoad(opt) {
		if(opt.id){
			this.orderId = opt.id
			this.getData()
		}
	},
	filters:{
		dealTime(val){
			return utils.unixToDatetime(val) || ""
		},
		dealTimep(val,currentTime){
			let _str = utils.transToDate(val - currentTime);
			return _str.h + "小时" + _str.m + "分钟"
		}
	}
}
</script>

<style lang="scss" scoped>
	.sWrap{
		.swrap-box1{
			display: flex;
			padding: 32rpx;
			align-items: center;
			.swb1-left{
				padding-top: 20rpx;
				padding-bottom: 20rpx;
				.swrap-box1c{
					width: 88rpx;
					height: 88rpx;
					border-radius: 50%;
					text-align: center;
					background-color: #F23D3D;
					margin-right: 24rpx;
					.swb1-img{
						width: 36rpx;
						height: 44rpx;
						margin-top: 22rpx;
					}
				}
			}
			.swb1-right{
				flex: 1;
				color: #303133;
				font-size: 28rpx;
				.swb1-right-top{
					margin-bottom: 10rpx;
					.swb1-rit1{
						margin-right: 42rpx;
					}
				}
				.swb1-right-top2{
					color: #F23D3D;
					font-weight: bold;
				}
				.swb1-right-boo{
					.swb1-right-boo-item{
						margin-right: 10rpx;
					}
				}
			}
		}
		.swrap-group{
			border-top: 20rpx solid #F9FAFB;
			.sgp1{
				display: flex;
				align-items: center;
				padding: 20rpx 30rpx;
				margin-top: 20rpx;
				.img1{
					width: 74rpx;
					height: auto;
				}
				.img2{
					width: 118rpx;
					height: auto;
				}
				.img3{
					width: 142rpx;
					height: auto;
				}
				.text{
					color: #606266;
					font-size: 28rpx;
					margin-left: 10rpx;
				}
			}
			.fgGroup{
				padding-left: 60rpx;
				padding-right: 60rpx;
				margin-top: 40rpx;
				.fgInfo{
					display: flex;
					justify-content: center;
					align-items: center;
					.ptImg{
						width: 90rpx;
					}
					.ptText{
						color: #606266;
						font-size: 28rpx;
						margin-left: 16rpx;
					}
				}
			}
			.ptImgs{
				// margin-top: 40rpx;
				padding-left: 40rpx;
				font-size: 28rpx;
				display: flex;
				align-items: center;
				justify-content: left;
				.fpNumstImg{
					margin-left: -20rpx;
					display: inline-block;
					.img{
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;
						border: 2rpx solid #fff;
					}
				}
				.fightImgMine{
					background-color: #F23D3D;
					color: #fff;
					font-size: 20rpx;
					border-radius: 20rpx;
					padding: 0 8rpx;
					align-self: flex-start;
					margin-left: -30rpx;
					z-index: 9;
				}
			}
		}
		.swrap-box2{
			border-top: 20rpx solid #F9FAFB;
			padding: 32rpx;
			.swb2-item{
				padding-bottom: 30rpx;
				border-bottom: 2rpx solid #DBDBDB;
				display: flex;
				.swb2-item1{
					width: 120rpx;
					height: 120rpx;
					border-radius: 8rpx;
					background: #C0C4CC;
					margin-right: 20rpx;
					.swb2-item-img{
						width: 120rpx;
						height: 120rpx;
						border-radius: 8rpx;
					}
				}
				.swb2-item3{
					flex: 1;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.swb2-item2{
						.swb2-item2-title{
							color: #303133;
							font-size: 30rpx;
						}
						.swb2-item2-cont{
							margin-top: 24rpx;
							.swb2-item2-text1{
								color: #F23D3D;
								font-size: 32rpx;
								margin-right: 20rpx;
							}
							.swb2-item2-text2{
								color: #909399;
								font-size: 24rpx;
							}
						}
					}
					.swb2-item4{
						width: 30%;
						color: #909399;
						font-size: 26rpx;
						text-align: right;
					}
				}
			}
			.swb2-item:last-child{
				border-bottom: none;
			}
			.swb-total{
				text-align: right;
				margin-top: 20rpx;
				.swb-total-text1{
					color: #909399;
					font-size: 24rpx;
				}
				.swb-total-text2{
					color: #F23D3D;
					font-size: 36rpx;
				}
			}
			.swb2-foot{
				margin-top: 20rpx;
				.swb2f-btn1{
					display: inline-block;
					border: 2rpx solid #E4E4E4;
					padding: 10rpx 20rpx;
					color: #4A4B4C;
					font-size: 26rpx;
					border-radius: 30rpx;
					margin-right: 20rpx;
				}
				.swb2f-btn2{
					border-color: #F23D3D;
					color: #F23D3D;
				}
			}
		}
		.swrap-box3{
			padding: 32rpx;
			border-top: 20rpx solid #F9FAFB;
			.swrap-box3-title{
				font-size: 30rpx;
				color: #606266;
			}
			.swrap-box3-cont{
				margin-top: 10rpx;
				.swrap-box3-item{
					line-height: 40rpx;
					color: #909399;
					font-size: 26rpx;
					.swrap-box3-text1{
						color: #477CE5;
					}
					.iconfuzhi{
						margin-left: 20rpx;
					}
				}
			}
		}
	}
</style>
