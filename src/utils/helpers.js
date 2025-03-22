// Format date to YYYY-MM-DD
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Format date to more readable format: MMM DD, YYYY
export function formatReadableDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format template by replacing placeholders with actual values
export function formatTemplate(template, values) {
  if (!template) return '';
  let result = template;
  
  for (const key in values) {
    const placeholder = `{${key}}`;
    result = result.replace(new RegExp(placeholder, 'g'), values[key]);
  }
  
  return result;
}

// Generate a random ID for new items
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Truncate text if it's too long
export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Get today's date as YYYY-MM-DD
export function getToday() {
  return formatDate(new Date());
}

// Add days to a date
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return formatDate(result);
}

// Check if a date is before another date
export function isBefore(date1, date2) {
  return new Date(date1) < new Date(date2);
}

// Check if a date is after another date
export function isAfter(date1, date2) {
  return new Date(date1) > new Date(date2);
}

// Check if a coupon is valid based on dates
export function isCouponValid(coupon) {
  const today = getToday();
  return !isBefore(today, coupon.validFrom) && !isAfter(today, coupon.validTo);
}

// Simulate a network request with delay
export function simulateRequest(data, delay = 500) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
}

// 以下是新增的移动端适配相关函数

// 检测设备类型
export function getDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isWechat = /micromessenger/.test(userAgent);
  
  return {
    isIOS,
    isAndroid,
    isWechat,
    isMobile: isIOS || isAndroid
  };
}

// 检测屏幕方向
export function getOrientation() {
  if (window.orientation !== undefined) {
    // iOS的旧方法
    return Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
  }
  
  // 现代浏览器
  return window.matchMedia("(orientation: portrait)").matches ? 'portrait' : 'landscape';
}

// 监听屏幕旋转
export function onOrientationChange(callback) {
  if (window.orientation !== undefined) {
    window.addEventListener('orientationchange', callback);
  } else {
    window.matchMedia("(orientation: portrait)").addEventListener('change', callback);
  }
}

// 获取安全区域尺寸
export function getSafeAreaInsets() {
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('--sat') || '0', 10),
    right: parseInt(style.getPropertyValue('--sar') || '0', 10),
    bottom: parseInt(style.getPropertyValue('--sab') || '0', 10),
    left: parseInt(style.getPropertyValue('--sal') || '0', 10)
  };
}

// 设置防抖函数，优化resize事件
export function debounce(fn, delay = 300) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 禁止页面缩放
export function preventZoom() {
  document.addEventListener('touchstart', (event) => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, { passive: false });
  
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
} 