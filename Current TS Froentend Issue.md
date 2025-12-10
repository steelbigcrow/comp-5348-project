TypeScript 前端当前问题（与 JS 版本的功能对齐情况）

- 路由与导航不一致，导致跳转/状态传递失效：
  - App 注册了 `/orders`、`/order/:id`、`/payment/:orderId`、`/product/:id`，但 JS 版本使用 `/order-info`、`/payment-info`、`/order-list`，现有导航/状态传递会找不到页面 (src/App.tsx:40-47)。
  - Navbar 仍指向 `/order-list`，但路由只暴露 `/orders`，菜单链接失效 (src/components/navbar/Navbar.tsx:48-50)。
  - 商品列表「立即购买」跳转到 `/order-info`，路由未注册该路径，无法创建订单 (src/pages/product/ProductDetail.tsx:60-63)。
  - 创建订单后跳转 `/payment-info`，路由未注册该路径，支付页无法到达 (src/pages/order/OrderInfo.tsx:51-54)。
  - 支付成功后重定向 `/orders`，但支付页自身只能由未注册的 `/payment-info` 进入，结算链路断裂 (src/pages/payment/PaymentInfo.tsx:85-90)。
- 商品流转缺陷：
  - 注册了 `/product/:id` 但组件未读取路由参数，始终渲染商品列表，单商品详情无法工作 (src/App.tsx:47, src/pages/product/ProductDetail.tsx:18-165)。
  - product service 未在导出对象中暴露 `getProduct`，即便实现详情页也无法通过服务层获取单商品 (src/services/productService.ts:37-71)。
- 订单/支付服务问题：
  - `getOrderList` 调用的是商品列表接口 `/store/users/-1/products`，任何订单列表调用都会返回商品数据 (src/services/orderService.ts:20-22)。
  - 取消支付与创建支付使用相同 URL/动词，缺少 `/cancel` 或 DELETE，真实取消很可能无效；订单取消 helper 也未在导出对象暴露 (src/services/paymentService.ts:46-52, src/services/orderService.ts:75-88)。
- 个人信息处理风险：Profile 表单会把后端返回的密码再次填入并提交，可能覆盖现有密码且在前端状态中暴露敏感数据 (src/pages/user/Profile.tsx:73-119)。
- 环境/配置缺口：HTTP 客户端 baseURL 硬编码为 `http://127.0.0.1:8080`，并在客户端设置 `Access-Control-Allow-Origin` 头；缺少 `.env` 切换，无法方便指向 dev/prod (src/http-common.ts:12-18)。

备注
- JS 基线（store-app-frontend）仍使用 `/order-info`、`/payment-info`、`/order-list`；需要恢复这些路由或统一所有导航与路由路径。
- Session 仅持久化 `userId`；如需 token 或用户信息，请补充类型化的存取函数或恢复 JS 版本的 cookie 方案。
