/**
 * 用户服务
 * 处理用户相关的 API 请求
 */

import http from '../http-common';
import type {
  IUserService,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
  UserResponse,
} from '../types';

/**
 * 用户登录
 * @param data - 登录请求数据（邮箱和密码）
 * @returns Promise包含用户信息的响应
 */
export const login = async (data: LoginRequest): Promise<UserResponse> => {
  return http.post<User>('/store/users/login', data);
};

/**
 * 用户注册
 * @param data - 注册请求数据
 * @returns Promise 包含新创建用户信息的响应
 */
export const register = async (data: RegisterRequest): Promise<UserResponse> => {
  return http.post<User>('/store/users/register', data);
};

/**
 * 获取用户信息
 * @param id - 用户ID
 * @returns Promise 包含用户信息的响应
 */
export const getUser = async (id: number): Promise<UserResponse> => {
  return http.get<User>(`/store/users/${id}/info`);
};

/**
 * 更新用户信息
 * @param id - 用户ID
 * @param data - 更新的用户数据
 * @returns Promise 包含更新后用户信息的响应
 */
export const updateUser = async (id: number, data: UpdateUserRequest): Promise<UserResponse> => {
  return http.put<User>(`/store/users/${id}/info/update`, data);
};

/**
 * 用户服务对象
 * 实现 IUserService 接口
 */
const userService: IUserService = {
  login,
  create: register,
  get: getUser,
  update: updateUser,
};

export default userService;
