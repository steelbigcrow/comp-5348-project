/**
 * 订单列表页面组件
 * 显示用户的所有订单
 */

import type { AxiosError } from 'axios';
import type React from 'react';
import { useEffect, useState } from 'react';
import { ErrorMessage } from '../../components';
import { getSession, orderService, paymentService } from '../../services';
import type { Order, OrderListPageProps } from '../../types';

/**
 * API 错误响应类型
 */
interface ApiError {
  message?: string;
}

/**
 * OrderList 订单列表页面组件
 * 显示当前用户的所有订单及其详情
 * @param props - 组件属性
 * @returns 订单列表页面 JSX 元素
 */
const OrderList: React.FC<OrderListPageProps> = ({ className }) => {
  // 订单列表状态
  const [orders, setOrders] = useState<Order[]>([]);
  // 加载状态
  const [loading, setLoading] = useState<boolean>(true);
  // 错误状态
  const [error, setError] = useState<string | null>(null);

  // 获取用户会话
  const sessionData = getSession();
  const userId = sessionData?.userId;

  /**
   * 处理取消支付
   * @param userId - 用户ID
   * @param orderId - 订单ID
   * @param paymentId - 支付ID
   */
  const handleCancelPayment =
    (userId: number, orderId: number, paymentId: number) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      paymentService
        .cancelPayment(userId, paymentId, orderId)
        .then((response) => {
          if (response.status === 200) {
            alert('Payment cancelled successfully');
            //刷新订单列表
            setOrders((previousOrders) =>
              previousOrders.map((order) => {
                if (order.id !== orderId) {
                  return order;
                }

                return {
                  ...order,
                  orderStatus: 'REFUNDED',
                  payment: order.payment
                    ? { ...order.payment, paymentStatus: 'REFUNDED' }
                    : order.payment,
                };
              }),
            );
          }
        })
        .catch((err: AxiosError<ApiError>) => {
          console.log(err);
          setError(err.response?.data?.message || 'Failed to cancel payment');
        });
    };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setError('Please login to view orders');
        setLoading(false);
        return;
      }

      try {
        // 获取用户订单列表
        const response = await orderService.getOrderListByUser(userId);
        // 过滤当前用户的订单
        const filteredOrders = response.data.filter((order) => order.user.id === userId);
        setOrders(filteredOrders);
        setLoading(false);
      } catch (err) {
        const axiosError = err as AxiosError<ApiError>;
        setError(axiosError.message || 'Failed to fetch orders. Please try again later.');
        setLoading(false);
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <>
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      <div className={`min-h-screen bg-gray-100 p-6 flex flex-col items-center ${className || ''}`}>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Order History</h1>
        <div className="grid gap-6 max-w-2xl w-full">
          {orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105"
              >
                <h2 className="text-xl font-bold text-gray-700 mb-4">Order ID: {order.id}</h2>

                <div className="grid grid-cols-2 gap-y-2 text-gray-600">
                  <span className="font-semibold">Timestamp:</span>
                  <span>{new Date(order.timestamp).toLocaleString()}</span>

                  <span className="font-semibold">Quantity:</span>
                  <span>{order.quantity}</span>

                  <span className="font-semibold">Order Amount:</span>
                  <span>${order.amount.toFixed(2)}</span>

                  <span className="font-semibold">Order Status:</span>
                  <span>{order.orderStatus}</span>

                  <span className="font-semibold">Delivery Status:</span>
                  <span>{order.deliveryStatus}</span>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700">Product Details</h3>
                  <div className="ml-4 text-gray-600">
                    <p>
                      <span className="font-semibold">Name:</span> {order.product.name}
                    </p>
                    <p>
                      <span className="font-semibold">Description:</span>{' '}
                      {order.product.description}
                    </p>
                    <p>
                      <span className="font-semibold">Price:</span> $
                      {order.product.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700">User Information</h3>
                  <div className="ml-4 text-gray-600">
                    <p>
                      <span className="font-semibold">Name:</span> {order.user.firstName}{' '}
                      {order.user.lastName}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {order.user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700">Payment Information</h3>
                  {order.payment ? (
                    <div className="ml-4 text-gray-600">
                      <p>
                        <span className="font-semibold">Amount Paid:</span> $
                        {order.payment.amount.toFixed(2)}
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span> {order.payment.paymentStatus}
                      </p>
                      <p>
                        <span className="font-semibold">Transaction ID:</span>{' '}
                        {order.payment.transactionRecordId}
                      </p>
                    </div>
                  ) : (
                    <p className="ml-4 text-gray-500">Payment has not been made yet.</p>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  {order.payment &&
                  (order.orderStatus === 'COMPLETED' || order.orderStatus === 'REFUNDED') ? (
                    <span className="text-gray-500 text-sm">
                      Payment {order.orderStatus.toLowerCase()}
                    </span>
                  ) : order.payment && userId ? (
                    <button
                      type="button"
                      onClick={handleCancelPayment(userId, order.id, order.payment.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                      Cancel Payment
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default OrderList;
