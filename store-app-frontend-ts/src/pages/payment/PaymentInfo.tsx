/**
 * 支付信息页面组件
 * 处理订单支付功能
 */

import type { AxiosError } from 'axios';
import type React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorMessage } from '../../components';
import { getSession, paymentService } from '../../services';
import type {
  FormSubmitHandler,
  InputChangeHandler,
  PaymentInfoLocationState,
  PaymentInfoPageProps,
} from '../../types';

/**
 * API 错误响应类型
 */
interface ApiError {
  message?: string;
}

/**
 * PaymentInfo 支付信息页面组件
 * 显示订单摘要并处理支付
 * @param props - 组件属性
 * @returns 支付信息页面 JSX 元素
 */
const PaymentInfo: React.FC<PaymentInfoPageProps> = ({ className }) => {
  // 获取路由状态
  const location = useLocation();
  const { data, name, price, quantity, total } = (location.state as PaymentInfoLocationState) || {};

  // 表单状态
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');
  // 错误状态
  const [error, setError] = useState<string>('');

  // 获取用户会话
  const sessionData = getSession();
  const userId = sessionData?.userId;

  /**
   * 处理账户ID输入变更
   */
  const handleCardNumberChange: InputChangeHandler = (e) => {
    setCardNumber(e.target.value);
  };

  /**
   * 处理地址输入变更
   */
  const handleCardNameChange: InputChangeHandler = (e) => {
    setCardName(e.target.value);
  };

  /**
   * 处理支付提交
   * @param e - 表单提交事件
   */
  const handlePayment: FormSubmitHandler = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError('Please login first.');
      return;
    }

    if (!data) {
      setError('Order data not found.');
      return;
    }

    const account = {
      fromAccountId: cardNumber,
      quantity: data.quantity,
      address: cardName,
    };

    try {
      const response = await paymentService.createPayment(userId, data.id, account);
      if (response && response.status === 200) {
        alert('Payment Successful!');
        // 支付成功后回到订单列表
        window.location.href = '/order-list';
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError.response?.data?.message || 'An Error Occurred');
    }
  };

  // 如果没有订单数据，显示错误
  if (!data || !name || price === undefined) {
    return (
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Payment Information</h2>
        <p className="text-center text-red-500">No order information available.</p>
      </div>
    );
  }

  return (
    <div className={`max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-lg ${className || ''}`}>
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      <h2 className="text-2xl font-bold text-center mb-4">Payment Information</h2>
      <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
      <p>
        <strong>Product:</strong> {name}
      </p>
      <p>
        <strong>Single Item Price:</strong> ${price.toFixed(2)}
      </p>
      <p>
        <strong>Quantity:</strong> {quantity}
      </p>
      <p>
        <strong>Total Amount:</strong> ${total}
      </p>

      <form onSubmit={handlePayment} className="mt-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500mb-2">Order Quantity: {data.quantity}</p>
          <label className="block text-sm font-medium mb-1" htmlFor="cardNumber">
            Your Account ID
          </label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={handleCardNumberChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Your Account ID"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="cardName">
            Address
          </label>
          <input
            type="text"
            id="cardName"
            value={cardName}
            onChange={handleCardNameChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Address"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Make Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentInfo;
