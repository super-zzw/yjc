<template>
	<view class="container" v-if="config">
		<image :src="config.POSTER_RULE" class="posterImg"></image>
	   <!-- <view class="method">
		   <view class="title">
			     <text class="point"></text>
			   <text class="txt">参与方式</text>
			   <text class="point"></text>
			</view>
		    
	   </view> -->
	   <button type="default" class="inviteBtn" @tap="handleInvite">立即邀请</button>
	   <share
	   	ref="share" 
	   	:contentHeight="400"
	   	:shareList="shareList"
	   	@invite="shareOthers"
	   ></share>
	</view>
</template>

<script>
	import Share from "../../components/share.vue";
	import utils from '@/utils/method.js'
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				shareList:[
					{
						icon: "https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/wxhy.png",
						text: "微信好友"
					},
					{
						icon: "../image/pyq.png",
						text: "朋友圈"
					},
					{
						icon: "../image/hb.png",
						text: "生成海报"
					},
					{
						icon: "../image/fzlj.png",
						text: "复制链接"
					},
				],
				info:{}
			};
		},
		computed:{
			...mapState(['config'])
		},
		components:{Share},
		async onLoad() {
			await this.getInfo();
		},
		methods:{
			getInfo(){
				this.$http({
					apiName:"DistributionInfo"
				}).then(res => {
					this.info = res.data;
				}).catch(err => {})
			},
			handleInvite(){
				this.$refs.share.toggleMask();	
			},
			shareOthers(e){
				let name = "";
				if(e == '微信好友'){
					name = "WXSceneSession";
					// #ifdef APP-PLUS
					this.appShare(name,e);
					// #endif
				}else if(e == '朋友圈'){
					name = "WXSenceTimeline";
					// #ifdef APP-PLUS
					this.appShare(name,e);
					// #endif
				}else if(e == '生成海报'){
					uni.navigateTo({
						url:"/pagesE/distribution/makePoster"
					})
				}else if(e == '复制链接'){
					let _this = this;
					uni.setClipboardData({
						data: _this.info.distributeInviteUrl,
						success(res) {
							uni.showToast({
								title: "复制成功，请前往浏览器打开",
								icon: "none"
							})
						}
					});
				}
			},
			appShare(name,type){
				let _self = this;
				uni.share({
					provider: "weixin",
					scene: name,
					type:0,
					title: _self.info.distributeInviteTitle,
					imageUrl: _self.info.distributeInviteImg,
					summary: _self.info.distributeInviteDescription,
					href: _self.info.distributeInviteUrl,
					success(res) {
						console.log(res);
					},
					fail(err){
						console.log(err);
					}
				})
			},
		},
		
	}
</script>

<style lang="scss" scoped>
   .container{
	   height:calc(100vh - 88rpx);
	   width: 100vw;
	   .posterImg{
		   width: 100%;
		   height: 100%;
		   display: block;
	   }
	   .method{
		   position: absolute;
		   bottom: 170rpx;
		   left: 32rpx;
		   background: url(../image/bg1.png);
		   width: 686rpx;
		   height:310rpx ; 
		   background-size: 100% ;
		   display: flex;
		   // justify-content: center;
		   flex-direction: column;
		   align-items: center;
		   .title{
			   margin-top: 30rpx;
			   width:230rpx;
			   height:64rpx;
			   background:linear-gradient(180deg,rgba(250,112,112,1) 0%,rgba(234,56,56,1) 100%);
			   box-shadow:0rpx 4rpx 14rpx 0rpx rgba(240,55,55,0.3);
			   border-radius:35rpx;
			   font-size:36rpx;
			   font-family:PingFangSC-Medium,PingFang SC;
			   font-weight:500;
			   color:rgba(255,255,255,1);
			   display: flex;
			   justify-content: center;
			   align-items: center;
		   }
		   .txt{
			   margin: 0 12rpx;
		   }
		   .point{
			   width: 8rpx;
			   height: 8rpx;
			   border-radius: 50%;
			   background: #fff;
		   }
		   // margin: 0 32rpx;
	   }
	   .inviteBtn{
		   position: absolute;
		   bottom: 50rpx;
		   left: 32rpx;
		   width: 686rpx;
		   border-radius: 44rpx;
		height: 88rpx;
		   background:linear-gradient(180deg,rgba(255,213,79,1) 0%,rgba(255,156,0,1) 100%);
		   font-size:30rpx;
		   font-family:PingFangSC-Semibold,PingFang SC;
		   font-weight:600;
		   color:rgba(242,61,61,1);
	   }
   }
</style>
