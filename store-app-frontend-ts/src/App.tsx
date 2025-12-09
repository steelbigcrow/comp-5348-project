import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// 导入页面组件
import {
  HomePage,
  Login,
  Register,
  Profile,
  OrderList,
  OrderInfo,
  PaymentInfo,
  ProductDetail,
} from './pages';

// 导入公共组件
import { Navbar } from './components';

/**
 * 主应用组件
 * 包含导航栏和路由配置
 */
const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="mt-3">
        <Routes>
          {/* 首页 - 产品列表 */}
          <Route path="/" element={<HomePage />} />
          
          {/* 认证路由 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* 用户路由 */}
          <Route path="/profile" element={<Profile />} />
          
          {/* 订单路由 */}
          <Route path="/orders" element={<OrderList />} />
          <Route path="/order/:id" element={<OrderInfo />} />
          
          {/* 支付路由 */}
          <Route path="/payment/:orderId" element={<PaymentInfo />} />
          
          {/* 产品路由 */}
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;