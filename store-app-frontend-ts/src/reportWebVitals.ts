import { ReportHandler } from 'web-vitals';

/**
 * 性能监控函数
 * 用于测量和报告 Web Vitals 性能指标
 *
 * @param onPerfEntry - 可选的回调函数，用于处理性能条目
 */
const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;