/**
 * 页面组件统一导出
 * 从此文件导入所有页面组件
 */

// ============================================
// 认证页面
// ============================================
export { default as Login } from './auth/Login/Login';
export { default as Register } from './auth/Register/Register';
//============================================
// 首页
// ============================================
export { default as HomePage } from './HomePage';

// ============================================
// 订单页面
// ============================================
export { default as OrderInfo } from './order/OrderInfo';
export { default as OrderList } from './order/OrderList';

// ============================================
// 支付页面
// ============================================
export { default as PaymentInfo } from './payment/PaymentInfo';

// ============================================
// 产品页面
// ============================================
export { default as ProductDetail } from './product/ProductDetail';

// ============================================
// 用户页面
// ============================================
export { default as Profile } from './user/Profile';
