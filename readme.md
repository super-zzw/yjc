imShop 		IM++商城，仅限APP
zhiMaiHui	智+迈+汇，仅限小程序
master		辰悠++优品汇，仅限APP+小程序
mrtht		每日++特惠团，仅限小程序

从master拆出去的其他项目需要手动修改：
1，request.js里面的_baseUrl
2，manifest.json里面APP SDK里面的支付和分享对应的appid
3，manifest.json里面微信小程序配置的appid
4，全局搜索名称替换
5，store/index.js里面的客服类型server
6，method.js里面的wxShare对应的配置