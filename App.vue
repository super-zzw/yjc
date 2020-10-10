<script>
	// 这是一句才
	import utils from 'utils/method.js'
	import store from 'store/index.js'
	// import Voice from 'components/QS-baiduyy/QS-baiduyy.js';
	export default {
		methods: {},
		async onLaunch() {
			await this.$getConfig()
			if (store.state.hasLogin) {
				utils.getUserInfo()
			}
			// this.$getMsgNms()
			// #ifdef MP-WEIXIN
			let menuButton = uni.getMenuButtonBoundingClientRect();
			this.$store.commit('setPaddingTop', menuButton.top + 'px');
			// #endif
			//#ifdef APP-PLUS    
			let model = uni.getSystemInfoSync().platform
			plus.push.setAutoNotification(true)
			var t1 = setInterval(() => {
				var clientid = plus.push.getClientInfo().clientid;
				if (clientid && clientid !== 'null') {
					uni.setStorageSync('clientId', clientid)
					uni.setStorageSync('clientModel', uni.getSystemInfoSync().platform)
					console.log(clientid);
					// console.log(plus.push.getClientInfo())
					clearInterval(t1)
				}
			}, 1000)




			/* 5+  push 消息推送 ps:使用:H5+的方式监听，实现推送*/
			// if(model=='android'){
			//监听在线消息事件

			let iosOrderId
			plus.push.addEventListener("receive", async function(msg) {
				console.log('receive')

				var payload = msg.payload;

				if (model == 'ios') { //如果是IOS    

					console.log(msg)
					if (msg.aps != null && msg.type == "receive") {

						var messageTitle = msg.title;
						var messageContent = msg.aps.alert.title;
						//创建本地消息,发送的本地消息也会被receive方法接收到，但没有type属性，且aps是null    
						//创建本地消息,发送的本地消息也会被receive方法接收到，但没有type属性，且aps是null  
						plus.push.createMessage(messageContent, JSON.stringify(payload), {
							title: messageTitle
						});

					}
					if (msg.aps == null) {
						iosOrderId = JSON.parse(payload).result
					}
				}

				if (model == 'android') {
					//如果是Android，当APP在线时，收到透传消息不会进入系统消息，需要发送本地提醒。    
					console.log(msg)
					setTimeout(function() {
						if (store.state.hasLogin) {
							uni.navigateTo({
								url: '/pages/myBill/billDetail?id=' + JSON.parse(payload).orderId
							})
						} else {
							uni.navigateTo({
								url: '/pages/public/login'
							})
							store.commit('setAfterLoginUrl', '/pages/myBill/billDetail?id=' + JSON.parse(payload).orderId);
						}
					}, 1000)

				}


			}, false);
			// }else if(model=='ios'){
			plus.push.addEventListener("click", function(msg) {
				console.log('click')
				console.log(msg)
				if (model == 'ios') {
					if (msg.type == 'click') {
						iosOrderId = msg.payload.result
					}
					setTimeout(function() {
						if (store.state.hasLogin) {
							uni.navigateTo({
								url: '/pages/myBill/billDetail?id=' + iosOrderId
							})
						} else {
							uni.navigateTo({
								url: '/pages/public/login'
							})
							store.commit('setAfterLoginUrl', '/pages/myBill/billDetail?id=' + iosOrderId);
						}
					}, 1000)
				}


			}, false);
			// }



			//#endif   
		},
		onShow() {
			// console.log('App Show')
			// #ifdef APP-PLUS
			var args = plus.runtime.arguments;
			let _inviteCode = args.split('?')[1]
			if (args && _inviteCode && _inviteCode.length == 6) {
				if (!uni.getStorageSync("yzhrefreshSession")) {
					uni.reLaunch({
						url: "/pages/public/register?inviteCode=" + _inviteCode
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '当前已有账号登录，是否退出继续注册',
						success: function(res) {
							if (res.confirm) {
								utils.rmData()
								uni.reLaunch({
									url: "/pages/public/register?inviteCode=" + _inviteCode
								})
							}
						}
					})
				}

			}
			// #endif
		},
		async onHide() {

		},
	}
</script>

