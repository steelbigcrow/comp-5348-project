import type React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

// 导入公共组件
import { Navbar } from './components';
// 导入页面组件
import {
  HomePage,
  Login,
  OrderInfo,
  OrderList,
  PaymentInfo,
  ProductDetail,
  ProductList,
  Profile,
  Register,
} from './pages';

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
          {/* 主页 - 产品列表 */}
          <Route path="/" element={<HomePage />} />

          {/* 认证 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 用户信息 */}
          <Route path="/profile" element={<Profile />} />

          {/* 订单流 */}
          <Route path="/order-info" element={<OrderInfo />} />
          <Route path="/payment-info" element={<PaymentInfo />} />
          <Route path="/order-list" element={<OrderList />} />

          {/* 产品列表/详情 */}
          <Route path="/product" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
