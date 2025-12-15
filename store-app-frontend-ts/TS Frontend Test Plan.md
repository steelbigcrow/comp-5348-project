# TS Frontend Test Plan

## 0. Status Update / 文档状态更新（2025-12-15）

> 本节用于修正本文档早期的“尚未开始写测试/测试总数为 0”等假设；以本节为准。

### 0.1 当前测试实现情况（TS 前端）

- 已实现 **Unit + Integration** 测试（Jest + React Testing Library + MSW），并在本机运行通过
- 已有测试文件分布于 `src/**/*.test.ts(x)` 与 `src/**/*.integration.test.tsx`
- 约束：**不编写/不运行任何 E2E 测试**；E2E 只保留在本文档中作为计划（符合本次任务要求）

### 0.2 覆盖清单（Unit + Integration）

- `src/App.tsx` → `src/App.integration.test.tsx`（路由与页面挂载冒烟）
- `src/pages/**`（所有页面）→ 对应的 `*.integration.test.tsx`
  - `src/pages/HomePage.tsx`：已补充 `src/pages/HomePage.test.tsx`，验证 wrapper 渲染与 `className` 透传
- `src/components/**`（UI 组件）→ 对应的 `*.test.tsx`
- `src/services/**`（API 调用层）→ 对应的 `*.test.ts`
- `src/common/withRouter.tsx` → `src/common/withRouter.test.tsx`
- `src/http-common.ts` → `src/http-common.test.ts`

### 0.3 services 覆盖的 API 方法（补充说明）

> 下面是目前 Unit 测试已覆盖到的 service 方法清单（避免只写到一半导致“有遗漏”）。

- `productService`: `getAllProducts/getProductList/getProduct/createProduct/updateProduct/deleteProduct`
- `orderService`: `getOrderList/getOrderListByUser/getOrder/createOrder/updateOrder`
- `paymentService`: `createPayment/getPayment/cancelPayment`
- `userService`: `login/register/getUser/updateUser`

### 0.4 本次任务补齐项（已完成）

- Unit：`src/pages/HomePage.tsx`（`HomePage.test.tsx`：渲染 `ProductList` + wrapper `className` 透传）

### 0.5 不单独做行为测试的文件（说明）

- `src/types/**`：纯类型定义，依赖 TypeScript 编译期保证
- `src/**/index.ts`：barrel export 文件，行为由被导出的模块测试覆盖
- `src/index.tsx` / `src/reportWebVitals.ts` / `src/setupTests.ts`：入口/初始化脚本，通常不做行为测试（由集成测试间接覆盖）

目标：为 `store-app-frontend-ts`（CRA + React 18 + TypeScript）补齐一套“可持续维护”的前端测试体系，覆盖单元测试（Unit）、集成测试（Integration）与端到端测试（E2E），并能够在本地与 CI 中稳定运行。

> 本文档是**实施规划**，不直接修改业务代码；但会指出为了提升可测性，可能需要的轻量重构点（例如抽象 `window.location` / `alert`）。

---

## 1. 现状检查（当前项目是否已有测试？）

已检查目录 `store-app-frontend-ts/`：

- 已存在测试运行入口：`package.json` 中有 `test: "react-scripts test"`（CRA 自带 Jest）。
- 已存在测试环境初始化文件：`src/setupTests.ts`（目前仅引入 `@testing-library/jest-dom`）。
- 已存在 React Testing Library 相关依赖：`@testing-library/react`、`@testing-library/user-event`、`@testing-library/jest-dom`。
- **未发现任何实际测试用例文件**：`src/` 下没有 `*.test.ts(x)` / `*.spec.ts(x)`，也没有 `__tests__` 目录。
- **未发现 E2E 工具**：无 `cypress/`、`playwright.config.*` 等配置与脚本。

结论：当前 TS 前端“具备基本单测运行器/依赖”，但**测试用例几乎为 0**，也没有集成/E2E 测试体系。

---

## 2. 测试策略（测试金字塔）

采用测试金字塔原则，优先级与数量建议如下：

1. **Unit（最多）**：组件/工具函数/服务层（axios 调用）在隔离环境下验证逻辑与边界。
2. **Integration（中等）**：以“页面”为单位验证路由、表单交互、网络请求（Mock API）、错误提示、状态流转等。
3. **E2E（最少但最关键）**：覆盖核心用户旅程（浏览→登录/注册→下单→支付→订单列表→取消支付→资料更新）。

同时分层保证：

- Unit/Integration：**不依赖真实后端**（避免不稳定、速度慢、难复现）。
- E2E：默认使用**网络拦截 mock**保证确定性；可选增加“连接真实后端”的 smoke E2E（更接近系统测试）。

