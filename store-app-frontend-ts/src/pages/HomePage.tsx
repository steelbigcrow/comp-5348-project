/**
 * 首页组件
 * 显示产品列表页面
 */

import type React from 'react';
import type { HomePageProps } from '../types';
import ProductList from './product/ProductList';

/**
 * HomePage 首页组件
 * 作为应用的主页，展示产品列表
 * @param props - 组件属性
 * @returns 首页 JSX 元素
 */
const HomePage: React.FC<HomePageProps> = ({ className }) => {
  return (
    <div className={className}>
      <ProductList />
    </div>
  );
};

export default HomePage;
