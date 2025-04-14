import React from 'react';
import { Typography, Table } from 'antd';

const { Title, Paragraph } = Typography;

const FilePreview = ({ fileData }) => {
  if (!fileData || !fileData.content) {
    return <div>No preview available</div>;
  }

  const renderWordContent = (content) => {
    return content.map((item, index) => {
      if (item.type === 'paragraph') {
        return (
          <Paragraph key={index} className={item.style}>
            {item.text}
          </Paragraph>
        );
      } else if (item.type === 'table') {
        return (
          <Table
            key={index}
            dataSource={item.data.slice(1)}
            columns={item.data[0].map((header, i) => ({
              title: header,
              dataIndex: i.toString(),
              key: i.toString()
            }))}
            pagination={false}
            bordered
          />
        );
      }
      return null;
    });
  };

  const renderPdfContent = (content) => {
    return content.map((page, index) => (
      <div key={index} className="pdf-page">
        <Title level={4}>Page {page.page}</Title>
        <img 
          src={page.image} 
          alt={`Page ${page.page}`}
          style={{ width: '100%', marginBottom: 20 }}
        />
        <Paragraph>{page.text}</Paragraph>
      </div>
    ));
  };

  if (fileData.file_type.includes('word')) {
    return <div className="word-preview">{renderWordContent(fileData.content)}</div>;
  } else if (fileData.file_type === 'application/pdf') {
    return <div className="pdf-preview">{renderPdfContent(fileData.content)}</div>;
  }

  return <div>Unsupported file type</div>;
};

export default FilePreview; 