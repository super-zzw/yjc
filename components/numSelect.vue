<template>
	<view>
		<view class="countBox box1" v-if="!counting" @tap="counting=true,$emit('changeValue',Number(price))">+</view>
		<view v-if="counting" class="counting">
			<view class="countBox box2" @tap="subtract">-</view>
			<view class="content">{{num}}</view>
			<view class="countBox box2" @tap="add">+</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:['price'],
		data() {
			return {
               counting:false,
			   num:1,
			 
			};
		},
		methods:{
			subtract(){
				if(this.num==1){
					return
				}else{
					this.num--
					
					this.$emit('changeValue',Number(-this.price) )
				}
			},
			add(){
				this.num++
			
				this.$emit('changeValue',Number(this.price))
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
