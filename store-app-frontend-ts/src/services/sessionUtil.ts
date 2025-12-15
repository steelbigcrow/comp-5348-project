/**
 * 会话工具服务
 * 管理用户会话数据的存储和获取
 */

import type { SessionData } from '../types';

/**
 * 会话存储键名常量
 */
const SESSION_KEYS = {
  USER_ID: 'userId',
} as const;

/**
 * 获取会话中的用户ID
 * @returns 用户ID，如果不存在则返回 null
 */
export const getUserId = (): number | null => {
  const userId = sessionStorage.getItem(SESSION_KEYS.USER_ID);
  if (!userId) {
    return null;
  }

  const parsedUserId = parseInt(userId, 10);
  return Number.isFinite(parsedUserId) ? parsedUserId : null;
};

/**
 * 设置会话中的用户ID
 * @param userId - 要存储的用户ID
 */
export const setUserId = (userId: number): void => {
  sessionStorage.setItem(SESSION_KEYS.USER_ID, userId.toString());
};

/**
 * 获取完整的会话数据
 * @returns 会话数据对象，如果用户未登录则返回 null
 */
export const getSession = (): SessionData | null => {
  const userId = getUserId();
  if (userId === null) {
    return null;
  }
  return { userId };
};

/**
 * 设置会话数据
 * @param data - 要存储的会话数据
 */
export const setSession = (data: SessionData): void => {
  setUserId(data.userId);
};

/**
 * 清除会话数据
 *用于用户登出时清除所有会话信息
 */
export const clearSession = (): void => {
  sessionStorage.removeItem(SESSION_KEYS.USER_ID);
};

/**
 * 检查用户是否已登录
 * @returns 如果用户已登录返回 true，否则返回 false
 */
export const isLoggedIn = (): boolean => {
  return getUserId() !== null;
};

/**
 * 会话工具对象
 * 提供所有会话管理方法的统一导出
 */
const sessionUtil = {
  getUserId,
  setUserId,
  getSession,
  setSession,
  clearSession,
  isLoggedIn,
};

export default sessionUtil;
