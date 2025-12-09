/**
 * 订单信息页面组件
 * 显示订单详情并允许用户创建订单
 */

import type React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSession, orderService } from '../../services';
import type { ButtonClickHandler, OrderInfoLocationState, OrderInfoPageProps } from '../../types';

/**
 * OrderInfo 订单信息页面组件
 * 显示产品订单信息并提供创建订单功能
 * @param props - 组件属性
 * @returns 订单信息页面 JSX 元素
 */
const OrderInfo: React.FC<OrderInfoPageProps> = ({ className }) => {
  // 获取路由状态
  const location = useLocation();
  const navigate = useNavigate();

  // 从路由状态中获取产品信息
  const { productId, name, price, quantity, description } =
    (location.state as OrderInfoLocationState) || {};

  /**
   * 处理创建订单提交
   * @param e - 按钮点击事件
   */
  const handleSubmit: ButtonClickHandler = async (e) => {
    e.preventDefault();

    // 获取用户会话
    const sessionData = getSession();
    if (!sessionData) {
      alert('Please login first.');
      navigate('/login');
      return;
    }

    const userId = sessionData.userId;

    try {
      // 调用服务创建订单
      const response = await orderService.create(userId, {
        productId: productId,
        quantity: quantity,
      });

      // 检查订单创建是否成功
      if (response && response.status === 200) {
        const data = response.data;
        navigate('/payment-info', {
          state: {
            productId,
            data,
            name,
            price,
            quantity,
            total: (price * quantity).toFixed(2),
          },
        });
      } else {
        alert('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('An error occurred while creating the order. Please try again.');
    }
  };

  // 如果没有产品信息，显示错误
  if (!productId || !name || price === undefined) {
    return (
      <div className="max-w-lg mx-auto my-10 p-8 bg-white rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
          Order Information
        </h2>
        <p className="text-center text-red-500">No product information available.</p>
      </div>
    );
  }

  return (
    <div
      className={`max-w-lg mx-auto my-10 p-8 bg-white rounded-2xl shadow-2xl ${className || ''}`}
    >
      <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Order Information</h2>
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="text-lg">
          <p className="font-semibold text-gray-700">
            Price: <span className="text-gray-900">${price.toFixed(2)}</span>
          </p>
          <p className="font-semibold text-gray-700">
            Quantity: <span className="text-gray-900">{quantity}</span>
          </p>
          <p className="font-bold text-gray-800mt-4 text-xl">
            Total: <span className="text-green-600">${(price * quantity).toFixed(2)}</span>
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Create Order
        </button>
      </div>
    </div>
  );
};

export default OrderInfo;
