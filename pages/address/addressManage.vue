<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="name" placeholder="收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="phoneNumber" placeholder="收货人手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">地址</text>
			<text @click="openAddres" class="input">
				{{address}}
			</text>
		</view>
		<view class="row b-b"> 
			<text class="tit">门牌号</text>
			<input class="input" type="text" v-model="detailAddress" placeholder="请输入详细地址" placeholder-class="placeholder" />
		</view>
		
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="defaultStatus" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
		<button class="add-btn add-btn2" @click="deleteAddr" v-if="id">删除</button>
		<simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor='#007AFF'></simple-address>
	</view>
</template>

<script>
	import simpleAddress from "@/components/simple-address/simple-address.nvue"
	import utils from "@/utils/method.js"
	export default {
		components: {
			simpleAddress
		},
		data() {
			return {
				cityPickerValueDefault: [0, 0, 1],
				address:"点击选择地址",
				defaultStatus:false,  //是否是默认
				detailAddress:"",  //详细地址
				name:"",  //收货人
				phoneNumber:"",  //收货人手机
				city:"",  //城市
				province:"",  //省
				region:"",  //区
				id:"",  //删除地址id
				source:"",  //页面来源
				score:"",
				cart:""
			}
		},
		onLoad(opt){
			let title = '新增收货地址';
			if(opt.id){
				title = '编辑收货地址'
				this.id = opt.id
				this.getAddr()
			}
			this.source = opt.source
			this.score = opt.score
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			openAddres() {
				this.$refs.simpleAddress.open();
			},
			onConfirm(e) {
				this.address = e.label;
				let _add = this.address.split('-')
				this.city = _add[1]
				this.province = _add[0]
				this.region = _add[2]
			},
			switchChange(e){
				this.defaultStatus = e.detail.value
			},
			//提交
			async confirm(){
				let that = this
				let _data = [
					{
						data:this.name.trim(),
						info:'收货人不能为空'
					},
					{
						data:this.phoneNumber.trim(),
						info:'手机号不能为空'
					},
					{
						data:this.address,
						info:'地址不能为空'
					},
					{
						data:this.detailAddress.trim(),
						info:'详细地址不能为空'
					},
				]
				let jres = await utils.judgeData(_data)
				if(jres){
					uni.showLoading({
						title:"保存中..."
					})
					if(this.id){
						//修改保存
						await this.$http({
							apiName:"editAddr",
							type:"POST",
							data:{
								id:this.id,
								defaultStatus:this.defaultStatus == true ? 1 : 0,  //是否是默认
								detailAddress:this.detailAddress,  //详细地址
								name:this.name,  //收货人
								phoneNumber:this.phoneNumber,  //收货人手机
								city:this.city,  //城市
								province:this.province,  //省
								region:this.region,  //区
							}
						}).then(res => {
							uni.showToast({
								title:"保存成功"
							})
							setTimeout(function(){
								uni.navigateBack()
								// uni.redirectTo({
								// 	url:`/pages/address/address?source=${that.source}&score=${that.score}`
								// });
							},1500)
							
						}).catch(_ => {})
					}else{
						//添加保存
						await this.$http({
							apiName:"addAddr",
							type:"POST",
							data:{
								defaultStatus:this.defaultStatus == true ? 1 : 0,  //是否是默认
								detailAddress:this.detailAddress,  //详细地址
								name:this.name,  //收货人
								phoneNumber:this.phoneNumber,  //收货人手机
								city:this.city,  //城市
								province:this.province,  //省
								region:this.region,  //区
							}
						}).then(res => {
							uni.showToast({
								title:"保存成功"
							})
							setTimeout(function(){
								uni.navigateBack()
								// uni.redirectTo({
								// 	url:`/pages/address/address?source=${that.source}&score=${that.score}`
								// });
							},1500)
							
						}).catch(_ => {})
					}
					
					uni.hideLoading()
				}
			},
			deleteAddr(){
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除该地址？',
					success: function (res) {
						if (res.confirm) {
							that.deleteAddrOK()
						} else if (res.cancel) {
							
						}
					}
				})
				
			},
			async deleteAddrOK(){
				uni.showLoading({
					title:"删除中..."
				})
				var that = this
				await this.$http({
					apiName:"deleteAddr",
					type:"POST",
					data:{id:this.id}
				}).then(res => {
					uni.showToast({
						title:"删除成功"
					})
					setTimeout(function(){
						// uni.redirectTo({
						// 	url:`/pages/address/address?source=${that.source}&score=${that.score}`
						// });
						uni.navigateBack()
					},1500)
				}).catch(_ => {})
				uni.hideLoading()
			},
			async getAddr(){
				uni.showLoading({
					title:"加载中..."
				})
				await this.$http({
					apiName:"getAddr",
					data:{id:this.id}
				}).then(res => {
					this.defaultStatus = res.data.defaultStatus == 1 ? true : false
					this.detailAddress = res.data.detailAddress
					this.name = res.data.name
					this.phoneNumber = res.data.phoneNumber
					this.city = res.data.city
					this.province = res.data.province
					this.region = res.data.region
					this.address = this.province + '-' + this.region + '-' + this.city
				}).catch(_ => {})
				uni.hideLoading()
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16rpx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30rpx;
		height: 110rpx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 120rpx;
			font-size: 30rpx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30rpx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36rpx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16rpx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16rpx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		height: 80rpx;
		margin: 60rpx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: #F23D3D;
		border-radius: 10rpx;
		box-shadow: 1px 2px 5px rgba(242, 61, 61, 0.2);
	}
	.add-btn2{
		background-color: #fff;
		color: #F23D3D;
		box-shadow: 1px 2px 5px rgba(242, 61, 61, 0.2);
	}
</style>
