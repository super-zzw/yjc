<template>
	<view class="sWrap">
		<view class="sbox">
			<view class="sbox-itme">
				<text class="sbt-text">物流单号：</text>
				<input class="sbt-input" type="text" v-model="orderNm" />
				<!-- <image class="sbt-scan" src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/scan.png" mode="" @tap="sacnQrcode"></image> -->
			</view>
			<view class="sbox-itme">
				<text class="sbt-text">物流公司：</text>
				<input class="sbt-input" type="text" v-model="orderCom" value="" />
			</view>
		</view>
	</view>
</template>

<script>
export default{
	data(){
		return {
			orderNm:"",
			orderCom:"",
			id:"",//售后id
		}
	},
	methods:{
		async save(){
			if(!this.orderNm.trim() || !this.orderCom.trim()){
				uni.showToast({
					icon:"none",
					title:"物流信息不完整"
				})
				return
			}
			uni.showLoading({
				title:"保存中..."
			})
			await this.$http({
				apiName:"putDeliver",
				type:"POST",
				data:{
					applyId:this.id,
					deliveryCompany:this.orderCom,
					deliverySn:this.orderNm
				}
			}).then(res => {
				uni.showToast({
					title:"保存成功"
				})
				uni.navigateBack()
			}).catch(_ => {})
			uni.hideLoading()
		},
		sacnQrcode(){
			let _self = this
			uni.scanCode({
			    success: function (res) {
					_self.orderNm = res.result
			    }
			});
		},
	},
	onLoad(opt) {
		this.id = opt.id
	},
	//点击导航栏 buttons 时触发
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
		
		this.save()
	}
}
</script>

<style lang="scss" scoped>
.sWrap{
	min-height: calc(100vh - 88rpx);
	background-color: #F9FAFB;
	.sbox{
		background-color: #fff;
		padding: 32rpx;
		padding-top: 0;
		.sbox-itme{
			padding-top: 20rpx;
			padding-bottom: 20rpx;
			border-bottom: 2rpx solid #DBDBDB;
			display: flex;
			justify-content: space-between;
			.sbt-text{
				color: #606266;
				font-size: 28rpx;
			}
			.sbt-input{
				color: #303133;
				font-size: 28rpx;
				flex: 1;
			}
			.sbt-scan{
				width: 36rpx;
				height: 36rpx;
			}
		}
	}
}
</style>
