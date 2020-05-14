imShop 		IM++商城，仅限APP(废弃)
zhiMaiHui	智+迈+汇，仅限小程序
master		辰悠++优品汇，仅限APP+小程序；Im ++Lucky，仅限APP
mrtht		每日++特惠团，仅限小程序
优品汇下载地址：[](http://web.vyunmall.com)注册[](http://web.vyunmall.com/register.html)
Im ++ Lucky注册地址[](http://web.youmall.vip/register.html)

从master拆出去的其他项目需要手动修改：
1，request.js：baseUrl
2，manifest.json：APP SDK配置里面的微信支付和分享appid
3，manifest.json：微信小程序配置的appid
4，store/index.js：客服类型server
5，全局搜索名称替换
6，method.js：wxShare方法对应的参数修改
7，Im ++ Lucky改名注意：
	6.1，pages.json的navigationBarTitleText改成幸运星辰，
	6.2，Im ++ Lucky两个商品详情页面右上角没有分享按钮，需要在pages.json注释掉
8，关于分享：（store里面设置了aboutShare字段处理,需要修改对应的页面链接）
app有对应的小程序则分享到小程序（method.js里面的wxShare方法），没有小程序分享到h5页面(pagesB/reate/index里面的appShare方法)
其中邀请返利分享到注册页面，拼团分享到下载页面