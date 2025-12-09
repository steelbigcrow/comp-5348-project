/**
 * 订单服务
 * 处理订单相关的 API 请求
 */

import http from '../http-common';
import type {
  CreateOrderRequest,
  IOrderService,
  Order,
  OrderListResponse,
  OrderResponse,
  UpdateOrderRequest,
} from '../types';

/**
 * 获取所有订单列表
 * @returns Promise 包含订单数组的响应
 */
export const getOrderList = async (): Promise<OrderListResponse> => {
  return http.get<Order[]>('/store/users/-1/products');
};

/**
 * 获取指定用户的订单列表
 * @param userId - 用户ID
 * @returns Promise 包含用户订单数组的响应
 */
export const getOrderListByUser = async (userId: number): Promise<OrderListResponse> => {
  return http.get<Order[]>(`/store/users/${userId}/orders`);
};

/**
 * 获取单个订单详情
 * @param userId - 用户ID
 * @param orderId - 订单ID
 * @returns Promise 包含订单信息的响应
 */
export const getOrder = async (userId: number, orderId: number): Promise<OrderResponse> => {
  return http.get<Order>(`/store/users/${userId}/orders/${orderId}`);
};

/**
 * 创建新订单
 * @param userId - 用户ID
 * @param data - 创建订单的请求数据
 * @returns Promise 包含新创建订单信息的响应
 */
export const createOrder = async (
  userId: number,
  data: CreateOrderRequest,
): Promise<OrderResponse> => {
  return http.post<Order>(`/store/users/${userId}/orders`, data);
};

/**
 * 更新订单信息
 * @param orderId - 订单ID
 * @param data - 更新的订单数据
 * @returns Promise 包含更新后订单信息的响应
 */
export const updateOrder = async (
  orderId: number,
  data: UpdateOrderRequest,
): Promise<OrderResponse> => {
  return http.put<Order>(`/store/orders/${orderId}`, data);
};

/**
 * 取消订单
 * @param userId - 用户ID
 * @param orderId - 订单ID
 * @returns Promise 包含取消后订单信息的响应
 */
export const cancelOrder = async (userId: number, orderId: number): Promise<OrderResponse> => {
  return http.put<Order>(`/store/users/${userId}/orders/${orderId}/cancel`);
};

/**
 * 订单服务对象
 * 实现 IOrderService 接口
 */
const orderService: IOrderService = {
  getOrderList,
  getOrderListByUser,
  create: createOrder,
  update: updateOrder,
};

export default orderService;
