<template>
	<view class="sWrap">
		<view class="s-box1" @tap="setSign" v-if="!hasQd">
			<view class="s-boxbgk">
				<view class="s-boxtext">今日</view>
				<view class="s-boxtext">签到</view>
			</view>
		</view>
		<view class="s-box1" v-else>
			<view class="s-boxbgk">
				<view class="s-boxtext">今日</view>
				<view class="s-boxtext">已签到</view>
			</view>
		</view>
		<view class="s-box2">
			<view v-for="(item,index) in qiandao2" :key="item.lable" class="s-box2-item">
				<view class="s2-item-top">
					<view class="s2-item-right" v-if="index != 0"></view>
					<text class="iconfont iconduigou i1"></text>
				</view>
				<view class="s2-item-boo">第{{item.num}}天</view>
			</view>
			<view v-for="(item2,index2) of noqiandao2" :key="item2.lable" class="s-box2-item">
				<view class="s2-item-top">
					<view class="s2-item-right"></view>
					<text class="iconfont iconshenglvehao i2"></text>
				</view>
				<!-- <view class="s2-item-boo" v-if="qiandao == 0">第{{item2 + qiandao + 1}}天</view> -->
				<!-- <view class="s2-item-boo" v-else>第{{item2 + qiandao}}天</view> -->
				<view class="s2-item-boo">第{{item2.num}}天</view>
			</view>
		</view>
		<view class="s-box3">
			<view class="s-box3-left">
				<image :src="userInfo.icon" class="s-box3img" v-if="userInfo.icon"></image>
				<image src="/static/defaultface.png" class="s-box3img" v-else></image>
				<view class="s-box3-text">{{userInfo.wusername}}</view>
			</view>
			<view class="s-box3-right">
				<text class="s-box3-text2">总积分：</text>
				<text class="s-box3-text3">{{userInfo.integration}}</text>
			</view>
		</view>
		<view class="s-box4">
			<view class="s-box4-item" v-for="(item,index) in dataList" :key="index">
				<view class="s-box4-text1">{{item.createTime | dealTime}}</view>
				<view class="s-box4-text2">{{item.sourceTypeStr}}</view>
				<view class="s-box4-text3">
					<text v-if="item.type == 0">+</text>
					<text v-else>-</text>
					{{item.cou}}
				</view>
			</view>
			<view v-if="dataList.length > 0 && noMore" class="no_more">
				<text class="no_more_side"></text>
				<text class="no_more_text">没有更多数据了</text>
				<text class="no_more_side"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
	    mapState,mapMutations
	} from 'vuex';
	import utils from '@/utils/method.js'
	export default {
		data() {
			return {
				qiandao:0,  //已签到天数
				qiandao2:[],
				noqiandao:0,
				noqiandao2:[],
				hasQd:true,  //当天是否已经签到
				dataList:[],
				page:1,
				size:16,
				dataLoading:false,  //是否是在加载数据
				noMore:false,
			}
		},
		computed: {
			...mapState(['userInfo']),
		},
		onLoad() {
			this.initData()
		},
		filters:{
			dealTime(val){
				return utils.unixToDatetime(val) || ""
			}
		},
		methods: {
			...mapMutations(['setUserInfo']),
			initData(){
				uni.showLoading({ title: '加载中' });
				this.getUserInfo()
				this.getList()
				this.getSigin()
				uni.hideLoading()
			},
			//获取用户信息
			async getUserInfo(){
				await this.$http({
					apiName:"getUserInfo"
				}).then(res => {
					this.setUserInfo(res.data)
				}).catch(_ => {})
			},
			async getList(){
				await this.$http({
					apiName:"getScore",
					data:{
						page:this.page,
						size:this.size
					}
				}).then(res => {
					this.noMore = !res.data.hasNextPage
					this.dataList = this.dataList.concat(res.data.list)
				}).catch(_ => {})
			},
			//获取用户签到天数
			async getSigin(){
				await this.$http({
					apiName:"siginCount",
				}).then(res => {
					this.qiandao = res.data.num
					for(let i = 1; i <= this.qiandao; i ++){
						this.qiandao2.push({
							num:i,
							lable: i + "a"
						})
					}
					this.noqiandao = 7 - this.qiandao
					for(let j = 1; j <= this.noqiandao; j ++){
						this.noqiandao2.push({
							num:j + this.qiandao,
							lable: j + "b"
						})
					}
					this.hasQd = !res.data.flag
				}).catch(_ => {})
			},
			//用户签到
			async setSign(){
				await this.$http({
					apiName:"setSigin",
					type:"POST"
				}).then(res => {
					uni.showToast({
						title:"签到成功"
					})
					this.noqiandao --
					this.qiandao ++
					this.qiandao2 = []
					for(let i = 1; i <= this.qiandao; i ++){
						this.qiandao2.push({
							num:i,
							lable: i + "a"
						})
					}
					this.noqiandao2 = []
					for(let j = 1; j <= this.noqiandao; j ++){
						this.noqiandao2.push({
							num:j + this.qiandao,
							lable: j + "b"
						})
					}
					this.hasQd = true
					//更新签到数据
					this.dataList = [];
					this.noMore = false
					this.page = 1;
					this.getList()
				}).catch(_ => {})
			}
		},
		//下拉刷新
		async onPullDownRefresh(){
			this.qiandao2 = []
			this.noqiandao2 = []
			this.dataList = [];
			this.noMore = false
			this.page = 1;
			this.qiandao = 0;
			this.noqiandao = 0;
			await this.initData()
			uni.stopPullDownRefresh();
			uni.showToast({
				title: '刷新成功'
			})
		},
		//触底加载更多
		onReachBottom(){
			if(this.noMore){
				return
			}
			this.page ++;
			this.getList()
		},
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
			if (index === 0) {
				uni.navigateTo({
					url:"/pages/product/typeList?score=true"
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
.sWrap{
	.s-box1{
		width: 100%;
		height: 276rpx;
		/*  #ifdef APP-PLUS || H5 */
		background-image: url("/static/scorebgk.png");
		/*  #endif */
		/*  #ifdef MP-WEIXIN */
		background-image: url(data:image/png;base64,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A10HXQe9dAMd9Jt20A10AKA40HXQddB10N+ng757hCbqyEluEQAYGeg66O2b6qAX378OeudjOreDnvafRoqN69ABgN320EHXQddBj3froO8KOC5zAQAKA10HXQc9Qgf9bTvou7dvqqWfRgDAy0DXQd+Pdx10HfS37qDvDtBymkdOeugAgA76YIzroOugHzpAu2YHff/i3lRHk2Z+IgEAOug66KGD/s4d9N0/u8wFAHgd6DroOuilG+igv0kHfXc6flN5oSgAoIOug66D/u4d9N39lVwAgOJA10Fv31QHvfj+ddA7H9PlHfTtm7ct9OSnEgDc+0DXQddB10GPd++gR47IqfJCUQBAB304DEMHXQf9zTvou+9q4zp0ADDQddB10HXQjztAu2UHffdfsLxQFADQQQ8ddB309++g7x5XahEA0EHXQddB/yAd9BwRjYEOAAa6DvpwmB08gIiJA4iI6eGmg66DPtJBz5ENdABAB10HPXTQP0gHfXuJyyKkFgHAQNdBL46zsXeog66DfpsOes45cppFTrWfTABwzwNdB10HXQc9PkQHPSJHk+rIWugAYKDroEdxZOqg66C/ZQc9IqJJVeQ095MJAO56oOug78e7DroO+nt30L1QFADQQQ8ddB30j9NBjwgtdAC4+4Gug66DroM+fB7H+3TQk4EOAAa6DvpwmB08gIiJA4iI6eGmg66DPtFBN9ABAB10HXQd9A/UQQ8DHQAMdB10HfSRG+iglw7QbtxBdwYdANBB10HXQf9AHfQw0AHAQNdBj+EI00HXQX+nDnqOkFkEgLsf6Dro+/Gug66D/t4d9IjsDDoAGOg66Drog2Wpg66DDgC820DXQddB10EfPo9DBx0AeK+B/nIG/dwGeoQOug66Dvr491kHHQA4daDvz6B/0gZ6b5hroHeH7ls30Acv0NVAnxztpdcwGOgAYKDvl44GevumGujF93+ggd49GNJALz23NdABgMmBvv1FRa1p98ka6MMRpoH+vg307kGOBvrIAaQGOgAwPdA10DXQI67RQM+D72l3G2uga6ADAAcG+vYSl8/bQB80s0MD/T0b6Pvvugb64GmtgQ4AnDDQNdDbb9dAH95fA10DHQB444H+uia6I0MDvTAUY/hxaKCX76+BroEOABypqiKqdHkH/d0b6Gm6g62BHoWPOUIDXQMdAHinEV5Xkeq6sBdfNogOug66DnoUbxtRfs5evYPuEhcA+LLSrI6oZ6+bqbDlulf/Zh10HfTiDXTQSwdoOugAwDGjfDGPVFedWdC/4mB8NmQd9P771kEPHfTQQQcAThzl81mkWR39U7gpuvW20r7oXxGgg97/Iumg66DroAMAx6iqqFaL4ZUavc3Tvpx5sMcL/0IHPXTQddA/Rgd9O9AXftgBwAeXZnWkxby1e4aXTZdKiDnGLqXtbmwddB304dNJB330AO2WHfQcVTTV3E89APiow3wx377oc3I7dS+NHd12xe34sql00HXQ+18/HfT36aBHmkWTaj/9AOBDD/NobY/yVOmM9NyrCEaOwjnPzubVQQ8d9OINdNDfvIOe0zxyqvwUBICPoq6iWo5ffjpWFOxfTNFNfY+9OLS1kXTQddB10KN424jyc/ZWHXQFFwD4OKr1Q0y/ELJ8Aq4/r9qX8kbooIcO+sThnA76h+ugK7gAwPtL89n2BaBjf6f3/36PQrQihrNAB10HXQf9E3bQnUEHgPdVPa0jmjzcDuN/qXcmVPQ3Q+igt26vg66D/vk66AY6ALyPNKsjta81z0cO9ELuuzAJdNDb718HXQf983TQq9hILALAm6vXq8gpjYzzFMecRddB10HXQf+CHfSckwY6ALyx6vFhbHMfNcx10HXQddC/cAd9k+YREosA8CZySlGvVwdudKDgooMeOuihg/6VO+ibauGnJQC8gVTXkVYH/t496gy6DroOug76l+6gb5KBDgA3H+eLeaT5fGwdj2yLAwNdB/24oxYd9NBBj8/VQTfQAeC2quUiYj7rzZ4jL1UdX+iDHTn2EDroOug66J+qg54UXADghtJqGWlWDyZFHPGCzQMLXQddB303enXQywc4n7ODntMsmlT76QkANzA4c975e3l8dx810HXQj//C6KDroH+mDnrjFxQBwE2kxTzSYj4xvkfW9dTbC3/566DroOugf7EOuoEOADcY53Ud6WHk79h86Mx4hA568f0f+OR10HXQO8/Tz9tB3xjoAHBVOaWox34J0dEjXQc9dNB10O+xg54jRZO8QBQArql6Wl84zoc7qPwwOuiT718HXQf9M3bQm5hF9htEAeANx/noOh7ZFgcGug76cUctOuihgx6fo4PuN4gCwPXUj+vI6cgb66DroOug66B3Dt5ePj8vEAWAK5nPtknFo4Z58Q/Hvb1/Yx300EHXQR8cpJWfKx+/g97kFNkvKAKAqzh4actgd+ugl48WdNB10A99P79wBz1XiyNefgIAHBzn3552I+XIcd6f0Se8vfCAOug66DroX6SDvkmuPweAS6XFPNJycfxZ77H9Npg/OuiFd3Dgk9dB10HvPE8/Wwc9xUZeEQAuVn177Pz9Gsf+92kddB304r/TQb/bDnqTZpFDXhEArjLOR7bL+eP8uMfSQddB10H/Qh10Z88B4EJ1HdV6NbJpDo3vidvpoOug66D3DoDupIPeuP4cAC4yOHt+7EDvzB4ddB10HXQd9IhooooctZ+sAHCmtFxEWswLG+yUisvIANdBb28cHfTu3XXQv2oH3eUtAHCZztnzQ9tsdKTroJePFnTQddAPfT+/YAddXhEALhjnq2XEfDb59+/hcd6f0Se8vfCAOug66Dron7iD3kSt3gIAlwz00tnzkf01vql10HXQQwddB317/024vAUAzrX/pUSjo1sHXQe9fwBx6Juqg37nHfQqNjHz0xUAzjR69nxku5w/zo97LB10HXQd9E/eQW9iFiNhUADg0Biu66h33fPShNBB10HXQddBP7WD7sWhAHC+6tvTxCgMHXQd9JF/p4Ougz7y3MhRRaN9DgDnD/Qfno6uqB0e5jE99qfe3r+xDnrooOugDw7Sys+Vj9VB9+JQADhfWi0jzQ+8jksHXQddB10H/Zgj+N33zUAHgPNtXxw6UWjRQddB10HvPiF3/6yDPnxO5BzRpNnIsw8AOGqg//B0wos7ddCHw1YHXQddB73z8Tt7DgDnS+tVpHoWx71gUwddB71/AHHom6qDfncd9CYqvzkUAC5Q/fA0uk2iOHKvMc6PeywddB10HfRP2EF39hwArjDQD11jroOug66DroO++5imOujbs+fSigBwtsU8qtWyW3bTQddB10E/9gAtdNB7zw1nzwHgMtW3x0EsYnRM66DroOug66BPddBzqqLJrj0HgIsG+u7684iLX9Q5HOE66OWjBR10HfRD389P2kHf5JmfqgBwrYF+qNCig66DroPefULu/lkHfXeXFI1rzwHgMrM6qvXD5L46tL/GN7UOug566KDfUwfd2XMAuFx6WEaaz48fzDroOug66Dropa9zE1Vk154DwMU6158fM9J10HXQX0ejDnr787v3Drqz5wBwg4Gugx466DroOuilA7QDHfQm6sg5+YkKAFcf6DroOug66DroZ3TQnT0HgBsOdB10HXQddB30Uzrom5gdfcAOAByQ0vaXFPV3wuRW1kEffi100IvDUQf9Djro+WWgAwDXMZtFtV71/t7VQddBHxxg6aDroJc76C5tAYDrSqtlpMX84L466e3dAXjEiNdBL7yDA5+8DroOeud5+j4d9NyEX0oEANce6OtVpNnstMGsg66DroOug54i4rkxzgHg2qqndURVFWaKDroOeuig66CPd9Cbpva6UAC4xUD/9tgaoaGDroOugz75/nXQX/6covEbQwHgNgN98FtEddB10HXQddAPdNA3Lm0BgLcd6DroOug66DroY1nFJtcnpVYBgAsHeoQOug66DroO+kgHPafYuLQFAG470L89xeAMpg66DroOev/7r4OeUornjXEOALcf6L0XiY7sq5PeHjG93waPpYNeeAcHPnkddB30zvP09h30Ta5DtgUA3mCg9zOLOug66DrooYPe+642TUR2aQsAvIm0fog0qwszRQddBz100HXQX34hkUtbAODNVKtlxGJe2Cw66DrohW+YDnrcXQfdOAeAt5UW80irZXcH6KDroOug66BHRGw2aeR/cgDAzdR1VI8Pw5F0Tgc9pe0eTBE5RaSoupsjekMz59ZJ2Wb70E1vY/Qu3dZB10HXQe8dpJWfK5d30JtNRJONcwB4D+XfJloa3mn7gtLtyDzuwQ+ePc+l5Tyy+3Y3S5Gb5nWrtreHDroOug765R30psnRNC5tAYB3H+gvV0NEXXdOOnYvq45WLuXQZcjtfxjroOfx9Vx4wJyjc6VAipez9fvzpSnSpokmbwa7uDt9ddAHY1wHXQd9d5+N684B4F2kuoqYzbYt9CjlvvNgzgyvLrjwt44edTZ+ooPev9R2sO1e/kUT+7Pu7VvooOugD75+995Bf352WQsAvNkgn88i1XV3X0SO6umxt3dK+yy6Vwi8/uHwO54c6fmyDnouddCbfdI59X9d0cvnl3OKaBod9Agd9OIN7rSDvnlOfhcRANxSlbaVlv2l0eUEYb1+iKiq3tCd2De5/4eJX1p09C8pOiKzWNr2vY/t9SNpDnfQsw66DroO+v7fbTbp4P9eAYDTpVkdMZ8V9lkM99nL/0+LWcRi0e1G9PdfcY83cTDJODW+O5W85vBAH7wWsX1Zd/tS3t25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);
		/*  #endif */
		
		background-repeat: no-repeat;
		background-size: cover;
		text-align: center;
		.s-boxbgk{
			margin-top: 60rpx;
			display: inline-block;
			width:140rpx;
			height:140rpx;
			border-radius: 50%;
			padding-top: 26rpx;
			box-sizing: border-box;
			text-align: center;
			background:linear-gradient(180deg,rgba(255,190,0,1) 0%,rgba(254,122,58,1) 100%);
			box-shadow:0px 6px 40px 0px rgba(206,51,47,0.3);
			color: #fff;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
	.s-box2{
		background-color: #DD423E;
		padding: 22rpx 32rpx;
		display: flex;
		justify-content: space-between;
		.s-box2-item{
			flex: 1;
			.s2-item-top{
				display: flex;
				align-items: center;
				.s2-item-right{
					flex: 1;
					height: 4rpx;
					background-color: #FF8077;
				}
				.i1{
					width: 48rpx;
					height: 48rpx;
					background-color: #FD817A;
					border-radius: 50%;
					font-size: 24rpx;
					text-align: center;
					line-height: 48rpx;
					color: #fff;
				}
				.i2{
					width: 48rpx;
					height: 48rpx;
					background-color: #D5D3D3;
					border-radius: 50%;
					font-size: 28rpx;
					text-align: center;
					line-height: 48rpx;
					color: #fff;
				}
				.i3{
					width: 48rpx;
					height: 48rpx;
					background-color: #F5B6B2;
					border-radius: 50%;
					font-size: 20rpx;
					text-align: center;
					line-height: 48rpx;
					color: #fff;
				}
			}
			.s2-item-boo{
				text-align: right;
				color: #FBE3E3;
				font-size: 22rpx;
				margin-right: -8rpx;
			}
		}
		.s-box2-item:nth-child(1){
			display: block;
			flex: inherit;
			width: 48rpx;
			.s2-item-top{
				width: 48rpx;
			}
			.s2-item-boo{
				margin-left: -8rpx;
				width: 48rpx;
				white-space: nowrap;
				text-align: left;
			}
		}
	}
	.s-box3{
		border-top: 20rpx solid #F9FAFB;
		border-bottom: 2rpx solid #DBDBDB;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 34rpx 32rpx;
		background: #fff;
		.s-box3-left{
			display: flex;
			align-items: center;
			.s-box3img{
				width: 72rpx;
				height: 72rpx;
				border-radius: 50%;
				margin-right: 12rpx;
			}
			.s-box3-text{
				colo:#303133;
				font-size: 28rpx;
			}
		}
		.s-box3-right{
			display: flex;
			align-items: center;
			.s-box3-text2{
				color: #909399;
				font-size: 26rpx;
			}
			.s-box3-text3{
				color: #F23D3D;
				font-size: 40rpx;
				font-weight: bold;
			}
		}
	}
	.s-box4{
		padding-left: 32rpx;
		padding-right: 32rpx;
		box-sizing: border-box;
		background: #fff;
		.s-box4-item{
			display: flex;
			justify-content: space-between;
			padding-top: 24rpx;
			padding-bottom: 32rpx;
			border-bottom: 2rpx solid #DBDBDB;
			.s-box4-text1{
				width: 35%;
				font-size: 28rpx;
				color:#303133;
			}
			.s-box4-text2{
				width: 35%;
				text-align: center;
				font-size: 28rpx;
				color:#303133;
			}
			.s-box4-text3{
				flex: 1;
				text-align: right;
				color: #F23D3D;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
	}
}
</style>
