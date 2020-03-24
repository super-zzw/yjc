<template>
	<view class="content">
		<view class="apply-row flex flex-column justify-center">
			<view class="apply-title"><text>提现金额</text></view>
			<input type="number" v-model="formData.withdrawAmount" placeholder="请输入提现金额(n元起提)" placeholder-class="place"/>
		</view>
		<view class="apply-row flex flex-column justify-center">
			<view class="apply-title"><text>支付宝账号</text></view>
			<input type="text" v-model="formData.accounts" placeholder="请输入支付宝账号" placeholder-class="place"/>
		</view>
		<view class="apply-row flex flex-column justify-center">
			<view class="apply-title"><text>支付宝姓名</text></view>
			<input type="text" v-model="formData.payee" placeholder="请输入对应支付宝账号实名" placeholder-class="place"/>
		</view>
		<view class="apply-row flex flex-column justify-center">
			<view class="apply-title"><text>手机号码</text></view>
			<input type="number" v-model="formData.mobile" placeholder="请输入您的手机号码" placeholder-class="place"/>
		</view>
		<button class="subBtn" @tap="submit">提 交</button>
	</view>
</template>

<script>
	import Utils from "../../utils/method.js"
	export default{
		data(){
			return{
				formData:{
					withdrawAmount : "",
					accounts: "",
					payee: "",
					mobile: ""
				}
			}
		},
		methods:{
			async submit(){
				const _data = [
					{
						data: this.formData.withdrawAmount ,
						info: "提现金额不能为空"
					},
					{
						data: this.formData.accounts,
						info: "支付宝账号不能为空"
					},
					{
						data: this.formData.payee,
						info: "支付宝姓名不能为空"
					},
					{
						data: this.formData.mobile,
						info: "手机号码不能为空"
					},
				];
				const jres = Utils.judgeData(_data);
				if(jres){
					try{
						const res = await this.$http({
							apiName: "withdraw",
							type: "POST",
							data:{...this.formData}
						})
						uni.redirectTo({
							url:"./successToast"
						})
					}catch(e){
						setTimeout(()=>{
							uni.navigateTo({
								url: "./failToast"
							})
						},1500)
					}
				}
			}
		
		}
		
	}
</script>

<style lang="scss" scoped>
	.subBtn{
		width: 686rpx;
		height: 88rpx;
		background-color: #F23D3D;
		border-radius: 44rpx;
		line-height: 88rpx;
		color: #ffffff;
		font-size: 30rpx;
		font-weight: bold;
		margin: 142rpx auto ;
	}
	.apply-row{
		width: 100%;
		height: 160rpx;
		padding: 0 32rpx;
		position: relative;
		
		&::after{
			width: 686rpx;
			height: 2rpx;
			background:rgba(216,216,216,.4);
			content: "";
			position: absolute;
			bottom: 0;
		}
		input{
			font-size: 30rpx;
			margin-top: 10rpx;
		}
		.place{
			font-size: 30rpx;
			color: #909399;
		}
		.apply-title{
			color: #303133;
			font-size: 30rpx;
			font-weight: 400;
			
			text{
				position: relative;
				&::after{
					content: "*";
					color: #F23D3D;
					font-weight: bold;
					position: absolute;
					right: -24rpx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
			
		}
	}
</style>
