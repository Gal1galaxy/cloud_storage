import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const PDFPreview = ({ fileInfo }) => {
  if (!fileInfo || !fileInfo.content) {
    return <div>No PDF content available</div>;
  }

  // 限制显示前20页
  const pagesToShow = fileInfo.content.slice(0, 20);

  return (
    <div style={{ textAlign: 'center' }}>
      {fileInfo.total_pages > 20 && (
        <div style={{ marginBottom: 16, color: '#666' }}>
          <Text type="secondary">
            文档共 {fileInfo.total_pages} 页，显示前 20 页预览
          </Text>
        </div>
      )}
      
      {pagesToShow.map((pageData, index) => (
        <div key={index} style={{ margin: '20px 0' }}>
          <div style={{ marginBottom: 8 }}>
            <Text type="secondary">第 {pageData.page} 页</Text>
          </div>
          <img
            src={`data:image/png;base64,${pageData.image}`}
            alt={`Page ${pageData.page}`}
            style={{
              maxWidth: '100%',
              height: 'auto',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          />
          {index < pagesToShow.length - 1 && (
            <div 
              style={{ 
                borderBottom: '1px dashed #d9d9d9',
                margin: '24px 0'
              }} 
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PDFPreview; 