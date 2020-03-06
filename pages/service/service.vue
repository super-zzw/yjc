<template>
	<view>
		<!-- 直接客服 -->
		<web-view src="https://tb.53kf.com/code/app/812ec67700b98d35ed496f3b3ce4799a5/1"></web-view>
		<!-- <web-view :src="baseUrl"></web-view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid:"",
				pid:"",
				oid:"",
				baseUrl:"",
				data:{}
			}
		},
		methods: {
			
		},
		onLoad(opt) {
			let _data = {
				uid:opt.uid,
				pid:opt.pid,
				oid:opt.oid
			}
			//转化参数
			let _result = []
			for (let key in _data) {
			  let value = _data[key]
			  if (value.constructor === Array) {
				value.forEach(_value => {
				  _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
				})
			  } else {
				_result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
			  }
			}
			_result = _result.join('&')
			this.baseUrl = "http://192.168.1.10/chenyou/CymallAppH5/service.html?" + _result
		},
		onHide() {
			this.baseUrl = ""
		}
	}
</script>

<style>

</style>
