<template>
	<view class="content">
		
		<view class="mix-list-cell" :class="border" hover-class="cell-hover"  :hover-stay-time="50">
			<text
				v-if="iconfont"
				class="cell-icon"
				:style="[{
					color: iconColor,
				}]"
				:class="iconfont"
			></text>
			<text class="cell-tit clamp">{{title}}</text>
			<text class="cell-tip">{{tips}}</text>
			<text class="iconfont iconright"></text>
		</view>

	</view>
</template>
 
<script>
	/**
	 *  简单封装了下， 应用范围比较狭窄，可以在此基础上进行扩展使用
	 *  比如加入image， iconSize可控等
	 */
	export default {
		data() {
			return {
			}
		},
		props: {
			iconfont: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: ''
			},
			tips: {
				type: String,
				default: ''
			},
			iconColor: {
				type: String,
				default: '#333'
			},
			border: {
				type: String,
				default: 'b-b'
			},
		}
	}
</script>

<style lang='scss'>

	.icon .mix-list-cell.b-b:after{
		left: 90rpx;
	}
	.mix-list-cell{
		display:flex;
		align-items:baseline;
		padding: 20rpx $page-row-spacing;
		line-height:60rpx;
		position:relative;
		
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30rpx;
		}

		.cell-icon{
			align-self:center;
			width:56rpx;
			max-height:60rpx;
			font-size:38rpx;
		}
		.cell-more{
			align-self: center;
			font-size:30rpx;
			color:$font-color-base;
			margin-left:$uni-spacing-row-sm;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
			margin-right:10rpx;
		}
		.cell-tip{
			font-size: $font-sm+2rpx;
			color: $font-color-light;
		}
		.iconright{
			color: #C0C4CC;
			font-size: 24rpx;
		}
	}
</style>
