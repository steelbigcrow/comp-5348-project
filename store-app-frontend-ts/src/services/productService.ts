/**
 * 产品服务
 * 处理产品相关的 API 请求
 */

import http from '../http-common';
import type {
  CreateProductRequest,
  IProductService,
  Product,
  ProductListResponse,
  ProductResponse,
  UpdateProductRequest,
} from '../types';

/**
 * 获取所有产品列表
 * @returns Promise 包含产品数组的响应
 */
export const getAllProducts = async (): Promise<ProductListResponse> => {
  return http.get<Product[]>('/store/users/-1/products');
};

/**
 * 获取产品列表（别名方法，保持与原服务兼容）
 * @returns Promise 包含产品数组的响应
 */
export const getProductList = async (): Promise<ProductListResponse> => {
  return getAllProducts();
};

/**
 * 获取单个产品详情
 * @param id - 产品ID
 * @returns Promise 包含产品信息的响应
 */
export const getProduct = async (userId: number, id: number): Promise<ProductResponse> => {
  return http.get<Product>(`/store/users/${userId}/products/${id}`);
};

/**
 * 创建新产品
 * @param data - 创建产品的请求数据
 * @returns Promise 包含新创建产品信息的响应
 */
export const createProduct = async (
  userId: number,
  data: CreateProductRequest,
): Promise<ProductResponse> => {
  return http.post<Product>(`/store/users/${userId}/products`, data);
};

/**
 * 更新产品信息
 * @param id - 产品ID
 * @param data - 更新的产品数据
 * @returns Promise 包含更新后产品信息的响应
 */
export const updateProduct = async (
  userId: number,
  id: number,
  data: UpdateProductRequest,
): Promise<ProductResponse> => {
  return http.put<Product>(`/store/users/${userId}/products/${id}`, data);
};

/**
 * 删除产品（目前无 UI 使用，但与后端接口保持一致）
 */
export const deleteProduct = async (userId: number, id: number): Promise<ProductResponse> => {
  return http.delete<Product>(`/store/users/${userId}/products/${id}`);
};

/**
 * 产品服务对象
 * 实现 IProductService 接口
 */
const productService: IProductService = {
  getProductList,
  getAllProducts,
  getProduct,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
};

export default productService;