<style lang='scss'>
	@import "/static/font/iconfont/iconfont.css";

	/* #ifdef MP-WEIXIN */
	.wxPage {
		margin-top: 70rpx;
	}

	/* #endif */
	uni-checkbox .uni-checkbox-input {
		/* border-radius: 50%; */
		width: 36rpx;
		height: 36rpx;
		
	}

	
	wx-checkbox .wx-checkbox-input {
		border-radius: 50%;
	}

	wx-checkbox .wx-checkbox-input.wx-checkbox-input-checked:before {
		color: #F23D3D;
		font-weight: bold;
	}

	.uni-picker-container .uni-picker-action.uni-picker-action-confirm {
		color: #f23d3d;
	}

	.wx-picker-container .wx-picker-action.wx-picker-action-confirm {
		color: #f23d3d;
	}

	.cont_img {
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		max-width: 100%;
		height: auto
	}

	.cont_img2 {
		max-width: 100%;
		height: auto;
		/* margin-top: -12rpx; */
		vertical-align: top;
	}

	/* 公共(组件)样式 */
	.flex {
		display: flex;
	}

	.align-items {
		align-items: center;
	}

	.justify-center {
		justify-content: center;
	}

	.justify-around {
		justify-content: space-around;
	}

	.justify-between {
		justify-content: space-between;
	}

	.flex-wrap {
		flex-wrap: wrap;
	}

	.flex-column {
		flex-direction: column;
	}

	.no_more {
		width: 100%;
		box-sizing: border-box;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		font-size: 26rpx;
		color: #ccc;
		display: flex;
		justify-content: center;
		align-items: center;

		.no_more_text {
			margin-left: 12rpx;
			margin-right: 12rpx;
		}

		.no_more_side {
			display: inline-block;
			width: 80rpx;
			height: 2rpx;
			background-color: #ddd;
		}
	}

	/* 定义数字字体 */

	/*  #ifdef APP-PLUS || H5 */
	@font-face {
		font-family: rmttf;
		font-weight: normal;
		font-style: normal;
		src: url('https://xmall-1300255297.cos.ap-guangzhou.myqcloud.com/cymall/font/Roboto-Medium.ttf') format('truetype');
	}

	.nm-font {
		font-family: "rmttf" !important;
	}

	/*  #endif  */
	/*
		全局公共样式和字体图标
	*/
	view,
	scroll-view,
	swiper,
	swiper-item,
	cover-view,
	cover-image,
	icon,
	text,
	rich-text,
	progress,
	button,
	checkbox,
	form,
	input,
	label,
	radio,
	slider,
	switch,
	textarea,
	navigator,
	audio,
	camera,
	image,
	video {
		box-sizing: border-box;
	}

	/* 骨架屏替代方案 */
	.Skeleton {
		background: #f3f3f3;
		padding: 20rpx 0;
		border-radius: 8rpx;
	}

	/* 图片载入替代方案 */
	.image-wrapper {
		font-size: 0;
		background: #f3f3f3;
		border-radius: 4px;

		image {
			width: 100%;
			height: 100%;
			transition: .6s;
			opacity: 0;

			&.loaded {
				opacity: 1;
			}
		}
	}

	.clamp {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;

	}

	.common-hover {
		background: #f5f5f5;
	}

	/*边框*/
	.b-b:after,
	.b-t:after {
		position: absolute;
		z-index: 3;
		left: 0;
		right: 0;
		height: 0;
		content: '';
		transform: scaleY(.5);
		border-bottom: 1px solid $border-color-base;
	}

	.b-b:after {
		bottom: 0;
	}

	.b-t:after {
		top: 0;
	}

	/* button样式改写 */
	uni-button,
	button {
		height: 80rpx;
		line-height: 80rpx;
		font-size: $font-lg + 2rpx;
		font-weight: normal;

		&.no-border:before,
		&.no-border:after {
			border: 0;
		}
	}

	uni-button[type=default],
	button[type=default] {
		color: $font-color-dark;
	}

	/* input 样式 */
	.input-placeholder {
		color: #999999;
	}

	.placeholder {
		color: #999999;
		text-align: center
	}

	.placeholder1 {
		color: #999999;

	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(52, 52, 52, 0.7);
		z-index: 100;
	}

	/* .placeholderClass{
		color:#aaa;
		text-align:center
	} */
</style>
