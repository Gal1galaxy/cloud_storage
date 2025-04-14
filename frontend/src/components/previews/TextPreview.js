import React from 'react';
import { Typography } from 'antd';

const { Paragraph } = Typography;

const TextPreview = ({ data }) => {
  return (
    <div style={{ padding: '20px' }}>
      <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
        {data.content}
      </Paragraph>
    </div>
  );
};

export default TextPreview; 