/**
 * 数据模型类型定义
 * 定义应用中使用的核心数据结构
 */

//============================================
// 用户相关类型
// ============================================

/**
 * 用户模型
 * 表示系统中的用户实体
 */
export interface User {
  /** 用户唯一标识 */
  id: number;
  /** 用户名（名） */
  firstName: string;
  /** 用户名（姓） */
  lastName: string;
  /** 用户邮箱 */
  email: string;
  /** 用户密码（可选，通常不从API返回） */
  password?: string;
}

/**
 * 登录表单数据
 */
export interface LoginFormData {
  /** 邮箱 */
  email: string;
  /** 密码 */
  password: string;
}

/**
 * 注册表单数据
 */
export interface RegisterFormData {
  /** 名*/
  firstName: string;
  /** 姓 */
  lastName: string;
  /** 邮箱 */
  email: string;
  /** 密码 */
  password: string;
}

/**
 * 用户资料表单数据
 */
export interface UserProfileFormData {
  /** 名 */
  firstName: string;
  /** 姓 */
  lastName: string;
  /** 邮箱 */
  email: string /** 密码 */;
  password: string;
}

// ============================================
// 产品相关类型
// ============================================

/**
 * 产品模型
 * 表示商店中的产品实体
 */
export interface Product {
  /** 产品唯一标识 */
  id: number;
  /** 产品名称 */
  name: string;
  /** 产品描述 */
  description: string;
  /** 产品价格 */
  price: number;
}

/**
 * 带数量的产品
 * 用于购物车或订单中的产品显示
 */
export interface ProductWithQuantity extends Product {
  /** 选择的数量 */
  quantity: number;
}

// ============================================
// 订单相关类型
// ============================================

/**
 * 订单状态枚举
 */
export type OrderStatus = 'PENDING' | 'COMPLETED' | 'REFUNDED' | 'CANCELLED';

/**
 * 配送状态枚举
 */
export type DeliveryStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

/**
 * 订单模型
 * 表示用户的订单实体
 */
export interface Order {
  /** 订单唯一标识 */
  id: number;
  /** 订单创建时间戳 */
  timestamp: string;
  /** 订单数量 */
  quantity: number;
  /** 订单金额 */
  amount: number;
  /** 订单状态 */
  orderStatus: OrderStatus;
  /** 配送状态 */
  deliveryStatus: DeliveryStatus;
  /** 订单关联的产品 */
  product: Product;
  /** 订单关联的用户 */
  user: User;
  /** 订单关联的支付信息（可选） */
  payment?: Payment;
}

/**
 * 订单项模型
 * 用于创建订单时的数据结构
 */
export interface OrderItem {
  /** 产品ID */
  productId: number;
  /** 数量 */
  quantity: number;
}

/**
 * 创建订单请求数据
 */
export interface CreateOrderData {
  /** 产品ID */
  productId: number;
  /** 数量 */
  quantity: number;
}

/**
 * 订单信息页面的路由状态
 */
export interface OrderInfoLocationState {
  /** 产品ID */
  productId: number;
  /** 产品名称 */
  name: string;
  /** 产品价格 */
  price: number;
  /** 数量 */
  quantity: number;
  /** 产品描述 */
  description: string;
}

// ============================================
// 支付相关类型
// ============================================

/**
 * 支付状态枚举
 */
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'REFUNDED' | 'CANCELLED';

/**
 * 支付模型
 * 表示订单的支付信息
 */
export interface Payment {
  /** 支付唯一标识 */
  id: number;
  /** 支付金额 */
  amount: number;
  /** 支付状态 */
  paymentStatus: PaymentStatus;
  /** 交易记录ID */
  transactionRecordId: string;
}

/**
 * 创建支付请求数据
 */
export interface CreatePaymentData {
  /** 付款账户ID */
  fromAccountId: string;
  /** 数量 */
  quantity: number;
  /** 配送地址 */
  address: string;
}

/**
 * 支付信息页面的路由状态
 */
export interface PaymentInfoLocationState {
  /** 产品ID */
  productId: number;
  /** 订单数据 */
  data: Order;
  /** 产品名称 */
  name: string;
  /** 产品价格 */
  price: number;
  /** 数量 */
  quantity: number;
  /** 总价（字符串格式） */
  total: string;
}

// ============================================
// 会话相关类型
// ============================================

/**
 * 会话数据
 * 存储在sessionStorage 中的用户会话信息
 */
export interface SessionData {
  /** 用户ID */
  userId: number;
}

/**
 * 会话存储的键类型
 */
export type SessionKey = 'userId';
