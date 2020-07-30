<template>
	<view class="container">
		<view class="accountList">
			<view class="" v-if="dataList.length > 0">
				<view class="accountItem" v-for="(item,index) in dataList" @tap="selectAccount(index)">
					<view class="left">
						<image src="../image/zhifubao.png" mode="" class="accountImg" v-if="item.type == 0"></image>
						<image src="../image/yhk.png" mode="" class="accountImg" v-if="item.type == 1"></image>
						<view class="info">
							<text class="name">{{item.name}}</text>
							<text class="num">{{item.account}}</text>
						</view>
					</view>
					<text class="iconfont iconxuanzetixianzhanghu" v-if="select==index&&!editing"></text>
					<text class="noSelected" v-if="select!=index&&editing"></text>
					<image src="../image/select.png" mode="" class="selected" v-if="select==index&&editing"></image>
				</view>
			</view>
			<view class="accountEmpty" v-else>
				暂无可用账户，请点击新增账户
			</view>
			
		
			
				<view v-if="!editing" class="btns">
					<picker mode="selector" :range="range" @change="addAccount">
					  <button type="default" hover-class="none" class="addAccount btn">新增账户</button>
					</picker>
					
					<button v-if="dataList.length > 0" type="default" hover-class="none" class="editAccount btn" @tap="editAccount">管理账户</button>
				</view>
				<view v-if="editing" class="btns">
					<button type="default" hover-class="none" class="addAccount btn" @tap="toEdit">编辑</button>
					<button type="default" hover-class="none" class="delBtn" @tap="deleteAccount">删除</button>
				</view>
		</view>
		
	</view>
</template>

<script>
	import {mapMutations,mapState} from 'vuex'
	export default {
		data() {
			return {
				select:0,
				editing:false,
				range:['支付宝账户','银行卡账户'],
				dataList:[]
			};
		},
		onLoad() {
			this.select = this.selectFxAccount
		},
		onShow() {
			this.getData();
		},
		computed:{
			...mapState(['selectFxAccount'])
		},
		methods:{
			...mapMutations(['selectFxAccountSet']),
			selectAccount(index){
				this.select = index;
				if(!this.editing){
					this.selectFxAccountSet(index);
					uni.navigateBack()
				}
			},
			toEdit(){
				let _id = this.dataList[this.select].id;
				let _type = this.dataList[this.select].type;
				uni.navigateTo({
					url:'./addAccount?type='+_type + '&id=' + _id
				})
			},
			getData(){
				uni.showLoading({
					title:"加载中..."
				})
				this.$http({
					apiName:"fxyjAccountList"
				}).then(res => {
					this.dataList = res.data;
					uni.hideLoading()
				}).catch(err => {uni.hideLoading()})
			},
			editAccount(){
				this.editing=true
				uni.setNavigationBarTitle({
					title: '佣金提现账户管理'
				});

			},
			addAccount(e){
				// console.log(e.detail.value)
				uni.navigateTo({
					url:'./addAccount?type='+e.detail.value
				})
		    },
			deleteAccount(){
				let _this = this;
				uni.showModal({
					title:"确定删除该账户？",
					success(res) {
						if(res.confirm){
							_this.deleteAccount2()
						}
					}
				})
			},
			async deleteAccount2(){
				uni.showLoading({
					title:"删除中..."
				})
				await this.$http({
					apiName:"fxWithdrawDeleteAccount",
					type:"POST",
					data:{
						id:this.dataList[this.select].id
					}
				}).then(res => {
					uni.showToast({
						icon:"success",
						title:"删除成功"
					})
					this.getData()
				}).catch(err => {})
				uni.hideLoading()
			}
		}
	}
</script>

<style lang="scss" scoped>
    .container{
		height: calc(100vh - 88rpx);
		background: #F9FAFB;
		.accountList{
			padding:0 35rpx;
			padding-bottom: 58rpx;
			background: #fff;
			.accountItem{
				padding: 46rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom:2rpx solid #DBDBDB;
				.iconxuanzetixianzhanghu{
					color:#F23D3D;
				}
				.noSelected{
					width:46rpx;
					height:46rpx;
					border:2rpx solid rgba(217,217,217,1);
					border-radius: 50%;
				}
				.selected{
					width:46rpx;
					height:46rpx;
				}
				.left{
						   display: flex;
						  .accountImg{
							  width: 88rpx;
							  height:88rpx;
							  margin-right:28rpx
						  }
						  .info{
							  display: flex;
							  flex-direction: column;
							  .name{
								  font-size:32rpx;
								  font-family:PingFangSC-Regular,PingFang SC;
								  font-weight:500;
								  color:rgba(48,49,51,1);
							  }
							  .num{
								  font-size:28rpx;
								  font-family:PingFangSC-Regular,PingFang SC;
								  font-weight:400;
								  color:rgba(168,171,179,1);
							  }
						 }
				}
			}
			.btns{
				margin-top: 50rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				.btn{
					width: 308rpx;
					border-radius:40rpx;
					font-size:30rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:500;
				}
				.addAccount{
					background: #F23D3D;
					color: #fff;
				}
				.editAccount{
					background: #fff;
					color: #F23D3D;
					border:2rpx solid rgba(242,61,61,1);
				}
				.delBtn{
					background: #fff;
					color: #F23D3D;
					border:2rpx solid rgba(242,61,61,1);
					border-radius:40rpx;
					font-size:30rpx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:500;
					width: 50%;
				}
			}
			.accountEmpty{
				text-align: center;
				font-size: 32rpx;
				padding-top: 40rpx;
			}
        }
	}
</style>
