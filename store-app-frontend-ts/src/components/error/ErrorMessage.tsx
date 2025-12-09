/**
 * 错误消息组件
 * 显示错误提示信息，5秒后自动关闭
 */

import React, { useEffect } from 'react';
import { ErrorMessageProps } from '../../types';

/**
 * 自动关闭延迟时间（毫秒）
 */
const AUTO_CLOSE_DELAY = 5000;

/**
 * ErrorMessage 错误消息组件
 * 在页面右上角显示错误提示，5秒后自动消失
 * @param props - 组件属性
 * @param props.message - 错误消息内容
 * @param props.onClose - 关闭回调函数
 * @returns 错误消息 JSX 元素
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  useEffect(() => {
    // 设置定时器，5秒后自动关闭
    const timer = setTimeout(() => {
      onClose();
    }, AUTO_CLOSE_DELAY);

    // 组件卸载时清除定时器
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed top-10 right-4 max-w-xs bg-red-300 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-lg z-50"
      role="alert"
    >
      <p className="font-bold">An Error Occurred</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;