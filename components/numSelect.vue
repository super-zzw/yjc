<template>
	<view>
		<view class="countBox box1" v-if="!counting" @tap="addCart">+</view>
		<view v-if="counting" class="counting">
			<view class="countBox box2" @tap="updateServiceNum(-1)">-</view>
			<view class="content">{{num}}</view>
			<view class="countBox box2" @tap="updateServiceNum(1)">+</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:['price',"id"],
		data() {
			return {
               counting:false,
			   num:1,
			   cartId:''
			};
		},
		methods:{
			async updateServiceNum(type){
				if(type==-1){
					this.num--
					if(this.num==0){
						this.counting=false
					
						// return
					}
					this.$emit('changeValue',Number(-this.price) )
				}else{
					this.num++		
					this.$emit('changeValue',Number(this.price))
				}
				await this.$http({
					apiName:"updateServiceNum",
					type:"POST",
					data:{
						cartId:this.cartId,
						num:this.num
					}
				})
			},
			subtract(){
					this.num--
					if(this.num==0){
						this.counting=false
						this.num=1
					}
					this.$emit('changeValue',Number(-this.price) )
			},
			add(){
				this.num++
				this.$emit('changeValue',Number(this.price))
			},
			async addCart(){
				this.counting=true
				if(this.num==0){
					this.num=1
				}
				this.$emit('changeValue',Number(this.price))
				uni.showLoading({
					title:'正在添加...'
				})
				await this.$http({
					apiName:'addServiceCart',
					type:'POST',
					data:{
						num:1,
						enterpriseServicesId:this.id
					}
				}).then(res=>{
					uni.showToast({
						title:'添加服务成功'
					})
					this.cartId=res.data
					uni.hideLoading()
				}).catch(err=>{uni.hideLoading()})
			}
		}
	}
</script>

<style lang="scss" scoped>
   .countBox{
   		width:56rpx;
   		height:54rpx;
   		border-radius:8rpx;
   		justify-content: center;
   		display: flex;
   		align-items: center;
   	}
   	.counting{
   		width:170rpx;
   		height:54rpx;
   		border-radius:8rpx;
   		border:2rpx solid rgba(192,196,204,1);
   		display: flex;
		box-sizing: content-box;
   		.content{
   			flex: 1;
   			font-size:28rpx;
   			font-weight:400;
   			color:rgba(48,49,51,1);
   			justify-content: center;
   			display: flex;
   			align-items: center;
   			border-left: 2rpx solid #C0C4CC;
   			border-right: 2rpx solid #C0C4CC;
   		}
   	}
   	
   	.box1{
   			background:rgba(242,61,61,1);
   			color: #fff;
   	}
   	.box2{
   		background: #fff;
   		color: #C0C4CC;
   	}
   
   
</style>
