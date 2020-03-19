<template>
	<view class="ptRule">
		<view class="ptrItem" v-for="(item,index) in data" :key="index">
			<view class="ptrTitle">
				STEP{{index + 1}}
			</view>
			<view class="ptrText">
				{{item.text}}
			</view>
			<view class="ptrImg">
				<image :src="item.img_url" mode="widthFix"></image>
			</view>
		</view>
		<view class="ptrBoo">
			<view class="ptrBoo1">
				其他说明
			</view>
			<view class="ptrBoo2">
				1.在<text class="ptrBooText">个人中心-我的订单</text>中，可以查看自己的拼团订单；
			</view>
			<view class="ptrBoo3">
				2.在拼团有效时间内，不允许取消已支付的拼团订单
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				data:[
					{
						text:"进入对应拼团商品页面，点击“我要参团”按钮",
						img_url:"https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/group/r1.png"
					},
					{
						text:"提交并成功支付订单",
						img_url:"https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/group/r2.png"
					},
					{
						text:"点击“邀请好友参团”按钮并成功分享",
						img_url:"https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/group/r3.png"
					},
					{
						text:"在开团有效时间内，凑齐人数即可拼团成功；未凑齐人数则拼团失败，平台将原路退款到付款账户",
						img_url:"https://ymall-1300255297.cos.ap-hongkong.myqcloud.com/group/r4.png"
					}
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
