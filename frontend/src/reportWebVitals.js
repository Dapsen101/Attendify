// This file handles web vitals reporting for performance monitoring.
// It uses the web-vitals library to measure and report metrics like
// CLS (Cumulative Layout Shift), FID (First Input Delay), FCP (First Contentful Paint),
// LCP (Largest Contentful Paint), and TTFB (Time to First Byte).
// The onPerfEntry callback can be passed to send metrics to analytics.
const reportWebVitals = onPerfEntry => {
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
