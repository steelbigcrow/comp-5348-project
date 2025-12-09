import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 获取根元素
const container = document.getElementById('root');

// 确保容器存在
if (!container) {
  throw new Error('Failed to find the root element');
}

// 使用 React 18 的 createRoot API
const root = createRoot(container);

// 渲染应用
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// 性能监控
//如果你想开始测量应用性能，可以传入一个函数来记录结果
//例如: reportWebVitals(console.log)
//或发送到分析端点。了解更多: https://bit.ly/CRA-vitals
reportWebVitals();