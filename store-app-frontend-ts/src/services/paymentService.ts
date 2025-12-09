/**
 * 支付服务
 * 处理支付相关的 API 请求
 */

import http from '../http-common';
import type { CreatePaymentRequest, IPaymentService, Payment, PaymentResponse } from '../types';

/**
 * 创建支付
 * @param userId - 用户ID
 * @param orderId - 订单ID
 * @param data - 创建支付的请求数据
 * @returns Promise 包含支付信息的响应
 */
export const createPayment = async (
  userId: number,
  orderId: number,
  data: CreatePaymentRequest,
): Promise<PaymentResponse> => {
  return http.post<Payment>(`/store/users/${userId}/orders/${orderId}/payments`, data);
};

/**
 * 获取支付详情
 * @param userId - 用户ID
 * @param orderId - 订单ID
 * @param paymentId - 支付ID
 * @returns Promise 包含支付信息的响应
 */
export const getPayment = async (
  userId: number,
  orderId: number,
  paymentId: number,
): Promise<PaymentResponse> => {
  return http.get<Payment>(`/store/users/${userId}/orders/${orderId}/payments/${paymentId}`);
};

/**
 * 取消支付
 * @param userId - 用户ID
 * @param paymentId - 支付ID
 * @param orderId - 订单ID
 * @returns Promise 包含取消后支付信息的响应
 */
export const cancelPayment = async (
  userId: number,
  paymentId: number,
  orderId: number,
): Promise<PaymentResponse> => {
  return http.put<Payment>(`/store/users/${userId}/orders/${orderId}/payments/${paymentId}`);
};

/**
 * 支付服务对象
 * 实现 IPaymentService 接口
 */
const paymentService: IPaymentService = {
  createPayment,
  cancelPayment,
};

export default paymentService;