---

## 3. 技术选型

### 3.1 Unit/Integration（Jest + RTL）

基于 CRA（`react-scripts`）默认 Jest 配置，使用：

- 测试运行器：Jest（由 CRA 提供）
- UI 测试：React Testing Library（`@testing-library/react`）
- 交互模拟：`@testing-library/user-event`
- DOM 断言：`@testing-library/jest-dom`
- API Mock：建议引入 **MSW（Mock Service Worker）**
  - Node 侧：`msw/node` + `setupServer`
  - 目的：让页面测试覆盖 “组件 → service → axios → HTTP” 的链路，但无需真实后端

> 说明：也可以选择直接 `jest.mock()` service/http 模块，但 MSW 更贴近真实交互，且更适合集成测试。

### 3.2 E2E（Playwright）

建议选 **Playwright**（TypeScript 体验好，跨浏览器，配置清晰）：

- `@playwright/test` + `playwright.config.ts`
- 支持 headless / headed、trace、失败截图、并行执行

可选方案：Cypress（也可以，但本项目 TS + 现代工具链下 Playwright 更合适）。

---

## 4. 目录规范与命名约定

### 4.1 推荐目录结构

在 `src/` 下新增测试基础设施目录（CRA 会自动发现 `src/**/*.test.ts(x)`）：

```
src/
  test/
    fixtures/          # 复用的测试数据（products/orders/users）
    msw/
      handlers.ts      # MSW handlers（按 endpoint 组织）
      server.ts        # setupServer()
    utils/
      render.tsx       # renderWithRouter / renderWithProviders
      # session.ts     # (optional) setSessionForTest / clearSessionForTest
      # window.ts      # (optional) mock alert/location/reload 等
```

测试文件放置策略（二选一，建议 A）：

- A（推荐）：**就近放置**：`Navbar.tsx` 对应 `Navbar.test.tsx`
- B：集中放置：`src/__tests__/unit/...`、`src/__tests__/integration/...`

### 4.2 命名

- 单元测试：`*.test.ts` / `*.test.tsx`
- 集成测试：`*.integration.test.tsx`（或放在 `src/__tests__/integration`）
- E2E 测试：`store-app-frontend-ts/e2e/*.spec.ts`

---

## 5. Unit Test 规划（按模块列出覆盖点）

> Unit 的原则：单文件/单组件为单位，mock 掉网络/路由/全局副作用，只验证当前单元的行为与边界。

### 5.1 `src/services/sessionUtil.ts`

覆盖点：

- `setUserId()` / `getUserId()`：能写入/读取 `sessionStorage`；空值返回 `null`
- `getSession()`：无 userId 返回 `null`；有 userId 返回 `{ userId }`
- `clearSession()`：移除 key
- `isLoggedIn()`：与 `getUserId()` 一致
- 边界：`sessionStorage` 中是非数字字符串时的行为（当前实现会 `parseInt`，应定义期望）

### 5.2 `src/common/withRouter.tsx`

覆盖点：

- 包装组件能收到 `router.location/router.navigate/router.params`
- `displayName` 符合 `withRouter(ComponentName)` 规则（便于调试）

### 5.3 `src/http-common.ts`

覆盖点：

- 默认 `baseURL` 使用 `process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8080'`
- headers 包含 `Content-type: application/json`

> 可测性提示：测试中临时设置/恢复 `process.env.REACT_APP_API_BASE_URL`。

### 5.4 `src/components/error/ErrorMessage.tsx`

覆盖点：

- 正确渲染 message 与 `role="alert"`
- 5s 自动关闭：使用 Jest fake timers 验证 `onClose()` 被调用
- unmount 清理定时器：确保无多余调用（可通过 jest timer count / spy）

### 5.5 `src/components/navbar/Navbar.tsx`

覆盖点：

- 未登录（`getSession()` 返回 null）：显示 `Login/Register` 链接
- 已登录：显示 `Order List/Profile/Logout`
- `Toggle menu`：点击后 mobile menu 显示/隐藏
- `Logout`：调用 `clearSession()` 并触发 `window.location.reload()`

> 可测性提示：测试里需要 mock `getSession/clearSession` 或直接写入 `sessionStorage`；同时 stub `window.location.reload`。

### 5.6 `src/services/*Service.ts`（axios 封装）

覆盖点（建议用 `jest.mock('../http-common')` + 断言调用参数）：

