<template>
	<view class="s-box">
		<rich-text :nodes="content" class="sx-cont"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:"",
				content:""
			}
		},
		methods: {
			
		},
		async onLoad(opt){
			if(opt.id){
				this.id = opt.id
				await this.$http({
					apiName:"getArticle",
					data:{id:this.id}
				}).then(res => {
					uni.setNavigationBarTitle({
						title:res.data.name
					})
					this.content = res.data.content.replace(/\<img/gi, '<img class="cont_img" ');
				}).catch(_ => {})
			}
			if(opt.noticeId){
				this.id = opt.noticeId
				await this.$http({
					apiName:"noticeCont",
					data:{noticeId:this.id}
				}).then(res => {
					uni.setNavigationBarTitle({
						title:res.data.noticeTitle
					})
					this.content = res.data.noticeContent
				}).catch(_ => {})
			}
		}
	}
</script>

<style lang="scss" scoped>
.s-box{
	padding: 32rpx;
}
</style>
