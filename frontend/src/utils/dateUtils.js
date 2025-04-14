/**
 * 格式化日期
 * @param {string|Date} date - 日期字符串或Date对象
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

/**
 * 计算剩余时间
 * @param {string|Date} date - 目标日期
 * @returns {string} 剩余时间描述
 */
export const getTimeLeft = (date) => {
  if (!date) return '';
  
  const target = new Date(date);
  if (isNaN(target.getTime())) return '';
  
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  
  if (diff <= 0) return '已过期';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}天${hours}小时`;
  } else if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  } else {
    return `${minutes}分钟`;
  }
};

/**
 * 格式化文件大小
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化后的文件大小
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

/**
 * 检查日期是否过期
 * @param {string|Date} date - 日期
 * @returns {boolean} 是否过期
 */
export const isExpired = (date) => {
  if (!date) return false;
  
  const target = new Date(date);
  if (isNaN(target.getTime())) return false;
  
  return target.getTime() < new Date().getTime();
}; 