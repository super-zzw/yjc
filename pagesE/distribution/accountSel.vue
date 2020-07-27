<template>
	<view class="container">
		<view class="accountList">
			<view class="accountItem" v-for="(item,index) in 3" @tap="select=index">
				<view class="left">
					<image src="../image/zhifubao.png" mode="" class="accountImg"></image>
					<view class="info">
						<text class="name">支付宝账户1</text>
						<text class="num">187****2736</text>
					</view>
				</view>
				<text class="iconfont iconxuanzetixianzhanghu" v-if="select==index&&!editing"></text>
				<text class="noSelected" v-if="select!=index&&editing"></text>
				<image src="../image/select.png" mode="" class="selected" v-if="select==index&&editing"></image>
			</view>
		
			
				<view v-if="!editing" class="btns">
					<picker mode="selector" :range="range" @change="addAccount">
					  <button type="default" hover-class="none" class="addAccount btn">新增账户</button>
					</picker>
					
					<button type="default" hover-class="none" class="editAccount btn" @tap="editAccount">编辑账户</button>
				</view>
				<view v-if="editing" class="btns">
					<button type="default" hover-class="none" class="delBtn">删除</button>
				</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				select:0,
				editing:false,
				range:['支付宝账户','银行卡账户']
			};
		},
		methods:{
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
		    }
		}
	}
</script>

<style lang="scss" scoped>
    .container{
		height: 100vh;
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
					width: 100%;
				}
			}
        }
	}
</style>