- `productService.getProductList()` → GET `/store/users/-1/products`
- `productService.getProduct(userId, id)` → GET `/store/users/${userId}/products/${id}`
- `orderService.create(userId, data)` → POST `/store/users/${userId}/orders`
- `paymentService.createPayment(userId, orderId, data)` → POST `/store/users/${userId}/orders/${orderId}/payments`
- `paymentService.cancelPayment(userId, paymentId, orderId)` → PUT `/store/users/${userId}/orders/${orderId}/payments/${paymentId}`
- `userService.login/register/get/update` endpoint 与 payload 正确

目的：快速发现“URL 拼错 / method 用错 / 参数顺序错”的问题。

---

## 6. Integration Test 规划（页面级：路由 + 交互 + Mock API）

> Integration 的原则：以页面/用户交互为中心，尽量少 mock 组件本身；使用 MSW 模拟后端响应，使测试覆盖“渲染 → 交互 → API → UI 反馈”的完整链路。

### 6.1 通用测试基建

1. 在 `src/setupTests.ts` 中加入 MSW server 的生命周期：
   - `beforeAll(server.listen)`
   - `afterEach(server.resetHandlers)`
   - `afterAll(server.close)`
2. 实现 `renderWithRouter()`：
   - 允许传入 `initialEntries` 与 `route`，方便测试 `useParams/useLocation`
3. 统一处理全局副作用：
   - `window.alert`：`jest.spyOn(window, 'alert').mockImplementation(() => {})`
   - `window.location.href` / `window.location.reload`：用 helper 做可控替身

### 6.2 `src/App.tsx`（路由冒烟）

覆盖点：

- 路由 `/` 渲染 `HomePage`（应包含 `ProductList`）
- `/login`、`/register`、`/profile`、`/order-list`、`/order-info`、`/payment-info`、`/product`、`/product/:id` 能渲染对应页面

### 6.3 Product 流程

`ProductList.tsx`：

- Loading → 成功渲染商品卡片
- API 失败 → 显示错误提示
- 点击某个商品 → 跳转到 `/product/:id`

`ProductDetail.tsx`：

- 无效 id（`/product/abc` 或缺失）→ 显示 `Invalid product id.`
- API 成功 → 显示 name/description/price
- 数量增减按钮：最小为 1
- 未登录：显示 “Please login to purchase”
- 已登录：显示 `Buy Now`，点击后跳转 `/order-info` 并携带 state

### 6.4 Auth 流程

`Login.tsx`：

- 输入 email/password，提交后调用 login endpoint
- 成功：调用 `setSession({ userId })`，并跳转首页（当前用 `window.location.href`）
- 失败：显示 `ErrorMessage` 且可关闭
- `Forgot Password?` 点击触发 alert（仅验证调用）

`Register.tsx`：

- 输入 first/last/email/password，提交后调用 register endpoint
- 成功：setSession + 跳转首页
- 失败：显示 `ErrorMessage`

### 6.5 Order & Payment 流程

`OrderInfo.tsx`：

- 缺少 `location.state` → 显示 “No product information available.”
- 未登录提交 → alert + 跳转 `/login`
- 登录提交 → create order 成功后跳转 `/payment-info` 并携带 state（包含 total）
- create order 失败 → alert

`PaymentInfo.tsx`：

- 缺少 `location.state` → 显示 “No order information available.”
- 未登录 → 显示 `ErrorMessage: Please login first.`
- 输入 accountId/address 提交：
  - 成功：alert + 跳转 `/order-list`（当前实现 `window.location.href`）
  - 失败：显示后端错误 message（MSW 返回）或默认 “An Error Occurred”

`OrderList.tsx`：

- 未登录：显示错误提示 “Please login to view orders”
- 登录后：
  - 拉取订单并按 `order.user.id === userId` 过滤
  - 无订单：显示 “No orders found.”
  - 有订单：渲染订单卡片 + payment 信息
  - payment 可取消且状态非 COMPLETED/REFUNDED：显示 `Cancel Payment`，点击后调用 cancel endpoint
  - cancel 失败：显示 `ErrorMessage`

### 6.6 Profile 流程

`Profile.tsx`：

- 未登录：提示 “Please login first.” 并跳转 `/login`
- 登录后 mount：调用 get user endpoint 并回填 first/last/email
- 提交时 password 为空：提示 “Password is required...”
- 提交成功：调用 update endpoint 并 navigate `/`
- 提交失败：显示错误信息

---

## 7. E2E Test 规划（Playwright）

### 7.1 运行方式（建议）

目标：E2E 能在 CI 无头运行且稳定。

推荐两种模式：

1. **Mock API E2E（默认）**
   - Playwright 使用 `page.route('**/store/**', ...)` 直接 mock 后端响应
   - 优点：无后端依赖、速度快、可重复、flake 少
