<template>
	<view class="uni-numbox" :class="selfName">
		<view class="uni-numbox-minus" 
			@click="_calcValue('subtract')"
		>
			<text class="iconfont iconjian" :class="minDisabled?'uni-numbox-disabled': ''" ></text>
		</view>
		<input 
			class="uni-numbox-value" 
			type="number" 
			:disabled="disabled"
			:value="inputValue" 
			@blur="_onBlur"
		>
		<view 
			class="uni-numbox-plus" 
			@click="_calcValue('add')"
		>
			<text class="iconfont iconjia" :class="maxDisabled?'uni-numbox-disabled': ''" ></text>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'uni-number-box',
		props: {
			isMax: {
				type: Boolean,
				default: false
			},
			isMin: {
				type: Boolean,
				default: false
			},
			index: {
				type: Number,
				default: 1
			},
			value: {
				type: Number,
				default: 1
			},
			min: {
				type: Number,
				default: -Infinity
			},
			max: {
				type: Number,
				default: Infinity
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			},
			cartId:{
				type:String,
				default:""
			},
			otherData:{
				type:Object,
				default:null,
				required: false
			},
			selfName:{
				type:String,
				default:""
			}
		},
		data() {
			return {
				inputValue: this.value,
				minDisabled: false,
				maxDisabled: false
			}
		},
		created(){
			this.maxDisabled = this.isMax;
			this.minDisabled = this.isMin;
			// console.log(this.cartId)
		},
		computed: {

		},
		watch: {
			inputValue(number) {
				const data = {
					number: number,
					index: this.index,
					cartId:this.cartId,
					item:this.otherData
				}
				this.$emit('eventChange', data);
			}
		},
		methods: {
			_calcValue(type) {
				const scale = this._getDecimalScale();
				let value = this.inputValue * scale;
				let newValue = 0;
				let step = this.step * scale;
				
				if(type === 'subtract'){
					newValue = value - step;
					if (newValue <= this.min){
						this.minDisabled = true;
					}
					if(newValue < this.min){
						newValue = this.min
					}
					if(newValue < this.max && this.maxDisabled === true){
						this.maxDisabled = false;
					}
				}else if(type === 'add'){
					newValue = value + step;
					if (newValue >= this.max){
						this.maxDisabled = true;
					}
					if(newValue > this.max){
						newValue = this.max
					}
					if(newValue > this.min && this.minDisabled === true){
						this.minDisabled = false;
					}
				}
				if(newValue === value){
					return;
				}
				this.inputValue = newValue / scale;
			},
			_getDecimalScale() {
				let scale = 1;
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + '').split('.')[1].length);
				}
				return scale;
			},
			_onBlur(event) {
				let value = event.detail.value;
				if (!value) {
					this.inputValue = 0;
					return
				}
				value = +value;
				if (value > this.max) {
					value = this.max;
				} else if (value < this.min) {
					value = this.min
				}

				this.inputValue = value
			}
		}
	}
</script>
<style lang="scss">
	.uni-numbox {
		position:absolute;
		left: 30rpx;
		bottom: 0;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width:230rpx;
		height: 70rpx;
		background:#f5f5f5;
	}

	.uni-numbox-minus,
	.uni-numbox-plus {
		margin: 0;
		background-color: #ffff;
		width: 70rpx;
		height: 100%;
		line-height: 70rpx;
		text-align: center;
		position: relative;
		border-radius: 0!important;
	}
	
	.uni-numbox-minus .iconfont,
	.uni-numbox-plus .iconfont{
		font-size: 36rpx;
		color: #555;
	}

	.uni-numbox-minus {
		border-right: none;
	}

	.uni-numbox-plus {
		border-left: none;
	}

	.uni-numbox-value {
		position: relative;
		background-color: #fff;
		width: 90rpx;
		height: 50rpx;
		text-align: center;
		padding: 0;
		font-size: 30rpx;
	}

	.uni-numbox-disabled.iconfont {
		color: #d6d6d6;
	}
</style>
