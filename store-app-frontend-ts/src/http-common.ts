/**
 * Axios HTTP客户端配置
 *配置基础 URL 和默认请求头
 */

import axios, { type AxiosInstance } from 'axios';

/**
 * 创建并配置 Axios 实例
 * 用于所有 API 请求
 */
const http: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

export default http;
