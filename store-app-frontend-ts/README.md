# Store App Frontend (TypeScript)

这是一个使用 TypeScript 重构的 React 前端应用，用于在线商店系统。

## 项目概述

本项目是从原始 JavaScript 版本 (`store-app-frontend`)迁移到 TypeScript 的版本，提供了更好的类型安全性和开发体验。

### 技术栈

- **React18** - 用户界面库
- **TypeScript 5** - 类型安全的 JavaScript 超集
- **React Router 6** - 客户端路由
- **Axios** - HTTP 客户端
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Create React App** - 项目脚手架

## 项目结构

```
store-app-frontend-ts/
├── public/                # 静态资源
├── src/
│   ├── common/            # 公共工具和HOC
│   │   └── withRouter.tsx # 路由高阶组件
│   ├── components/        # 可复用组件
│   │   ├── error/# 错误处理组件
│   │   └── navbar/       # 导航栏组件
│   ├── pages/            # 页面组件
│   │   ├── auth/         # 认证页面 (登录/注册)
│   │   ├── order/        # 订单页面
│   │   ├── payment/      # 支付页面
│   │   ├── product/      # 产品页面
│   │   └── user/         # 用户页面
│   ├── services/         # API 服务层
│   │   ├── orderService.ts
│   │   ├── paymentService.ts
│   │   ├── productService.ts
│   │├── sessionUtil.ts
│   │   └── userService.ts
│   ├── types/            # TypeScript 类型定义
│   │   ├── api.ts        # API 相关类型
│   │   ├── components.ts # 组件属性类型
│   │   ├── models.ts     # 数据模型类型
│   │   └── index.ts      # 类型导出
│   ├── App.tsx           # 主应用组件
│   ├── index.tsx         # 应用入口
│   └── http-common.ts    # Axios 配置
├── package.json
├── tsconfig.json         # TypeScript 配置
└── tailwind.config.js    # Tailwind CSS 配置
```

## 安装

### 前置要求

- Node.js 18+ (推荐 LTS 版本)
- npm 9+

### 安装依赖

```bash
cd store-app-frontend-ts
npm install --legacy-peer-deps
```

> **注意**: 由于 `react-scripts@5.0.1` 的peer dependency 声明与 TypeScript 5 存在版本冲突，需要使用 `--legacy-peer-deps` 标志。

## 运行

### 开发模式

```bash
npm start
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。

### 生产构建

```bash
npm run build
```

构建产物将输出到 `build/` 目录。

### TypeScript 类型检查

```bash
npx tsc --noEmit
```

### 运行测试

```bash
npm test
```

## 配置

### API 端点

API 基础 URL 配置在 `src/http-common.ts` 文件中：

```typescript
const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});
```

如需修改后端 API 地址，请更新此文件。

## 功能特性

- **用户认证**: 登录、注册、会话管理
- **产品浏览**: 产品列表、产品详情
- **订单管理**: 创建订单、查看订单列表、订单详情
- **支付处理**: 订单支付功能
- **用户中心**: 用户资料管理

## 从JavaScript 迁移说明

本项目从 `store-app-frontend` JavaScript 版本迁移而来，主要变更包括：

1. **类型系统**: 添加了完整的 TypeScript 类型定义
2. **文件扩展名**: `.js` → `.tsx` / `.ts`
3. **组件命名**: 统一使用 PascalCase 命名
4. **类型安全**: 所有 API 调用和组件属性都有类型定义
5. **模块导出**: 使用统一的 barrel exports模式

## 已知问题

构建时可能出现以下 ESLint 警告（不影响功能）：

- `jsx-a11y/anchor-is-valid`: 部分链接使用了 `href="#"` 
- `@typescript-eslint/no-unused-vars`: 部分变量声明但未使用

这些警告可以在后续版本中逐步修复。

## 许可证

本项目仅供学习使用。