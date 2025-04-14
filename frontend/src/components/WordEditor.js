import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const WordEditor = ({ fileInfo }) => {
  if (!fileInfo || !fileInfo.content) {
    return <div>No content available</div>;
  }

  const renderContent = (content) => {
    return content.map((item, index) => {
      if (item.type === 'paragraph') {
        return (
          <Paragraph 
            key={index} 
            className={item.style}
            style={{ 
              margin: '12px 0',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          >
            {item.text}
          </Paragraph>
        );
      } else if (item.type === 'table') {
        return (
          <div 
            key={index} 
            style={{ 
              margin: '16px 0',
              overflowX: 'auto'
            }}
          >
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #d9d9d9'
            }}>
              <tbody>
                {item.data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td 
                        key={cellIndex}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #d9d9d9',
                          backgroundColor: rowIndex === 0 ? '#fafafa' : 'white'
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="word-preview" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={4} style={{ marginBottom: '24px', textAlign: 'center' }}>
        {fileInfo.filename}
      </Title>
      <div className="word-content">
        {renderContent(fileInfo.content)}
      </div>
    </div>
  );
};

export default WordEditor; 