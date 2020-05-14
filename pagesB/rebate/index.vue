<template>
	<view class="content">
		<image src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/fanli.png" mode="" class="banner"></image>
		<view class="block flex flex-column ">
			<view class="block-title flex align-items justify-center">
				<text class="smPoint one"></text><text class="bigPoint"></text> <text class="t">邀请流程</text><text class="bigPoint"></text><text class="smPoint two"></text>
			</view>
			<view class="flow flex justify-center align-items flex-column">
				<view class="flow-row flex  align-items justify-between">
					<view class="flow-block flex flex-column align-items justify-center">
						<view class="icon flex align-items justify-center flex">
							<text class="iconfont iconyaoqinghaoyouicon-yaoqingfanliye"></text>
						</view>
					</view>
					<view class="flow-row-line flex align-items">
						<view class="line" v-for="line in 9" :key="line.id"></view>
						<view class="triangle"></view>
					</view>
					<view class="flow-block flex flex-column align-items justify-center">
						<view class="icon flex align-items justify-center flex">
							<text class="iconfont iconhaoyouzhucedenglu"></text>
						</view>
					</view>
				</view>
				<view class="flow-row flex justify-between w">
					<text>邀请好友</text>
					<text>好友注册/登录</text>
				</view>
				<view class="flow-line flow-row flex justify-between  ">
					<view class="flow-row-line mid flex align-items flex-column">
						<view class="triangle t"></view>
						<view class="line t" v-for="line in 3" :key="line.id"></view>
					</view>
					<view class="flow-row-line mid flex align-items flex-column">
						<view class="line t d" v-for="line in 3" :key="line.id"></view>
						<view class="triangle b"></view>
						
					</view>
				</view>
				<view class="flow-row two flex  align-items justify-between">
					<view class="flow-block flex flex-column align-items justify-center">
						<view class="icon flex align-items justify-center flex">
							<text class="iconfont iconquerenshouhuodefanliicon-yaoqingfanliye"></text>
						</view>
					</view>
					<view class="flow-row-line flex align-items">
						<view class="line" v-for="line in 9" :key="line.id"></view>
						<view class="triangle"></view>
					</view>
					<view class="flow-block flex flex-column align-items justify-center">
						<view class="icon flex align-items justify-center flex">
							<text class="iconfont icongouwucheicon-xiangqingye"></text>
						</view>
					</view>
				</view>
				<view class="flow-row flex justify-between w h">
					<text>确认收货得返利</text>
					<text>好友下单购买商品</text>
				</view>
				
				<text class="rule" @tap="navTo('./rule')">详细规则？</text>
			</view>
		</view>
		<view class="block">
			<view class="block-title flex align-items justify-center">
				<text class="smPoint one"></text><text class="bigPoint"></text> <text class="t">我的返利</text><text class="bigPoint"></text><text class="smPoint two"></text>
				<!-- #ifdef MP-WEIXIN -->
				<text class="mpweixin" @tap="navTo('./record')">邀请记录</text>
				<!-- #endif -->
			</view>
			<view class="bottom-block flex align-items justify-between">
				<view class="bottom-block-left flex flex-column">
					<view >当前返现比例  <text class="ratio">{{dataInfo.rebateRate * 100 || 0}}%</text></view>
					<view>可提现/元  <text class="ratio">{{dataInfo.amount || 0}}</text></view>
				</view>
				<view class="bottom-block-right">
					<view class="btn flex align-items justify-center" @tap="navTo('./applyFor')">立即提现</view>
				</view>
			</view>
			<view class="bottom-table flex ">
				<view class="flex align-items flex-column justify-center">
					<text class="tips">累计</text>
					<text class="money">¥{{dataInfo.sumAmount || 0}}</text>
				</view>
				<view class="flex align-items flex-column justify-center">
					<text class="tips">已提现</text>
					<text class="money">¥{{dataInfo.withdrawAmount || 0}}</text>
				</view>
				<view class="flex align-items flex-column justify-center">
					<text class="tips">冻结中</text>
					<text class="money">¥{{dataInfo.freezeAmount || 0}}</text>
				</view>
			</view>
		</view>
		<button class="invite" @tap="share">立即邀请</button>
		<!-- 分享 -->
		<Share 
			ref="share" 
			:contentHeight="400"
			:shareList="shareList"
			@invite="shareOthers"
		></Share>
	</view>
</template>

