/**
 * 登录页面组件
 * 处理用户登录功能
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
  LoginFormData,
  LoginPageProps,
} from '../../../types';

/**
 * API 错误响应类型
 */
interface ApiError {
  message?: string;
}

/**
 * Login 登录页面组件
 * 提供用户登录表单和验证功能
 * @param props - 组件属性
 * @returns 登录页面 JSX 元素
 */
const Login: React.FC<LoginPageProps> = ({ className }) => {
  // 表单数据状态
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  // 错误消息状态
  const [error, setError] = useState<string>('');

  // 路由导航
  const navigate = useNavigate();

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
      .login(formData)
      .then((response) => {
        // 检查响应状态是否为 200（成功）
        if (response.status === 200) {
          const userId = response.data.id;
          // 保存用户会话
          setSession({ userId });
          // 重定向到首页
          navigate('/', { replace: true });
        }
      })
      .catch((err: AxiosError<ApiError>) => {
        // 处理登录失败的错误
        if (err.response) {
          console.error('Error response:', err.response.data);
          setError(err.response.data?.message || 'Login failed');
        } else if (err.request) {
          console.error('No response from server:', err.request);
          setError('No response from server. Please try again.');
        } else {
          console.error('Error:', err.message);
          setError('Something went wrong. Please try again.');
        }
      });

    console.log('Logging in user:', formData);
  };

  /**
   * 处理忘记密码点击
   */
  const handleForgotPassword = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    // TODO: 实现忘记密码功能
    alert('Forgot password feature coming soon!');
  };

  return (
    <div className={`min-h-screen flex justify-center items-center bg-gray-100 ${className || ''}`}>
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
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
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
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
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-blue-500 hover:underline bg-transparent border-none cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