2. **Real API Smoke E2E（可选）**
   - 启动后端服务（至少 `store_application`）+ 测试数据库
   - 前端设置 `REACT_APP_API_BASE_URL`
   - 仅做少量 smoke case，避免难维护

### 7.2 E2E 场景清单（覆盖核心旅程）

1. **匿名浏览商品**
   - 打开 `/` → 列表出现 → 点击进入详情 → 看见 “Please login to purchase”
2. **注册并登录态校验**
   - `/register` 填表提交 → 回到首页
   - Navbar 出现 `Order List/Profile/Logout`
3. **登录后下单-支付-订单列表**
   - 通过初始化脚本写入 `sessionStorage.userId`
   - `/product/:id` → `Buy Now` → `/order-info` → `Create Order`
   - `/payment-info` → 填 account/address → `Make Payment` → `/order-list` 出现订单
4. **取消支付**
   - 在订单列表点击 `Cancel Payment` → 状态提示/刷新后按钮消失（取决于后端/Mock）
5. **更新个人资料**
   - `/profile` 修改 first/last + password → 提交 → 回首页

> 注意：由于当前实现使用 `window.location.href` 和 `window.location.reload()`，E2E 需等待导航完成；Playwright 里用 `await page.waitForURL(...)` 稳定同步。

### 7.3 E2E 工程化

- 新增脚本：
  - `npm run test:e2e`：运行 Playwright
  - `npm run test:e2e:ui`：调试模式
- Playwright artifacts：
  - 失败截图、trace（仅失败保存）
- 选择器规范：
  - 优先 `getByRole/getByLabel`，必要时补 `data-testid`（尽量少加）

---

## 8. 分阶段落地步骤（建议执行顺序）

### Phase 0：基建（让测试跑起来）

- [ ] 在 `src/setupTests.ts` 接入 MSW server 生命周期
- [ ] 新增 `src/test/utils/render.tsx`（MemoryRouter 包装）
- [ ] 新增 `src/test/fixtures/*`（products/orders/users）
- [ ] 新增 `src/test/msw/*`（handlers/server）
- [ ] 确认 `CI=true npm test -- --watchAll=false` 可在一次性模式下运行

### Phase 1：Unit Tests（快、稳定、覆盖基础逻辑）

- [ ] `sessionUtil.test.ts`
- [ ] `withRouter.test.tsx`
- [ ] `http-common.test.ts`
- [ ] `ErrorMessage.test.tsx`
- [ ] `Navbar.test.tsx`
- [ ] 各 `*Service.test.ts`（断言 endpoint/method/payload）

### Phase 2：Integration Tests（页面与流程）

- [ ] `App` 路由冒烟测试
- [ ] `ProductList`（loading/success/error + 点击导航）
- [ ] `ProductDetail`（invalid id / 未登录 / 登录 buy now）
- [ ] `Login` / `Register`（成功/失败）
- [ ] `OrderInfo` → `PaymentInfo` 串联（使用 MemoryRouter + location state）
- [ ] `OrderList`（未登录/无订单/有订单/取消支付失败）
- [ ] `Profile`（加载/提交校验/成功/失败）

### Phase 3：E2E Tests（Playwright）

- [ ] 引入 Playwright 与 `playwright.config.ts`
- [ ] `e2e/anonymous-browse.spec.ts`
- [ ] `e2e/auth.spec.ts`
- [ ] `e2e/order-payment.spec.ts`
- [ ] `e2e/profile.spec.ts`

### Phase 4：质量门槛与稳定性

- [ ] 覆盖率报告：`--coverage`（先不设太高阈值，逐步抬升）
- [ ] 清理 flaky：统一等待点（`findBy*` / `waitForURL`）、减少依赖时间
- [ ]（可选）把 `window.location.href/reload/alert` 抽象成可注入的工具层，降低测试复杂度

---

## 9. 完成标准（Definition of Done）

当满足以下条件，认为“TS 前端测试体系建设完成”：

- Unit/Integration：
  - [ ] `npm test` 能在 CI 模式下（非 watch）一次性跑完
  - [ ] 覆盖 `src/pages`、`src/components`、`src/services` 的核心逻辑与分支
  - [ ] 失败时输出清晰（断言信息明确、不会吞错误）
- E2E：
  - [ ] `npm run test:e2e` 可本地运行并稳定通过
  - [ ] 覆盖至少 3 条核心用户旅程（浏览、登录/注册、下单支付/订单）
- 文档：
  - [ ] README 或新增 `TESTING.md`（可选）说明如何运行三类测试与常见问题
