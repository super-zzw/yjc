<template>
	<view>
		<!-- 直接客服 -->
		<web-view :src="config.MALL_CUSTOMER_URL"></web-view>
		<!-- 通过service页面客服（带参数咨询客服） -->
		<!-- <web-view :src="baseUrl"></web-view> -->
	</view>
</template>

<script>
import {mapState} from 'vuex'
	export default {
		data() {
			return {
				// uid:"",
				// pid:"",
				// oid:"",
				// baseUrl:"",
				// data:{}
			}
		},
		computed:{
			...mapState(['config'])
		},
		onLoad(opt) {
			// 带参数咨询客服测试代码
			// let _data = {
			// 	uid:opt.uid,
			// 	pid:opt.pid,
			// 	oid:opt.oid
			// }
			// //转化参数
			// let _result = []
			// for (let key in _data) {
			//   let value = _data[key]
			//   if (value.constructor === Array) {
			// 	value.forEach(_value => {
			// 	  _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
			// 	})
			//   } else {
			// 	_result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
			//   }
			// }
			// _result = _result.join('&')
			// this.baseUrl = "http://192.168.1.10/chenyou/CymallAppH5/service.html?" + _result
		},
		onHide() {
			// this.baseUrl = ""
		}
	}
</script>

<style>

</style>
