//接口
export default{
	getBanner:"/app/get/banner/list",  //0：首页 1:促销 2：新品 3：精选 4 分类页头部
	getCode:"/app/sendAuthCode",  //获取短信验证码
	noticeCont:"/app/get/home/noticeInfo",  //查看公告详情
	msgNum:"/ums/message/count",  //获取未读消息总数
	msgList:"/ums/get/myMessageList",  //获取消息列表
	msgDetail:"/ums/get/myMessageInfo",  //获取消息详情
	getConfig:"/app/getConfig",  //获取项目配置
	
	getDynamicNav:"/app/get/home/nav",  //首页动态导航
	getAds:"/app/get/home/noticeList",  //首页滚动广告
	getTopic:"/sms/get/home/subject/list",  //首页主题
	getMoreTopic:"/sms/get/more/subject/list",  //首页主题更多
	getTopicDetail:"/cms/get/subjectInfo",  //根据专题id获取详情
	getTopicList:"/cms/get/productList",  //根据专题id获取商品列表
	getModule:"/sms/get/home/product/list",  //首页内容模块,1=促销 2=新品 3=精选 4=为你推荐
	getMoreModule:"/sms/get/more/product/list",  //首页更多内容模块,1=促销 2=新品 3=精选 4=为你推荐
	
	goodDetail:"/pms/get/productInfo",  //查看商品详情
	getSkuStock: "/pms/get/skuStock", // 获取价格
	saveGood:"/pms/add/productCollect",  //收藏商品
	unSaveGood:"/ums/delete/productCoolect",  //取消收藏
	addCart:"/oms/add/cart",  //添加到购物车
	getHis:"/ums/get/productView",  //浏览历史
	clearHis:"/ums/remove/productView",  //清空浏览历史
	getCartNms:"/oms/get/cartSize",  //获取购物车商品数量
	changeCartGoodNm:"/oms/update/quantity",  //修改购物车某种商品数量
	
	getCategory:"/pms/get/product/category",  //获取分类
	getCateList1:"/pms/get/one/productCategory",  //根据分类id获取列表
	getCateList2:"/pms/get/two/productCategory",  //根据分类id获取列表
	
	getCartList:"/oms/get/cartList",  //获取购物车列表
	checkCartGood:"/oms/update/Checked",  //选中/取消购物车某个商品
	checkCartAll:"/oms/selectAll/cart",  //购物车全选
	deleteCartGood:"/oms/delete/cart/product",  //删除购物车某个商品
	clearCart:"/oms/remove/cart",  //清空购物车
	
	changePwdCode:"/app/pwd/sendAuthCode",  //修改密码验证码
	changePwd:"/ums/changePassword",  //修改登录密码
	changePhone:"/ums/changePhone",  //修改手机号
	getUserInfo:"/ums/getUserInfo",  //获取用户信息
	logOut:"/ums/logout",  //退出登录
	refreshSession:"/ums/refreshSession",  //刷新session
	getCollect:"/ums/get/productCoolect",  //获取收藏列表
	deleteCollect:"/ums/delete/productCoolect",  //删除某个收藏
	getScore:"/ums/get/integrationHistory",  //获取用户积++分列表
	siginCount:"/ums/get/continuousSignInDay",  //获取签到次数
	setSigin:"/ums/integration",  //签到
	siginRule:"/ums/get/integration/rule",  //签到规则
	uploadImg:"/app/img",  //上传图片
	saveUserInfo:"/ums/update/wuser/info",  //保存用户信息
	getOrderList:"/oms/get/orderList",  //获取订单列表
	cancelOrder:"/oms/cancel/order",  //用户取消订单
	getOrderDetail:"/oms/get/orderInfo",  //根据订单id获取订单详情
	putComment:"/pms/add/productComment",  //添加商品评价
	getComment:"/pms/get/productComment",  //根据商品id获取评价
	getCommentList:"/ums/get/myComment",  //获取我的评论列表
	deleteComment:"/ums/delete/myComment",  //删除某条评论
	getInvitePoster:"/ums/getInviteImage",  //获取分享海报
	getInvite:"/ums/get/inviteList",  //获取邀请列表
	getInviteInfo: "/ums/inviteinfo" , // 获取我的邀请记录
	scoreExList:"/oms/get/exchangeHistory",  //积++分兑换列表
	deleteOrder:"/ums/delete/myOrder",  //删除订单
	reOrder:"/oms/add/orderReturnApply",  //退单
	getPrgs:"/oms/get/orderReturnApplyInfo",  //获取售后详情
	getGood:"/ums/confirm/order",  //确认收货
	
	register:"/ums/register",  //用户注册
	phoneLogin:"/ums/loginPhone",  //手机号密码登录
	codeLogin:"/ums/loginPhoneNumber",  //手机验证码登录
	resetPwd:"/ums/phoneResetLoginpwd",  //手机号重置密码
	getArticle:"/sms/get/article",  //根据文章id获取文章内容
	
	search:"/pms/product/search",  //获取搜索结果
	keyWords:"/pms/get/hotkey",  //获取搜索页关键字
	
	createOrder:"/oms/add/order",  //创建订单
	createCartOrder:"/oms/order/cart/add",  //购物车直接创建订单
	wxPay:"/pay/wx/unifiedOrder",  //微信支付
	aliPay:"/pay/al/createOrder",  //支付宝支付
	payAfter:"/pay/pay/deliveryOrder",  //货到付款下单
	payType:"/pay/getPayList",  //获取支付方式
	
	addrList:"/ums/get/receiveAddress",  //获取用户地址列表
	addAddr:"/ums/add/receiveAddress",  //用户新增收货地址
	editAddr:"/ums/update/receiveAddress",  //用户修改地址
	deleteAddr:"/ums/delete/receiveAddress",  //删除用户地址
	getAddr:"/ums/get/receiveAddress/info",  //根据id查询某个地址
	
	getYunfei:"/pms/get/freightTemplate",  //提交订单页面获取运费
	cartYunfei:"/pms/get/cart/freightTemplate",  //购物车页面获取运费
	putDeliver:"/oms/update/delivery",  //填写退货物流信息
	getGoodDeliver:"/oms/express/check",  //待收货物流
	
	checkUpdate:"/app/client/update",  //检查更新
	mpLogin:"/ums/miniApp/Login",  //小程序关联
	
	HomeFight:"/sms/get/home/groupProduct/list",  //首页团购列表
	fightList:"/sms/get/more/home/groupProduct/list",  //团购列表
	fightDetail:"/pms/get/groupRulesInfo",  //团购商品详情
	createFightOrder:"/oms/add/groupOrder",  //创建拼团订单
	
	// 返利
	getRebateInfo: "/ums/rebateinfo" ,// 获取用户返利信息
	getMyRebateList: "/ums/get/rebateList", // 获取我的返利记录
	withdraw: "/ums/withdraw" , //提现申请
	
}