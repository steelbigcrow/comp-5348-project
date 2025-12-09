/**
 * 用户资料页面组件
 * 显示和编辑用户个人信息
 */

import type { AxiosError } from 'axios';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, userService } from '../../services';
import type {
  FormSubmitHandler,
  InputChangeHandler,
  UserProfileFormData,
  UserProfilePageProps,
} from '../../types';

/**
 * API 错误响应类型
 */
interface ApiError {
  message?: string;
}

/**
 * Profile 用户资料页面组件
 * 显示用户信息并提供编辑功能
 * @param props - 组件属性
 * @returns 用户资料页面 JSX 元素
 */
const Profile: React.FC<UserProfilePageProps> = ({ className }) => {
  // 表单数据状态
  const [formData, setFormData] = useState<UserProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // 错误状态
  const [error, setError] = useState<string>('');

  // 获取用户会话
  const sessionData = getSession();
  const userId = sessionData?.userId;

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

    if (!userId) {
      setError('Please login first.');
      return;
    }

    userService
      .update(userId, formData)
      .then((response) => {
        // 检查响应状态是否为 200（成功）
        if (response.status === 200) {
          console.log('Profile update successful');
          // 重定向到首页
          navigate('/');
        }
      })
      .catch((err: AxiosError<ApiError>) => {
        // 处理更新失败的错误
        if (err.response) {
          console.error('Error response:', err.response.data);
          setError(
            err.response.data?.message || 'Failed to update profile. Please try again later.',
          );
        } else if (err.request) {
          console.error('No response from server:', err.request);
          setError('Error: No response from server. Please try again.');
        } else {
          console.error('Error:', err.message);
          setError('Error: Something went wrong. Please try again.');
        }
      });

    console.log('Updating user:', formData);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) {
          console.error('User ID not found in session.');
          setError('Please login to view profile.');
          return;
        }

        // 获取用户数据
        const response = await userService.get(userId);
        // 填充表单数据
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          password: response.data.password || '',
        });
      } catch (err) {
        const axiosError = err as AxiosError<ApiError>;
        setError(axiosError.message || 'Failed to fetch user data. Please try again later.');
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <>
      {error && (
        <div className="">
          <div className="flex justify-end">
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-auto max-w-sm ml-4"
              role="alert"
            >
              <strong className="font-bold">Error </strong>
              <span className="block sm:inline">{error}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setError('')}
                  className="text-red-700 hover:text-red-900"
                  aria-label="Close error message"
                >
                  ×
                </button>
              </span>
            </div>
          </div>
        </div>
      )}
      <div
        className={`max-w-lg mx-auto my-10 p-6 bg-white rounded-lg shadow-lg ${className || ''}`}
      >
        <h2 className="text-2xl font-bold text-center mb-4">User Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-gray-700">
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-gray-700">
              Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Edit Profile
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
