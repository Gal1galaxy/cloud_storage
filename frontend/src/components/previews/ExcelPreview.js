import React from 'react';
import { Table } from 'antd';

const ExcelPreview = ({ data }) => {
  const columns = data.columns.map(col => ({
    title: col,
    dataIndex: col,
    key: col,
    ellipsis: true
  }));

  return (
    <div style={{ padding: '20px' }}>
      <Table
        columns={columns}
        dataSource={data.data}
        scroll={{ x: true }}
        pagination={{ pageSize: 50 }}
        size="small"
      />
    </div>
  );
};

export default ExcelPreview; 