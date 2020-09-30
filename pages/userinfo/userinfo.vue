<template>
	<view class="sWrap">
		<view class="s-box">
			<view class="s-item">
				<view class="s-label">昵称</view>
				<input class="s-input" type="text"  v-model="userData.wusername"/>
			</view>
			<view class="s-item">
				<view class="s-label">头像</view>
				<Avatar
					selWidth="200px" selHeight="400upx" @upload="myUpload" :avatarSrc="url" inner="true"
					avatarStyle="width: 72rpx; height: 72rpx; border-radius: 100%;">
				</Avatar>
				<!-- <view class="s-userpic" @tap="setImage">
					<image :src="userData.icon" mode="" v-if="userData.icon"></image>
					<image src="https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/defaultface.png" mode="" v-else></image>
				</view> -->
			</view>
			<view class="s-item">
				<view class="s-label">用户ID</view>
				<input class="s-input" type="text" :value="userData.id" disabled/>
			</view>
			<view class="s-item">
				<view class="s-label">手机号</view>
				<input class="s-input" type="number" :value="userData.phone" disabled/>
			</view>
			<view class="s-item">
				<view class="s-label">性别</view>
				<picker mode="selector" :range="typeList" @change="changeType">
					<view class="s-input">{{type}}</view>
				</picker>
			</view>
			<view class="s-item">
				<view class="s-label">出生日期</view>
				<picker mode="date" @change="changeBirth">
					<view class="s-input">{{birth}}</view>
				</picker>
			</view>
		</view>
		<view class="list-cell log-out-btn" @click="saveInfo">
			<text class="cell-tit">保存</text>
		</view>
	</view>
</template>

<script>
	import {  
	    mapState,  
	    mapMutations  
	} from 'vuex';  
	import Avatar from "../../components/yq-avatar.vue";
	import utils from '@/utils/method.js'
	export default {
		components:{
			Avatar
		},
		data() {
			return {
				type:"",
				typeList:["保密","男","女"],
				typeMap:{
					"男":1,
					"女":2,
					"保密":0
				},
				birth:"",
				userData:{},
				fromPage:"",  //跳转来源
				url:""
			};
		},
		methods:{
			...mapMutations(['setUserInfo']),
			changeType(e){
				this.type = this.typeList[e.detail.value]
			},
			changeBirth(e){
				this.birth = e.detail.value
			},
			//获取用户信息
			async getUserInfo(){
				await this.$http({
					apiName:"getUserInfo"
				}).then(res => {
					this.setUserInfo(res.data);
					if(res.data.icon){
						this.url = res.data.icon;
					}else{
						this.url = "https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/img/defaultface.png"
					}
				}).catch(_ => {})
			},
			myUpload(rsp){
				var that = this;
				this.$upLoadImg({
					apiName:"uploadImg",
					filePath:rsp.path,
					name:"file",
				}).then(ret => {
					this.$set(this.userData,"icon",ret.data);
					this.setUserInfo(this.userData);
					this.url = ret.data;
				}).catch(_ => {})
			},
			//上传图像老版
			// setImage() {
			// 	uni.chooseImage({
			// 		count: 1,  //可选择张数
			// 		sizeType: ['original', 'compressed'],
			// 		sourceType: ['album'],
			// 		success: (res) => {
			// 			this.$upLoadImg({
			// 				apiName:"uploadImg",
			// 				filePath:res.tempFilePaths[0],
			// 				name:"file",
			// 			}).then(ret => {
			// 				this.$set(this.userData,"icon",ret.data)
			// 			}).catch(_ => {})
			// 		}
			// 	});
			// },
			//保存用户信息
			async saveInfo(){
				await this.$http({
					apiName:"saveUserInfo",
					type:"POST",
					data:{
						birthday:this.birth == "点击选择" ? "" : this.birth,
						gender:this.typeMap[this.type],
						icon:this.userData.icon || "",
						wusername: this.userData.wusername
					}
				}).then(res => {
					uni.showToast({
						title:"保存成功"
					})
				}).catch(_ => {})
			}
		},
		computed:{
			...mapState(['userInfo']),
		},
		async onLoad(opt) {
			this.fromPage = opt.from || ''
			await this.getUserInfo()
			this.userData = JSON.parse(JSON.stringify(this.userInfo))
			this.birth = utils.unixToDatetime(this.userData.birthday,3) || "点击选择";
			this.type = this.typeList[this.userData.gender];
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			// #ifdef APP-PLUS
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			const currentWebview = page.$getAppWebview();
			currentWebview.hideTitleNViewButtonRedDot({
				index
			});
			// #endif
			if(index == 0){
				this.saveInfo()
			}
		},
		onBackPress(e){
			if(this.fromPage == 'set'){
				uni.redirectTo({
					url:'/pages/set/set'
				})
			}else{
				uni.switchTab({
				// uni.reLaunch({
					url:"/pages/user/user"
				})
			}
			return true
		}
	}
</script>

<style lang="scss" scoped>
.sWrap{
	background-color: #F9FAFB;
	min-height: 100vh;
	.log-out-btn{
		margin-top: 40rpx;
		display:flex;
		align-items:baseline;
		padding: 20rpx $page-row-spacing;
		line-height:60rpx;
		position:relative;
		background: #fff;
		justify-content: center;
		.cell-tit{
			color: $uni-color-primary;
			text-align: center;
			margin-right: 0;
		}
	}
	.s-box{
		padding-left: 32rpx;
		padding-right: 32rpx;
		background-color: #fff;
	}
	.s-item{
		padding: 28rpx 0;
		border-bottom: 2rpx solid #DBDBDB;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.s-label{
			font-size: 28rpx;
			color: #909399;
		}
		.s-input{
			flex: 1;
			font-size: 30rpx;
			color: #303133;
			text-align: right;
		}
		.s-userpic{
			image{
				width: 72rpx;
				height: 72rpx;
				border-radius: 50%;
			}
		}
	}
	.s-item:last-child{
		border: none;
	}
}
</style>
