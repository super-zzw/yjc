<template>
	<view>
		<!-- 弹出验证框 -->
		<view class="masks" v-if="sModal"></view>
		<view class="validateBox" :class="sModal?'active':''">
			<text class="iconfont iconclose-hei" @tap="closePass"></text>
			<text class="txt1">支付密码验证</text>
			<view class="input_area">
				<passwordInput :numLng='password' @open="openKeyboard" />
			</view>
			<text class="txt2">请输入6位数字支付密码</text>
			<numberKeyboard psdLength='6' ref='KeyboarHid' @input='clickInput' />
		</view>
	</view>
</template>

<script>
	import passwordInput from './password-input/password-input.vue'
	import numberKeyboard from './number-keyboard/number-keyboard.vue'
	import utils from '../utils/method.js'
	export default {
		props:{
				sModal:{
					default:false,
				}
			
		},
		components: {
			passwordInput,
			numberKeyboard
		},
		data() {
			return {
				password:''
			};
		},
		watch:{
			password(data) {
				if (data.length >= 6) {
					this.$http({
						apiName: 'checkPayPwd',
						type: 'POST',
						data: {
							tradepwd: utils.md5(this.password)
						}
					}).then(res => {
						this.closePass()
						this.$emit('validateOk',this.password)
						this.clear()
						
					}).catch(err => {
						this.clear()
						if(err.code==500085){
							uni.showModal({
								title: '提示',
								content:err.message+',前往修改支付密码?',
								success:(res)=> {
									if(res.confirm){
										this.$emit('navTo','/pages/set/payPwd')
										
									}
								}
							})
						}
					})
				}
			},
			sModal(val){
			
				if(val){
				
					this.$refs.KeyboarHid.open();
				}
			}
		},
		methods:{
			clickInput(val) {
				this.password = val;
			},
			closePass() {
				// this.sModal = false
			    this.$emit('close')
				this.$refs.KeyboarHid.close();
			
			},
			openKeyboard() {
				if (!this.$refs.KeyboarHid.KeyboarHid) {
					this.$refs.KeyboarHid.open();
				}
			},
			clear(){
				this.$refs.KeyboarHid.iptNum = []
			}
		}
	}
</script>

<style lang="scss" scoped>
   .masks {
   		position: fixed;
   		top: 0;
   		left: 0;
   		width: 100vw;
   		height: 100vh;
   		background: rgba(52, 52, 52, 0.7);
   	}
   	.validateBox {
   		height: 0;
   		position: fixed;
   		left: 0;
   		bottom: 0;
   		width: 100%;
   		background: #fff;
   		z-index: 999;
   		display: flex;
   		// justify-content: center;
   		flex-direction: column;
   		align-items: center;
   		// position: relative;
   		overflow: hidden;
   	
   		// opacity: 0;
   		.iconfont {
   			font-size: 30rpx;
   			position: absolute;
   			left: 20rpx;
   			top: 20rpx;
   			// left: 0;
   		}
   	
   		.txt1 {
   			margin: 38rpx 0;
   		}
   	
   		.input_area {
   			margin-top: 30rpx;
   			display: flex;
   	
   			.box {
   				width: 80rpx;
   				height: 80rpx;
   				border: 2rpx solid rgba(192, 196, 204, 1);
   				text-align: center;
   				margin-right: 20rpx;
   			}
   	
   			.box:last-child {
   				margin-right: 0;
   			}
   		}
   	
   		.txt2 {
   			font-size: 30rpx;
   			font-family: PingFangSC-Regular, PingFang SC;
   			font-weight: 400;
   			color: rgba(192, 196, 204, 1);
   			margin-top: 30rpx;
   			margin-bottom: 100rpx;
   		}
   	}
   	
   	.validateBox.active {
   		transition: .4s;
   		// opacity: 1;
   		// min-height: 410rpx;
   		height: auto;
   	}
</style>
