import React from 'react';
import { Typography } from 'antd';

const { Paragraph } = Typography;

const WordPreview = ({ data }) => {
  return (
    <div style={{ padding: '20px' }}>
      {data.content.map((paragraph, index) => (
        <Paragraph key={index}>
          {paragraph}
        </Paragraph>
      ))}
    </div>
  );
};

export default WordPreview; 