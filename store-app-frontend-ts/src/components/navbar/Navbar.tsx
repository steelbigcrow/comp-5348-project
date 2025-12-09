/**
 * 导航栏组件
 * 显示网站导航链接和用户登录状态
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavbarProps } from '../../types';
import { getSession, clearSession } from '../../services/sessionUtil';

/**
 * Navbar 导航栏组件
 * 根据用户登录状态显示不同的导航链接
 * @param props - 组件属性
 * @returns 导航栏 JSX 元素
 */
const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const sessionData = getSession();

  /**
   * 切换移动端菜单显示状态
   */
  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  /**
   * 处理用户登出
   * 清除会话数据并刷新页面
   */
  const handleLogout = (): void => {
    clearSession();
    window.location.reload();
  };

  return (
    <nav className={`bg-blue-600 ${className || ''}`}>
      <div className="max-w-6xl mx-auto px-4 py-3flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <Link to="/">Brand</Link>
        </div><div className="hidden md:flex space-x-4">
          {sessionData && sessionData.userId ? (
            <>
              <Link
                to="/order-list"
                className="text-white hover:bg-blue-500 px-3 py-2 rounded"
              >
                Order List
              </Link>
              <Link
                to="/profile"
                className="text-white hover:bg-blue-500 px-3 py-2 rounded"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded ml-4"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:bg-blue-500 px-3 py-2 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white hover:bg-blue-500 px-3 py-2 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
        <button
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-blue-500`}>
        <a href="#" className="block text-white hover:bg-blue-500 px-4 py-2">
          Home
        </a>
        <a href="#" className="block text-white hover:bg-blue-500 px-4 py-2">
          About
        </a>
        <a href="#" className="block text-white hover:bg-blue-500 px-4 py-2">
          Services
        </a>
        <a href="#" className="block text-white hover:bg-blue-500 px-4 py-2">
          Contact
        </a>
      </div>
    </nav>
  );
};

export default Navbar;