<script>
	import Share from "../../components/share.vue";
	import utils from '@/utils/method.js'
	import {mapState } from 'vuex';
	export default{
		onShareAppMessage(res) {
			return utils.homeShare({
				path: "/pages/index/index?inviteCode=" + this.userInfo.inviteCode
			})
		},
		computed:{
			...mapState(['userInfo','config'])
		},
		data(){
			return{
				shareList:[
					{
						icon: "https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/wxhy.png",
						text: "微信好友"
					},
					{
						icon: "https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/pyq.png",
						text: "朋友圈"
					},
					{
						icon: "https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/fzlj.png",
						text: "复制链接"
					},
				],
				dataInfo:{}
			}
		},
		components:{
			Share
		},
		onNavigationBarButtonTap(e){
			const index = e.index;
			if(index == 0){
				uni.navigateTo({
					url:'./record'
				})
			}
		},
		onLoad() {
			this.getInfo();
		},
		methods:{
			navTo(path){
				uni.navigateTo({
					url: path
				})
			},
			async getInfo(){
				try{
					const res = await this.$http({
						apiName: "getRebateInfo"
					});
					this.dataInfo = res.data
				}catch(e){
					console.log(e)
				}
			},
			//分享
			share(){
				this.$refs.share.toggleMask();	
			},
			appShare(name,type,code){
				let _self = this;
				uni.share({
					provider: "weixin",
					scene: name,
					type:0,
					title: `${this.config.MALL_APP_NAME}汇聚了海内外优质商品`,
					imageUrl: _self.config.MALL_IMG_DEFAULT.groupShare,
					summary: "快来嗨购吧！",
					href: `http://web.vyunmall.com/register.html?inviteCode=${code}&id=${0}`,
					success(res) {
						console.log(res);
					},
					fail(err){
						console.log(err);
					}
				})
			},
			shareOthers(e){
				let name = "";
				const code = this.userInfo.inviteCode;
				if(e == "微信好友" ){
					name = "WXSceneSession";
					// #ifdef APP-PLUS
					this.appShare(name,e,code);
					// #endif
					
				}else if(e == "朋友圈"){
					name = "WXSenceTimeline";
					// #ifdef APP-PLUS
					this.appShare(name,e,code);
					// #endif
				}else if(e == "复制链接"){
					
					utils.setClip({
						code,
						id:1
					})
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #F9FAFB;
	}
	.invite{
		width: 686rpx;
		height: 88rpx;
		line-height: 88rpx;
		color: #FFFFFF;
		font-size: 30rpx;
		background-color: #F23D3D;
		margin: 42rpx auto;
		border-radius: 44rpx;
	}
	.content{
		.banner{
			width: 750rpx;
			height: 280rpx;
		}
		.block{
			.rule{
				color: #909399;
				font-size: 24rpx;
				margin-top: 50rpx;
			}
			&:nth-of-type(2){margin-top: 40rpx;}
			margin-top: 32rpx;
			padding: 24rpx 40rpx;
			width: 100%;
			background-color: #ffffff;
			box-shadow:0px 4rpx 20rpx 0px rgba(255,158,158,0.2);
			border-radius:8rpx;
			.flow{
				margin-top: 38rpx;
				.flow-row{
					&.flow-line{
						width: 390rpx;
					}
					&.two{
						margin-top: 8rpx;
					}
					&.w{
						width: 470rpx;
						margin-top: 6rpx;
						justify-content: flex-start;
						text{
							white-space: nowrap;
							&:first-child{
								margin-right:220rpx;
							}
						}
					}
					&.h{
						width: 558rpx;
						text{
							&:first-child{
								margin-right:165rpx;
							}
						}
					}
					width: 436rpx;
					font-size: 28rpx;
					.text{
						font-size: 28rpx;
						height: 40rpx;
						line-height: 40rpx;
						color: #303133;
						white-space: nowrap;
					}
				}
				.flow-row-line{
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					&.mid{position: relative;left: 0;transform: none;&:nth-child(2){margin-top: 8rpx;}}
					.line{width: 12rpx;height: 3rpx;background-color: #F23D3D;&:not(:nth-child(9)){margin-right: 6rpx;}}
					.line.t{margin-right: 0;margin-bottom: 6rpx;width: 3rpx; height: 12rpx;}
					.line.t.d{&:nth-child(3){margin-bottom: 0;}}
					.triangle.t{border-left: 12rpx solid transparent; border-bottom: 16rpx solid #F23D3D;border-top: 0;border-right: 12rpx solid transparent;}
					.triangle.b{border-left: 12rpx solid transparent; border-bottom: 0;border-top: 16rpx solid #F23D3D;border-right: 12rpx solid transparent;}
					.triangle{border-top: 12rpx solid transparent; border-bottom: 12rpx solid transparent; border-left: 16rpx solid #F23D3D;}
				}
				.flow-block{
					
					.icon{
						width: 72rpx;
						height: 72rpx;
						background: #FFE5E5;
						border-radius: 50%;
						.iconfont{
							color: rgb(242, 61, 61);
							font-size: 36rpx;
						}
					}
				}
				
			}
			.block-title{
				height: 42rpx;
				position: relative;
				.mpweixin{
					position: absolute;
					right: 0;
					color: rgb(144, 147, 153);
					font-size: 28rpx;
					font-weight: normal;
				}
				.t{
					font-size: 30rpx;
					color: #303133;
					margin: 0 14rpx;
				}
				.smPoint{
					width: 8rpx;
					height: 8rpx;
					background-color: #FFC1C1;
					border-radius: 50%;
					&.one{margin-right: 6rpx;}
					&.two{margin-left: 6rpx;}
				}
				.bigPoint{
					width: 12rpx;
					height: 12rpx;
					background-color: #F23D3D;
					border-radius: 50%;
				}
			}
			.bottom-block{
				font-size: 30rpx;
				color: #303133;
				margin-top: 46rpx;
				.bottom-block-left{
					view{line-height: 42rpx;margin-bottom: 14rpx;}
					.ratio{font-size: 32rpx;color: #F23D3D;font-weight: bold;margin-left: 24rpx;}
				}
				.bottom-block-right{
					.btn{padding: 10rpx 23rpx;font-size: 30rpx;color: #F23D3D;border: 2rpx solid #F23D3D;border-radius: 34rpx;font-weight: bold;}
				}
			}
			.bottom-table{
				height: 174rpx;
				background-color: #FFF5F5;
				border-radius: 4rpx;
				margin-top: 40rpx;
				view{
					flex: 1 0 33.33%;
					font-size: 30rpx;
					.money{font-size: 36rpx;margin-top: 24rpx;line-height: 50rpx;}
				}
			}
		}
	}
</style>
