/**
 * API 响应类型定义
 * 定义与后端 API 交互的请求和响应类型
 */

import type { AxiosResponse } from 'axios';
import type { Order, Payment, Product, User } from './models';

// ============================================
// 通用 API 响应类型
// ============================================

/**
 * 通用 API 响应包装类型
 * @template T - 响应数据的类型
 */
export interface ApiResponse<T> {
  /** 响应数据 */
  data: T;
  /** HTTP 状态码 */
  status: number;
  /** 状态文本 */
  statusText: string;
}

/**
 * API 错误响应
 */
export interface ApiErrorResponse {
  /** 错误消息 */
  message: string;
  /** 错误码（可选） */
  code?: string;
  /** 错误详情（可选） */
  details?: string;
}

// ============================================
// 用户相关 API 类型
// ============================================

/**
 * 登录请求数据
 */
export interface LoginRequest {
  /** 邮箱 */
  email: string;
  /** 密码 */
  password: string;
}

/**
 * 注册请求数据
 */
export interface RegisterRequest {
  /** 名 */
  firstName: string;
  /** 姓 */
  lastName: string;
  /** 邮箱 */
  email: string;
  /** 密码 */
  password: string;
}

/**
 * 更新用户信息请求数据
 */
export interface UpdateUserRequest {
  /** 名 */
  firstName: string;
  /** 姓 */
  lastName: string;
  /** 密码 */
  password: string;
}

/**
 * 用户响应类型（Axios 响应包装）
 */
export type UserResponse = AxiosResponse<User>;

// ============================================
// 产品相关 API 类型
// ============================================

/**
 * 产品列表响应类型（Axios 响应包装）
 */
export type ProductListResponse = AxiosResponse<Product[]>;

/**
 * 单个产品响应类型（Axios 响应包装）
 */
export type ProductResponse = AxiosResponse<Product>;

/**
 * 创建产品请求数据
 */
export interface CreateProductRequest {
  /** 产品名称 */
  name: string;
  /** 产品描述 */
  description: string;
  /** 产品价格 */
  price: number;
}

/**
 * 更新产品请求数据
 */
export interface UpdateProductRequest {
  /** 产品名称 */
  name?: string;
  /** 产品描述 */
  description?: string;
  /** 产品价格 */
  price?: number;
}

// ============================================
// 订单相关 API 类型
// ============================================

/**
 * 订单响应类型（Axios 响应包装）
 */
export type OrderResponse = AxiosResponse<Order>;

/**
 * 订单列表响应类型（Axios 响应包装）
 */
export type OrderListResponse = AxiosResponse<Order[]>;

/**
 * 创建订单请求数据
 */
export interface CreateOrderRequest {
  /** 产品ID */
  productId: number;
  /** 数量 */
  quantity: number;
}

/**
 * 更新订单请求数据
 */
export interface UpdateOrderRequest {
  /** 订单状态（可选） */
  orderStatus?: string;
  /** 配送状态（可选） */
  deliveryStatus?: string;
}

// ============================================
// 支付相关 API 类型
// ============================================

/**
 * 支付响应类型（Axios 响应包装）
 */
export type PaymentResponse = AxiosResponse<Payment>;

/**
 * 创建支付请求数据
 */
export interface CreatePaymentRequest {
  /** 付款账户ID */
  fromAccountId: string;
  /** 数量 */
  quantity: number;
  /** 配送地址 */
  address: string;
}

/**
 * 取消支付请求（无请求体，使用 URL 参数）
 */
export interface CancelPaymentParams {
  /** 用户ID */
  userId: number;
  /** 支付ID */
  paymentId: number;
  /** 订单ID */
  orderId: number;
}

// ============================================
// 服务类接口定义
// ============================================

/**
 * 用户服务接口
 */
export interface IUserService {
  /** 用户登录 */
  login(data: LoginRequest): Promise<UserResponse>;
  /** 用户注册 */
  create(data: RegisterRequest): Promise<UserResponse>;
  /** 获取用户信息 */
  get(id: number): Promise<UserResponse>;
  /** 更新用户信息 */
  update(id: number, data: UpdateUserRequest): Promise<UserResponse>;
}

/**
 * 产品服务接口
 */
export interface IProductService {
  /** 获取产品列表 */
  getProductList(): Promise<ProductListResponse>;
  /** 获取所有产品（别名，便于兼容） */
  getAllProducts(): Promise<ProductListResponse>;
  /** 获取单个产品 */
  getProduct(userId: number, id: number): Promise<ProductResponse>;
  /** 创建产品 */
  create(userId: number, data: CreateProductRequest): Promise<ProductResponse>;
  /** 更新产品 */
  update(userId: number, id: number, data: UpdateProductRequest): Promise<ProductResponse>;
  /** ???? */
  delete(userId: number, id: number): Promise<ProductResponse>;
}

/**
 * 订单服务接口
 */
export interface IOrderService {
  /** 获取订单列表 */
  getOrderList(userId: number): Promise<OrderListResponse>;
  /** 获取指定用户的订单列表 */
  getOrderListByUser(userId: number): Promise<OrderListResponse>;
  /** 获取单个订单 */
  getOrder(userId: number, orderId: number): Promise<OrderResponse>;
  /** 创建订单 */
  create(userId: number, data: CreateOrderRequest): Promise<OrderResponse>;
  /** 更新订单 */
  update(userId: number, orderId: number, data: UpdateOrderRequest): Promise<OrderResponse>;
}

/**
 * 支付服务接口
 */
export interface IPaymentService {
  /** 创建支付记录 */
  createPayment(
    userId: number,
    orderId: number,
    data: CreatePaymentRequest,
  ): Promise<PaymentResponse>;
  /** 取消支付 */
  cancelPayment(userId: number, paymentId: number, orderId: number): Promise<PaymentResponse>;
  /** 获取支付详情 */
  getPayment(userId: number, orderId: number, paymentId: number): Promise<PaymentResponse>;
}
