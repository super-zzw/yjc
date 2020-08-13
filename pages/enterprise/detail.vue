<template>
	<view>
		<view class="sbox">
			<image :src="dataInfo.picUrl" mode="widthFix" class="image_1"></image>
			<view class="info">
				<text class="title">{{dataInfo.title}}</text>
				<view class="box1">
					<text class="left">¥{{dataInfo.promotionPrice}}</text>
					<!-- <text class="right">+</text> -->
				</view>
			</view>
		</view>
		<view class="mt"></view>
		<view class="sbox sbox2">
			<text class="txt1">- 图文详情 -</text>
			<rich-text :nodes="dataInfo.descriptionHtml"></rich-text>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				enterpriseServicesId:"",
				dataInfo:""
			};
		},
		onLoad(opt) {
			if(opt.enterpriseServicesId){
				this.enterpriseServicesId = opt.enterpriseServicesId;
				this.getData()
			}
		},
		methods:{
			async getData(){
				await this.$http({
					apiName:"cpDetail",
					data:{
						enterpriseServicesId:this.enterpriseServicesId
					}
				}).then(res => {
					this.dataInfo = res.data;
					if(this.dataInfo.albumPics){
						this.dataInfo.albumPics = JSON.parse(this.dataInfo.albumPics)
					}
				}).catch(_ => {})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #F9FAFB;
	}
	.mt{
		height: 40rpx;
	}
	
	.sbox{
		background: #fff;
		display: flex;
		flex-direction: column;
		// align-items: center;
		.image_1{
			  width: 100%;
		}
		.info{
			padding: 0 32rpx;
			display: flex;
			flex-direction: column;
			.title{
				margin-top:32rpx ;
				font-size:32rpx;
				font-family:PingFangSC-Medium,PingFang SC;
				font-weight:600;
				color:rgba(48,49,51,1);
				line-height:44rpx;
				overflow: hidden;
				
				// text-overflow:ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}
			.box1{
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;
				.left{
					font-size:36rpx;
					font-weight:600;
					color:rgba(242,61,61,1);
					line-height:50rpx;
				}
				.right{
					width:56rpx;
					height:50rpx;
					background:rgba(242,61,61,1);
					border-radius:8rpx;
					color: #fff;
					text-align: center;
				}
			}
		}
		.txt1{
			margin: 40rpx 0 50rpx;
		}
		
	}
	.sbox2{
		align-items: center;
	}
</style>
