import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const PDFPreview = ({ data }) => {
  return (
    <div style={{ padding: '20px' }}>
      <Title level={4}>PDF预览 (共 {data.total_pages} 页)</Title>
      {data.pages.map((page, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <Title level={5}>第 {index + 1} 页</Title>
          <Paragraph>{page}</Paragraph>
        </div>
      ))}
    </div>
  );
};

export default PDFPreview; 