<template>
	<view class="content">
		<text class="iconfont iconchenggong"></text>
		<text class="tit" v-if="this.fightData.group.length >= this.fightData.minMember">恭喜你拼团成功，待平台发货</text>
		<text class="tit" v-if="this.fightData.group.length < this.fightData.minMember">你已成功参团</text>
		<view class="fgGroup" v-if="this.fightData.group.length < this.fightData.minMember">
			<view class="fgInfo">
				<image src="https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/ptz.png" class="ptImg" mode="widthFix"></image>
				<text class="ptText">还差{{this.fightData.minMember - this.fightData.group.length}}人拼成，剩{{trDate.d}}天{{trDate.h}}小时{{trDate.m}}分钟结束</text>
			</view>
			<view class="ptImgs">
				<view class="fpNumstImg" v-for="(imgItem,imgIndex) in fightData.group" :key="imgIndex">
					<image v-if="imgItem.icon && imgIndex < 10" class="img" :src="imgItem.icon" mode=""></image>
				</view>
				<view class="fpNumstImg">
					<image class="img" :src="userInfo.icon" mode=""></image>
				</view>
				<view class="fightImgMine">
					待支付
				</view>
			</view>
		</view>
		<view class="btn-group">
			<view  class="mix-btn" @tap="share">邀请好友参团</view>
			<navigator open-type="switchTab" url="/pages/index/index" class="mix-btn hollow">返回首页</navigator>
			<!-- <navigator open-type="reLaunch" url="/pages/index/index" class="mix-btn hollow">返回首页</navigator> -->
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
	import utils from '../../utils/method.js'
	import Share from "../../components/share.vue";
	export default {
		components:{
			Share
		},
		onShareAppMessage(res) {
			return utils.homeShare({
				path: "/pages/fight/productDetail?id=" + this.fightData.id
			})
		},
		data() {
			return {
				isDh:0,
				fightData:null,
				trDate:null,
				shareList:[
					{
						icon: "https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/wxhy.png",
						text: "微信好友"
					},
					{
						icon: "https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/pyq.png",
						text: "朋友圈"
					},
					{
						icon: "https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/fzlj.png",
						text: "复制链接"
					},
				],
			}
		},
		methods: {
			//获取商品详情
			async getDetail(){
				await this.$http({
					apiName:"fightDetail",
					data:{groupRulesId:3}
				}).then(res => {
					this.fightData = res.data.rules;
					let _currentTime = res.timestamp;
					var etime = this.fightData.endTime - _currentTime;
					if(etime > 0){
						this.trDate = utils.transToDate(etime);
					}
					this.$set(this.fightData,"group",res.data.group);
					if(this.fightData.group.length >= this.fightData.minMember){
						uni.setNavigationBarTitle({
							title:"拼团成功"
						})
					}else{
						uni.setNavigationBarTitle({
							title:"参团成功"
						})
					}
				}).catch(_ => {})
				this.creset = true;
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
						gid: this.fightData.id
					})
					// #endif
					
				}else if(e == "朋友圈"){
					name = "WXSenceTimeline";
					// #ifdef APP-PLUS
					utils.wxShare({
						name,
						type: e,
						gid: this.fightData.id
					})
					// #endif
				}else if(e == "复制链接"){
					const code = this.userInfo.inviteCode;
					utils.setClip({
						code,
						id:this.fightData.id
					})
				}
				
			}
		},
		computed:{
			...mapState(['groupProductId','userInfo','config'])
		},
		onLoad() {
			this.getDetail()
		},
		onBackPress(e){
			uni.reLaunch({
				url:"/pages/order/order"
			})
			return true
		}
	}
</script>

<style lang='scss'>
	.content{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.iconfont{
			padding-top: 120rpx;
			color:#F23D3D;
			font-size: 180rpx;
		}
	}
	.success-icon{
		font-size: 160rpx;
		color: #fa436a;
		margin-top: 100rpx;
	}
	.tit{
		font-size: 38rpx;
		color: #303133;
	}
	.btn-group{
		padding-top: 100rpx;
	}
	.mix-btn {
		margin-top: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600rpx;
		height: 80rpx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10rpx;
		&.hollow{
			background: #fff;
			color: #303133;
			border: 1px solid #ccc;
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
		margin-top: 40rpx;
		padding-left: 20rpx;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
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
</style>
