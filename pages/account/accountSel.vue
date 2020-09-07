<template>
	<view class="container">
		<view class="accountList">
			<view class="" v-if="dataList.length > 0">
				<view class="accountItem" v-for="(item,index) in dataList" @tap="selectAccount(index)">
					<view class="left">
						<image :src="bankImg(item.bankname)" mode="" class="accountImg" ></image>
						<view class="info">
							<text class="name">{{item.bankname}}</text>
							<text class="num">{{item.cardno}}</text>
						</view>
					</view>
					<text class="iconfont iconxuanzetixianzhanghu" v-if="select==index&&!editing"></text>
					<text class="noSelected" v-if="select!=index&&editing"></text>
					<image src="../../static/select.png" mode="" class="selected" v-if="select==index&&editing"></image>
				</view>
			</view>
			<view class="accountEmpty" v-else>
				暂无可用账户，请点击新增账户
			</view>
		
		<view v-if="!editing" class="btns">
			<!-- <picker mode="selector" :range="range" @change="addAccount"> -->
			<picker @change="bindPickerChange" :value="index" :range="bankList" range-key="title">
			        <button type="default" hover-class="none" class="addAccount btn" >新增账户</button>
			</picker>
			  
			<!-- </picker> -->
			
			<button v-if="dataList.length > 0" type="default" hover-class="none" class="editAccount btn" @tap="editAccount">管理账户</button>
		</view>
		<view v-if="editing" >
			
			<button type="default" hover-class="none" class="addAccount btn mt50" @tap="addAccount" v-if="dataList.length==0">新增账户</button>
			<view v-if="dataList.length>0" class="btns">
				<button type="default" hover-class="none" class="addAccount btn" @tap="toEdit">编辑</button>
				<button type="default" hover-class="none" class="delBtn" @tap="deleteAccount">删除</button>
			</view>
			
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
				dataList:[],
				index:0,
				bank:'',
				bankList:[
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/ABC.png',
						title:'中国农业银行'
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/BOC.png',
						title:'中国银行'
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/BOCOM.png',
						title:"交通银行"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/BOG.png',
						title:"广州银行股份有限公司"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/CCB.png',
						title:"中国建设银行"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/CEB.png',
						title:"中国光大银行"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/CGB.png',
						title:"广发银行股份有限公司"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/CIB.png',
						title:"兴业银行"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/CITIC.png',
						title:"中信银行"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/CMB.png',
						title:"招商银行"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/CMBC.png',
						title:"中国民生银行"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/DGB.png',
						title:"东莞银行股份有限公司"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/EBCL.png',
						title:"恒丰银行"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/GHB.png',
						title:"广东华兴银行股份有限公司"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/HXB.png',
						title:"华夏银行股份有限公司"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/ICBC.png',
						title:"中国工商银行"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/PAB.png',
						title:"平安银行"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/PSBC.png',
						title:"中国邮政储蓄银行"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/SPDB.png',
						title:"上海浦东发展银行"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/BOB.png',
						title:"北京银行股份有限公司"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/BOSC.png',
						title:"上海银行股份有限公司"
					},
					{
						name:'https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/yjc/banks/BCS.png',
						title:"长沙银行股份有限公司"
					},
				]
			};
		},
		onLoad() {
			this.select = this.selectFxAccount
			// this.getData()
		},
		onShow() {
			this.getData();
		},
		computed:{
			...mapState(['selectFxAccount']),
			bankImg(){
				return function(name){
					let imgSrc=''
					let count=0
					this.bankList.forEach((item,index)=>{
						if(item.title==name){
							
							imgSrc=item.name
							return
						}else{
							count++
							if(count==this.bankList.length){
								imgSrc='../../static/yhk.png'
							}
						}
						
					})
					 console.log(imgSrc)
					return imgSrc
				}
				
				
			}
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
			bindPickerChange(e){
				this.bank=this.bankList[e.detail.value].title
				uni.navigateTo({
					url:'./addAccount?bank='+this.bank
				})
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
					url:'./addAccount'
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
			.accountItem:last-child{
				border: none;
			}
			.btns{
				margin-top: 50rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				
				
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
			.addAccount{
				background: #F23D3D;
				color: #fff;
			}
			.btn{
				width: 308rpx;
				border-radius:40rpx;
				font-size:30rpx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:500;
			}
			.mt50{
				margin-top: 50rpx;
			}
			.accountEmpty{
				text-align: center;
				font-size: 32rpx;
				padding-top: 40rpx;
			}
        }
	}
</style>
