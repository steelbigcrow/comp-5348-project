/**
 * 类型定义统一导出
 * 从此文件导入所有类型定义
 */

// ============================================
// 数据模型类型导出
// ============================================
export type {
  // 用户相关
  User,
  LoginFormData,
  RegisterFormData,
  UserProfileFormData,
  // 产品相关
  Product,
  ProductWithQuantity,
  // 订单相关
  Order,
  OrderItem,
  OrderStatus,
  DeliveryStatus,
  CreateOrderData,
  OrderInfoLocationState,
  // 支付相关
  Payment,
  PaymentStatus,
  CreatePaymentData,
  PaymentInfoLocationState,
  // 会话相关
  SessionData,
  SessionKey,
} from './models';

// ============================================
// API 类型导出
// ============================================
export type {
  // 通用响应
  ApiResponse,
  ApiErrorResponse,
  // 用户 API
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  UserResponse,
  // 产品 API
  ProductListResponse,
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
  // 订单 API
  OrderResponse,
  OrderListResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
  // 支付 API
  PaymentResponse,
  CreatePaymentRequest,
  CancelPaymentParams,
  // 服务接口
  IUserService,
  IProductService,
  IOrderService,
  IPaymentService,
} from './api';

// ============================================
// 组件 Props 类型导出
// ============================================
export type {
  // 通用Props
  WithChildrenProps,
  WithClassNameProps,
  // 组件 Props
  ErrorMessageProps,
  NavbarProps,
  // 路由相关
  RouterObject,
  WithRouterProps,
  WithRouterHOC,
  // 页面 Props
  LoginPageProps,
  RegisterPageProps,
  UserProfilePageProps,
  OrderInfoPageProps,
  OrderListPageProps,
  PaymentInfoPageProps,
  ProductListPageProps,
  HomePageProps,
  // 事件处理类型
  InputChangeHandler,
  FormSubmitHandler,
  ButtonClickHandler,
  // 状态类型
  LoadingState,
  ErrorState,
  AsyncState,
} from './components';