/**
 * 服务层统一导出
 * 从此文件导入所有 API 服务
 */

//============================================
// 默认导出（服务对象）
// ============================================
export { default as userService } from './userService';
export { default as productService } from './productService';
export { default as orderService } from './orderService';
export { default as paymentService } from './paymentService';
export { default as sessionUtil } from './sessionUtil';

// ============================================
// 用户服务方法导出
// ============================================
export {
  login,
  register,
  getUser,
  updateUser,
} from './userService';

// ============================================
// 产品服务方法导出
// ============================================
export {
  getAllProducts,
  getProductList,
  getProduct,
  createProduct,
  updateProduct,
} from './productService';

// ============================================
// 订单服务方法导出
// ============================================
export {
  getOrderList,
  getOrderListByUser,
  getOrder,
  createOrder,
  updateOrder,
  cancelOrder,
} from './orderService';

// ============================================
// 支付服务方法导出
// ============================================
export {
  createPayment,
  getPayment,
  cancelPayment,
} from './paymentService';

// ============================================
// 会话工具方法导出
// ============================================
export {
  getUserId,
  setUserId,
  getSession,
  setSession,
  clearSession,
  isLoggedIn,
} from './sessionUtil';