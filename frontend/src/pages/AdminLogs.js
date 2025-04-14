import React, { useState, useEffect } from 'react';
import { Table, Card, Select, DatePicker, Space, Tag, Input } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  const [filters, setFilters] = useState({
    dateRange: null,
    action: null,
    username: null,
    resourceType: null
  });

  const fetchLogs = async (page = 1, pageSize = 20) => {
    setLoading(true);
    try {
      let url = `/api/logs/admin?page=${page}&per_page=${pageSize}`;
      
      // 添加筛选条件
      if (filters.dateRange) {
        url += `&start_date=${filters.dateRange[0].format('YYYY-MM-DD')}`;
        url += `&end_date=${filters.dateRange[1].format('YYYY-MM-DD')}`;
      }
      if (filters.action) {
        url += `&action=${filters.action}`;
      }
      if (filters.username) {
        url += `&username=${filters.username}`;
      }
      if (filters.resourceType) {
        url += `&resource_type=${filters.resourceType}`;
      }

      const response = await axios.get(url);
      setLogs(response.data.logs);
      setPagination({
        ...pagination,
        current: page,
        total: response.data.total
      });
    } catch (error) {
      console.error('获取日志失败:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const handleTableChange = (pagination) => {
    fetchLogs(pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: '用户',
      dataIndex: ['user', 'username'],
      key: 'username',
      width: 120,
    },
    {
      title: '操作时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      width: 180,
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (action) => {
        let color = 'blue';
        switch (action) {
          case 'upload':
            color = 'green';
            break;
          case 'delete':
            color = 'red';
            break;
          case 'share':
            color = 'purple';
            break;
          default:
            color = 'blue';
        }
        return <Tag color={color}>{action}</Tag>;
      },
    },
    {
      title: '资源类型',
      dataIndex: 'resource_type',
      key: 'resource_type',
      width: 100,
    },
    {
      title: '资源ID',
      dataIndex: 'resource_id',
      key: 'resource_id',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'success' ? 'success' : 'error'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '详情',
      dataIndex: 'details',
      key: 'details',
      render: (details) => {
        if (!details) return '-';
        return typeof details === 'string' ? details : JSON.stringify(details);
      },
    },
    {
      title: 'IP地址',
      dataIndex: 'ip_address',
      key: 'ip_address',
      width: 120,
    }
  ];

  return (
    <Card title="系统日志">
      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          placeholder="用户名"
          style={{ width: 200 }}
          onSearch={(value) => {
            setFilters({ ...filters, username: value });
          }}
        />
        <RangePicker
          onChange={(dates) => {
            setFilters({ ...filters, dateRange: dates });
          }}
        />
        <Select
          style={{ width: 120 }}
          placeholder="操作类型"
          allowClear
          onChange={(value) => {
            setFilters({ ...filters, action: value });
          }}
        >
          {/* 操作类型选项 */}
        </Select>
        <Select
          style={{ width: 120 }}
          placeholder="资源类型"
          allowClear
          onChange={(value) => {
            setFilters({ ...filters, resourceType: value });
          }}
        >
          <Option value="file">文件</Option>
          <Option value="user">用户</Option>
          <Option value="permission">权限</Option>
        </Select>
      </Space>
      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 1300 }}
      />
    </Card>
  );
};

export default AdminLogs; 