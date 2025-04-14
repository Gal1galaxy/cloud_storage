/**
 * 格式化文件大小
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化后的文件大小
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

/**
 * 获取文件图标
 * @param {string} mimeType - 文件MIME类型
 * @param {string} filename - 文件名
 * @returns {string} 文件图标类型
 */
export const getFileIcon = (mimeType, filename) => {
  if (!mimeType) return 'file';
  
  const type = mimeType.toLowerCase();
  const ext = filename.split('.').pop().toLowerCase();
  
  if (type.includes('image')) return 'file-image';
  if (type.includes('pdf')) return 'file-pdf';
  if (type.includes('word') || ext === 'doc' || ext === 'docx') return 'file-word';
  if (type.includes('excel') || ext === 'xls' || ext === 'xlsx') return 'file-excel';
  if (type.includes('powerpoint') || ext === 'ppt' || ext === 'pptx') return 'file-ppt';
  if (type.includes('text')) return 'file-text';
  if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return 'file-zip';
  
  return 'file';
};

/**
 * 检查文件类型是否支持预览
 * @param {string} mimeType - 文件MIME类型
 * @param {string} filename - 文件名
 * @returns {boolean} 是否支持预览
 */
export const isPreviewable = (mimeType, filename) => {
  if (!mimeType) return false;
  
  const type = mimeType.toLowerCase();
  const ext = filename.split('.').pop().toLowerCase();
  
  // 支持预览的文件类型
  const previewableTypes = [
    'image/',
    'text/',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  return previewableTypes.some(t => type.startsWith(t)) ||
         ['doc', 'docx', 'xls', 'xlsx', 'txt', 'pdf'].includes(ext);
};

/**
 * 获取文件扩展名
 * @param {string} filename - 文件名
 * @returns {string} 文件扩展名
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

/**
 * 检查文件是否为图片
 * @param {string} mimeType - 文件MIME类型
 * @returns {boolean} 是否为图片
 */
export const isImage = (mimeType) => {
  if (!mimeType) return false;
  return mimeType.toLowerCase().startsWith('image/');
};

/**
 * 检查文件是否为文档
 * @param {string} mimeType - 文件MIME类型
 * @param {string} filename - 文件名
 * @returns {boolean} 是否为文档
 */
export const isDocument = (mimeType, filename) => {
  if (!mimeType || !filename) return false;
  
  const type = mimeType.toLowerCase();
  const ext = getFileExtension(filename);
  
  return type.includes('word') ||
         type.includes('excel') ||
         type.includes('powerpoint') ||
         type.includes('pdf') ||
         ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'].includes(ext);
}; 