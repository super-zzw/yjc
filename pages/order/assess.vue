<template>
	<view class="sWrap">
		<view class="sBox">
			<view class="sBox-item" v-for="(item,index) in dataList" :key="index">
				<view class="sBox-item-box">
					<view class="s-box-itop">
						<view class="s-itop-pic">
							<image class="s-itop-img" :src="item.picUrl" mode=""></image>
						</view>
						<view class="s-itop-text">{{item.productName}}</view>
					</view>
					<view class="s-box-imgs">
						<view class="s-box-imgitem" @tap = changeStar(5,item.star,index) :class="{sbiiactive:item.star == 5}">
							<text class="iconfont iconhaoping s-box-icon"></text>
							<text class="s-box-text">好评</text>
						</view>
						<view class="s-box-imgitem" @tap = changeStar(3,item.star,index) :class="{sbiiactive:item.star == 3}">
							<text class="iconfont iconzhongping s-box-icon"></text>
							<text class="s-box-text">中评</text>
						</view>
						<view class="s-box-imgitem" @tap = changeStar(1,item.star,index) :class="{sbiiactive:item.star == 1}">
							<text class="iconfont iconchaping s-box-icon"></text>
							<text class="s-box-text">差评</text>
						</view>
					</view>
				</view>
				<view class="sBox-setCont">
					<textarea placeholder-style="color:#C0C4CC;" class="sBox-text-cont" v-model="item.content" placeholder="亲，你对这个商品满意吗？写下你的评价吧…(140字以内)" />
					<view class="add-imgbox">
						<image class="add-img2" v-for="(iImg,Iindex) in item.pics" :key="Iindex" :src="iImg"></image>
						<view v-if="item.pics.length < 3" class="add-img-items" @tap="addImg(index)">
							<image class="add-img" src="https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/cymall/img/add.png" mode="widthFix"></image>
						</view>
					</view>
				</view>
				<view class="pingjia">
					<label class="pingjia-label" @tap="checkChange(item.anonymousType,index)">
						<checkbox :checked="item.anonymousType == 0" class="pingjia-box" />
						<text class="pingjia-text">匿名评价</text>
					</label>
				</view>
			</view>
		</view>
		<view class="sBtns">
			<view class="sBtn" @tap="submit">提交评价</view>
		</view>
	</view>
</template>

<script>
export default{
	data(){
		return {
			orderId:"",
			dataList:[],
			btnDisable: false
		}
	},
	methods:{
		async getData(){
			var that = this
			await this.$http({
				apiName:"getOrderDetail",
				data:{orderId:this.orderId}
			}).then(res => {
				res.data.orderItems.map(function(item){
					that.dataList.push({
						picUrl:item.picUrl,
						productName:item.productName,
						
						productId:item.productId,
						orderId:item.orderId,
						star:5,
						content:"",
						pics:[],
						anonymousType:0,  //匿名，1公开
					})
				})
			}).catch(_ => {})
		},
		checkChange(val,index){
			if(val == 0){
				this.$set(this.dataList[index],"anonymousType",1)
			}else{
				this.$set(this.dataList[index],"anonymousType",0)
			}
		},
		changeStar(num,val,index){
			if(val == num){
				return
			}else{
				this.$set(this.dataList[index],"star",num)
			}
		},
		addImg(index){
			uni.chooseImage({
				count: 1,  //可选择张数
				sizeType: ['original', 'compressed'],
				sourceType: ['album'],
				success: (res) => {
					this.$upLoadImg({
						apiName:"uploadImg",
						filePath:res.tempFilePaths[0],
						name:"file",
					}).then(ret => {
						this.dataList[index].pics.unshift(ret.data)
					}).catch(_ => {})
				}
			});
		},
		async submit(){
			if(this.btnDisable){
				return;
			}
			this.btnDisable = true;
			let params = []
			this.dataList.map(function(item){
				params.push({
					productId:item.productId,
					orderId:item.orderId,
					star:item.star,
					content:item.content,
					pics:item.pics,
					anonymousType:item.anonymousType,
				})
			})
			await this.$http({
				apiName:"putComment",
				type:"POST",
				data:{params:JSON.stringify(params)}
			}).then(res => {
				this.btnDisable = false;
				uni.redirectTo({
					url:'/pages/order/myAssess'
				})
			}).catch(_ => {
				this.btnDisable = false;
			})
		}
	},
	onLoad(opt){
		if(opt.id){
			this.orderId = opt.id
			this.getData()
		}
	}
}
</script>

<style lang="scss" scoped>
.sWrap{
	min-height: 100vh;
	padding-bottom: 150prx;
	box-sizing: border-box;
	background-color: #F9FAFB;
	.sBox{
		.sBox-item{
			margin-bottom: 30rpx;
			.sBox-item-box{
				padding: 32rpx;
				background-color: #fff;
			}
			.s-box-itop{
				padding-bottom: 32rpx;
				display: flex;
				align-items: center;
				border-bottom: 2rpx solid #DBDBDB;
				.s-itop-pic{
					background: #C0C4CC;
					width: 100rpx;
					height: 100rpx;
					border-radius: 4rpx;
					margin-right: 20rpx;
					.s-itop-img{
						width: 100rpx;
						height: 100rpx;
						border-radius: 4rpx;
					}
				}
				.s-itop-text{
					flex: 1;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					color: #303133;
					font-size: 30rpx;
				}
			}
			.s-box-imgs{
				padding-top: 20rpx;
				display: flex;
				justify-content: space-between;
				.s-box-imgitem{
					display: flex;
					align-items: center;
					color: #909399;
					.s-box-icon{
						font-size: 40rpx;
						margin-right: 12rpx;
					}
					.s-box-text{
						font-size: 30rpx;
					}
				}
				.sbiiactive{
					color: #F23D3D;
				}
			}
			.sBox-setCont{
				background-color: #fff;
				padding: 32rpx;
				margin-top: 20rpx;
				.sBox-text-cont{
					color: #303133;
					font-size: 26rpx;
					height: 200rpx;
				}
				.add-imgbox{
					margin-top: 20rpx;
					display: flex;
					align-items: center;
					.add-img-items{
						border: 2rpx dashed #E3E5E7;
						width: 140rpx;
						box-sizing: border-box;
						height: 140rpx;
						text-align: center;
						border-radius: 8rpx;
						.add-img{
							margin-top: 30rpx;
							width: 80rpx;
							height: auto;
						}
					}
					.add-img2{
						margin-right: 20rpx;
						width: 140rpx;
						height: 140rpx;
						border-radius: 8rpx;
					}
				}
			}
			.pingjia{
				padding: 32rpx;
				.pingjia-label{
					display: flex;
					align-items: baseline;
					.pingjia-box{
						// margin-right: 10rpx;
					}
					.pingjia-text{
						color: #909399;
						font-size: 26rpx;
					}
				}
			}
		}
	}
	.sBtns{
		position: fixed;
		bottom: 60rpx;
		left: 0;
		width: 100%;
		padding-left: 32rpx;
		padding-right: 32rpx;
		.sBtn{
			background-color: #F23D3D;
			border-radius: 8rpx;
			color: #fff;
			font-size: 36rpx;
			text-align: center;
			line-height: 88rpx;
		}
	}
}
</style>
