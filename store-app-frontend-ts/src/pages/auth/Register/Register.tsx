/**
 * 注册页面组件
 * 处理用户注册功能
 */

import type { AxiosError } from 'axios';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../../../components';
import { setSession, userService } from '../../../services';
import type {
  FormSubmitHandler,
  InputChangeHandler,
  RegisterFormData,
  RegisterPageProps,
} from '../../../types';

/**
 * API 错误响应类型
 */
interface ApiError {
  message?: string;
}

/**
 * Register 注册页面组件
 * 提供用户注册表单和验证功能
 * @param props - 组件属性
 * @returns 注册页面 JSX 元素
 */
const Register: React.FC<RegisterPageProps> = ({ className }) => {
  // 表单数据状态
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // 错误消息状态
  const [error, setError] = useState<string>('');

  // 路由导航
  const _navigate = useNavigate();

  /**
   * 处理输入框变更
   * @param e - 输入框变更事件
   */
  const handleChange: InputChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * 处理表单提交
   * @param e - 表单提交事件
   */
  const handleSubmit: FormSubmitHandler = (e) => {
    e.preventDefault();

    userService
      .create(formData)
      .then((response) => {
        // 检查响应状态是否为 200（成功）
        if (response.status === 200) {
          console.log('Registration successful');
          const userId = response.data.id;
          // 保存用户会话
          setSession({ userId });
          // 重定向到首页
          window.location.href = '/';
        }
      })
      .catch((err: AxiosError<ApiError>) => {
        // 处理注册失败的错误
        if (err.response) {
          console.error('Error response:', err.response.data);
          setError(err.response.data?.message || 'Registration failed');
        } else if (err.request) {
          console.error('No response from server:', err.request);
          setError('No response from server. Please try again.');
        } else {
          console.error('Error:', err.message);
          setError('Something went wrong. Please try again.');
        }
      });

    console.log('Registering user:', formData);
  };

  return (
    <>
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      <div
        className={`min-h-screen flex justify-center items-center bg-gray-100 ${className || ''}`}
      >
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Register</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-gray-600 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-gray-600 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
