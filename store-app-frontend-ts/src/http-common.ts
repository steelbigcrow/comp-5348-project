/**
 * Axios HTTP客户端配置
 *配置基础 URL 和默认请求头
 */

import axios, { type AxiosInstance } from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8080';

/**
 * 创建并配置 Axios 实例
 * 用于所有 API 请求
 */
const http: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-type': 'application/json',
  },
});

export default http;
