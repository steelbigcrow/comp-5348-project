/**
 * 服务层统一导出
 * 从此文件导入所有 API 服务
 */

// ============================================
// 订单服务方法导出
// ============================================
export {
  cancelOrder,
  createOrder,
  default as orderService,
  getOrder,
  getOrderList,
  getOrderListByUser,
  updateOrder,
} from './orderService';
// ============================================
// 支付服务方法导出
// ============================================
export {
  cancelPayment,
  createPayment,
  default as paymentService,
  getPayment,
} from './paymentService';
// ============================================
// 产品服务方法导出
// ============================================
export {
  createProduct,
  default as productService,
  getAllProducts,
  getProduct,
  getProductList,
  updateProduct,
} from './productService';
// ============================================
// 会话工具方法导出
// ============================================
export {
  clearSession,
  default as sessionUtil,
  getSession,
  getUserId,
  isLoggedIn,
  setSession,
  setUserId,
} from './sessionUtil';
//============================================
// 默认导出（服务对象）
// ============================================
// ============================================
// 用户服务方法导出
// ============================================
export { default as userService, getUser, login, register, updateUser } from './userService';
