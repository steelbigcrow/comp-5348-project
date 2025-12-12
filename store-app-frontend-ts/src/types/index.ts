/**
 * 类型定义统一导出
 * 从此文件导入所有类型定义
 */

// ============================================
// API 类型导出
// ============================================
export type {
  ApiErrorResponse,
  // 通用响应
  ApiResponse,
  CancelPaymentParams,
  CreateOrderRequest,
  CreatePaymentRequest,
  CreateProductRequest,
  IOrderService,
  IPaymentService,
  IProductService,
  // 服务接口
  IUserService,
  // 用户 API
  LoginRequest,
  OrderListResponse,
  // 订单 API
  OrderResponse,
  // 支付 API
  PaymentResponse,
  // 产品 API
  ProductListResponse,
  ProductResponse,
  RegisterRequest,
  UpdateOrderRequest,
  UpdateProductRequest,
  UpdateUserRequest,
  UserResponse,
} from './api';
// ============================================
// 组件 Props 类型导出
// ============================================
export type {
  AsyncState,
  ButtonClickHandler,
  // 组件 Props
  ErrorMessageProps,
  ErrorState,
  FormSubmitHandler,
  HomePageProps,
  // 事件处理类型
  InputChangeHandler,
  // 状态类型
  LoadingState,
  // 页面 Props
  LoginPageProps,
  NavbarProps,
  OrderInfoPageProps,
  OrderListPageProps,
  PaymentInfoPageProps,
  ProductListPageProps,
  RegisterPageProps,
  // 路由相关
  RouterObject,
  UserProfilePageProps,
  // 通用Props
  WithChildrenProps,
  WithClassNameProps,
  WithRouterHOC,
  WithRouterProps,
} from './components';
// ============================================
// 数据模型类型导出
// ============================================
export type {
  CreateOrderData,
  CreatePaymentData,
  DeliveryStatus,
  LoginFormData,
  // 订单相关
  Order,
  OrderInfoLocationState,
  OrderItem,
  OrderStatus,
  // 支付相关
  Payment,
  PaymentInfoLocationState,
  PaymentStatus,
  // 产品相关
  Product,
  ProductWithQuantity,
  RegisterFormData,
  // 会话相关
  SessionData,
  SessionKey,
  // 用户相关
  User,
  UserProfileFormData,
} from './models';
