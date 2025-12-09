/**
 * 首页组件
 * 显示产品列表页面
 */

import React from 'react';
import ProductDetail from './product/ProductDetail';
import { HomePageProps } from '../types';

/**
 * HomePage 首页组件
 * 作为应用的主页，展示产品列表
 * @param props - 组件属性
 * @returns 首页 JSX 元素
 */
const HomePage: React.FC<HomePageProps> = ({ className }) => {
  return (
    <div className={className}>
      <ProductDetail />
    </div>
  );
};

export default HomePage;