<template>
	<view v-if="show" class="mask" @click="toggleMask" @touchmove.stop.prevent="stopPrevent"
		:style="{backgroundColor: backgroundColor}"
	>
		<view 
			class="mask-content"
			@click.stop.prevent="stopPrevent"
			:style="[{
				height: config.height, 
				transform: transform
			}]"
		>
			<scroll-view class="view-content" scroll-y>
				<view class="share-header">
					分享到
				</view>
				<!-- #ifdef APP-PLUS || H5 -->
					<view class="share-list">
						<view 
							v-for="(item, index) in shareList" :key="index"
							class="share-item" 
							@click="shareToFriend(item.text)"
						>
							<!-- <image :src="item.icon" mode=""></image> -->
							<!-- uniapp的坑 -->
							<image v-if="item.text == '微信好友'" src="https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/wxhy.png" mode=""></image>
							<image v-if="item.text == '朋友圈'" src="https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/pyq.png" mode=""></image>
							
							<image v-if="item.text == '复制链接'" src="https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/fzlj.png" mode=""></image>
							<text>{{item.text}}</text>
						</view>
					</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
					<view class="share-list">
						<button 
							v-for="(item, index) in shareList" :key="index"
							class="share-item btn" 
							@click="shareToFriend(item.text)"
							hover-class="none"
							:open-type="index === 0 ? 'share':''"
							v-if="index !== 1"
						>
							<image :src="item.icon" mode=""></image>
							<text>{{item.text}}</text>
						</button>
					</view>
				<!-- #endif -->
			</scroll-view>
			<view class="bottom b-t" @click="toggleMask">取消</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				transform: 'translateY(50vh)',
				timer: 0,
				backgroundColor: 'rgba(0,0,0,0)',
				show: false,
				config: {},
			};
		},
		props:{
			contentHeight:{
				type: Number,
				default: 0
			},
			//是否是tabbar页面
			hasTabbar:{
				type: Boolean,
				default: false
			},
			shareList:{
				type: Array,
				default: function(){
					return [];
				}
			}
		},
		created() {
			const height = uni.upx2px(this.contentHeight) + 'px';
			this.config = {
				height: height,
				transform: `translateY(${height})`,
				backgroundColor: 'rgba(0,0,0,.4)',
			}
			this.transform = this.config.transform;
		},
		methods:{
			toggleMask(){
				//防止高频点击
				if(this.timer == 1){
					return;
				}
				this.timer = 1;
				setTimeout(()=>{
					this.timer = 0;
				}, 500)
				
				if(this.show){
					this.transform = this.config.transform;
					this.backgroundColor = 'rgba(0,0,0,0)';
					setTimeout(()=>{
						this.show = false;
						this.hasTabbar && uni.showTabBar();
					}, 200)
					return;
				}
				
				this.show = true;
				//等待mask重绘完成执行
				if(this.hasTabbar){
					uni.hideTabBar({
						success: () => {
							setTimeout(()=>{
								this.backgroundColor = this.config.backgroundColor;
								this.transform = 'translateY(0px)';
							}, 10)
						}
					});
				}else{
					setTimeout(()=>{
						this.backgroundColor = this.config.backgroundColor;
						this.transform = 'translateY(0px)';
					}, 10)
				}
			},
			//防止冒泡和滚动穿透
			stopPrevent(){},
			//分享操作
			shareToFriend(type){
				this.$emit('invite',type);
				this.toggleMask();
			},
		}
	}
</script>

<style lang='scss'>
	.mask{
		position:fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display:flex;
		justify-content: center;
		align-items: flex-end;
		z-index: 998;
		transition: .3s;
		.bottom{
			position:absolute;
			left: 0;
			bottom: 0;
			display:flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 90rpx;
			background: #fff;
			z-index: 9;
			font-size: $font-base + 2rpx;
			color: $font-color-dark;
		}
	}
	
	.mask-content{
		width: 100%;
		height: 580rpx;
		transition: .3s;
		background: #fff;
		&.has-bottom{
			padding-bottom: 90rpx;
		}
		.view-content{
			height: 100%;
		}
	}
	.share-header{
		height: 110rpx;
		font-size: $font-base+2rpx;
		color: font-color-dark;
		display:flex;
		align-items:center;
		justify-content: center;
		padding-top: 10rpx;
		&:before, &:after{
			content: '';
			width: 240rpx;
			heighg: 0;
			border-top: 1px solid $border-color-base;
			transform: scaleY(.5);
			margin-right: 30rpx;
		}
		 &:after{
			 margin-left: 30rpx;
			 margin-right: 0;
		 }
	}
	.share-list{
		display:flex;
		flex-wrap: wrap;
		
	}
	.share-item{
		flex: 1;
		display:flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 180rpx;
		image{
			width: 80rpx;
			height: 80rpx;
			margin-bottom: 16rpx;
		}
		text{
			font-size: $font-base;
			color: $font-color-base;
		}
	}
	.btn{
		outline: 0;
		border: 0;
		background-color: transparent;
		image{
			margin-bottom: 0;
		}
		&::after{
			border: none;
		}
	}
</style>
